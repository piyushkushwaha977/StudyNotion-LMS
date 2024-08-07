import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import PageLoader from "../components/common/PageLoader"
import Sidebar from "../components/core/DashBorad/Sidebar"

export default function DashboardPage() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-screen w-full place-items-center bg-black">
        <PageLoader/>
      </div>
    )
  }

  return (
    <div className="flex w-full  h-[calc(100vh)]  bg-black">
        <div className="w-full md:max-w-[1700px] mx-auto mt-8 md:mt-14  flex md:gap-6 lg:gap-0 gap-2 bg-black">
          <div className= " w-[40px] md:w-[200px] lg:w-[256px] ">
            <Sidebar />
          </div>
          
      <div className="relative w-full md:w-[84%]  mx-auto  overflow-auto   ">
        <div className=" w-full  md:w-[90%] mx-auto py-10 ">
          <Outlet />
        </div>
      </div>
      </div>
    </div>
  )
}


