import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import PageLoader from "../../common/PageLoader"
import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPIs"
import ConfirmationModal from "../../common/ConfirmationModal"
import { IoLogOut } from "react-icons/io5";
import SidebarLink from "./SidebarLink"
import { FaCartShopping } from "react-icons/fa6";
import { ACCOUNT_TYPE } from "../../../utils/constants"

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  )
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
           <PageLoader/>
      </div>
    )
  }

  return (
    <>
      <div className=" fixed w-[40px] md:w-[200px] lg:w-[256px] flex h-[calc(100vh-3.5rem)]  flex-col border-x-[1px] border-r-richblack-700 bg-black py-16">
        <div className="flex w-[40px] md:w-[200px] lg:w-[256px] mt-11 justify-center flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            )
          })}
               {/* CART LINKS */}
        {
          user?.accountType === ACCOUNT_TYPE.STUDENT  && (
            <Link to={"/dashboard/cart"} className="lg:w-full relative py-1  md:mr-14 text-sm font-medium text-richblack-300 flex justify-center items-center"  >
            <div className=" flex pl-2 gap-x-2  place-items-center lg:mx-auto lg:pr-[100px] ">
              <FaCartShopping className=" pr-[7px] lg:pr-0 lg:pl-1.5 md:ml-0 text-[22px] lg:text-[28px]  text-pure-greys-300  " />
              <span className=" lg:ml-0.5 hidden md:block  lg:text-[18px] font-edu-sa">My Cart</span>
            </div>
          </Link>
          )
        }
        </div>
        <div className="mt-6 mb-6 h-[1px] w-11/12 mx-auto bg-richblack-700" />
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="lg:w-full relative py-2  md:mr-14 text-sm font-medium text-richblack-300 flex justify-center items-center"
          >
            <div className=" flex gap-x-2  place-items-center lg:mx-auto lg:pr-[100px] ">
              <IoLogOut className="ml-1 md:ml-0 text-[22px] md:text-[28px]  text-[#cf0c36]  " />
              <span className=" hidden md:block font-bold lg:text-[18px] font-edu-sa">Logout</span>
            </div>
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
