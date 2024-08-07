/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPIs"
import PageLoader from "../../common/PageLoader"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [loading, setLoading] = useState(false)
  // console.log("Enrolled Courses :" , enrolledCourses)

  useEffect(() => {
    const  getEnrolledCourseDetails = async() => {
      try {
        setLoading(true)
        const res = await getUserEnrolledCourses(token) // Getting all the published and the drafted courses

        // Filtering the published course out
        const filterPublishCourse = res.filter((ele) => ele.status !== "Draft")
        // console.log(
        //   "Viewing all the course that is Published",
        //   filterPublishCourse
        // )
        setEnrolledCourses(filterPublishCourse)
        setLoading(false)
      } catch (error) {
        console.log("Could not fetch enrolled courses.")
      }
    }
    getEnrolledCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

    if (loading || !enrolledCourses) {
    // console.log("payment loading")
    return (
      <div className="grid h-screen w-full place-items-center bg-black">
        <PageLoader/>
      </div>
    )
  }

  return (
    <>
      <div className="text-3xl font-bold bg-gradient-to-r from-[#6e58d2c3] to-[#923CB5] text-transparent bg-clip-text">Enrolled Courses</div>
      { !enrolledCourses.length ? (
        <p className="grid  w-full place-items-center my-36 text-lg md:text-3xl text-richblack-5 py-4 ">
          You have not enrolled in any course yet.
           <h1 className=" mt-4 font-bold text-3xl md:text-5xl text-blue-400 text-center underline ">Check New Courses</h1>
        </p>
      ) : (
        <div className=" flex flex-wrap mx-auto my-8 py-6  text-richblack-5">

          {enrolledCourses.map((course, index) => (
            <div className=" md:w-[18rem]   lg:w-[24rem] mx-auto border border-pure-greys-800 rounded-xl py-3 mb-4" >
              <div
                className="flex flex-col cursor-pointer items-center px-2  md:px-5"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className=" rounded-lg w-[400px] h-[200px] object-cover border-b border-pure-greys-200"
                />
                <div className=" w-full flex justify-between pt-4 px-2 md:px-0  border-t border-pure-greys-200">
                  <p className=" font-bold">{course.courseName}</p>
                  <div className=" whitespace-nowrap">Duration : <span className=" text-brown-100 text-lg underline font-bold">{course?.totalDuration}</span></div>
                </div>
              </div>
              <div className=" w-full flex flex-col px-5">
                <p className=" w-full text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 70)}...`
                      : course.courseDescription}
                  </p>
               <div className="flex flex-col gap-2 px-2 py-3 border-t border-pure-greys-400 pt-2">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage  || 0}
                  height="8px"
                  isLabelVisible={false}
                />
               </div>
              </div>
       
            </div>
          ))}
        </div>
      )}
    </>
  )
}
