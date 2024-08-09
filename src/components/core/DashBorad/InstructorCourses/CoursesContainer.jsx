import { useSelector } from "react-redux"

import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { MdModeEditOutline } from "react-icons/md";
// import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { Link, useNavigate } from "react-router-dom"

import { formattedDate } from "../../../../utils/dateFormatter"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPIs"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"
import PageLoader from "../../../common/PageLoader"
import HighLightText from "../../HomPage/HighLightText"

export default function CoursesContainer({ courses, setCourses }) {
  // const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  // console.log("All Course ", courses)

  if (loading) {
    // console.log("payment loading")
    return (
      <div className="grid h-screen w-full place-items-center bg-black">
        <PageLoader/>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl w-full  border border-richblack-800 ">
        <div className='w-full flex flex-wrap py-2 pb-6'>
          {courses?.length === 0 ? (
            <section>
              <div className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses found

                <Link to={'/dashboard/add-course'}>
                  <HighLightText>Create Course</HighLightText>
                </Link>
              </div>
            </section>
          ) : (
            courses?.map((course) => (
              <div
                key={course._id}
                className="flex flex-col w-[300px] mx-auto border rounded-lg bg-[#0a0a0a]  border-b border-richblack-800 my-3 py-3 md:py-6"
              >
                <div className="flex mx-auto">
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[140px] w-[250px]  rounded-lg object-cover"
                  />
                {/* Buttons of Edit and Delete */}
                <div className="text-sm flex flex-col  gap-4 font-medium text-richblack-100 ">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`)
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <MdModeEditOutline size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      })
                    }}
                    title="Delete"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line  size={20} />
                  </button>
                </div>
              </div>
                {/* Card Content */}
                <>
                <div className="flex flex-col px-2 gap-y-1  justify-between">
                    <p className="text-lg font-semibold text-richblack-5">
                      {course.courseName}
                    </p>
                    <p className="text-xs text-richblack-300">
                      {course.courseDescription.split(" ").length >
                      TRUNCATE_LENGTH
                        ? course.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course.courseDescription}
                    </p>
                    <div className="text-sm font-medium text-richblack-100">
                       ₹{course.price}
                    </div>
                    <p className="text-[12px] text-white">
                      Created: {formattedDate(course.createdAt)}
                    </p>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </div>
                        Published
                      </div>
                    )}
                  </div>
                </>
              
              </div>
            ))
          )}
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
