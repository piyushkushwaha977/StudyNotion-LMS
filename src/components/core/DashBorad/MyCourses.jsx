import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPIs"
import IconBtn from "../../common/IconBtn"
import PageLoader from "../../common/PageLoader"
import CoursesContainer from "./InstructorCourses/CoursesContainer"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(null)
  


  useEffect(() => {

    const fetchCourses = async () => {
      setLoading(true)
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    }
    fetchCourses()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    // console.log("payment loading")
    return (
      <div className="grid h-screen w-full place-items-center bg-black">
        <PageLoader/>
      </div>
    )
  }


  return ( 
    <div className=" max-w-full md:max-w-7xl  mx-auto">
    <div className="mb-14 mr-2  flex items-center justify-between">
      <h1 className="text-3xl ml-2 font-medium bg-gradient-to-r from-[#6e58d2c3] to-[#923CB5] text-transparent bg-clip-text">My Courses</h1>
      <IconBtn
        customClasses={"font-bold"}
        text="Add Course"
        onclick={() => navigate("/dashboard/add-course")}
      >
        <VscAdd />
      </IconBtn>
    </div>
    {courses && <CoursesContainer courses={courses} setCourses={setCourses} />}
  </div>
  )

}
