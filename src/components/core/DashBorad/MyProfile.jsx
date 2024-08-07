import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
    <div className=" lg:w-9/12 mx-auto overflow-hidden">
      <h1 className=" mb-8 md:mb-14 pl-4 text-4xl font-medium bg-gradient-to-r from-[#6e58d2c3] to-[#923CB5] text-transparent bg-clip-text">
        My Profile
      </h1>
      <div className="  flex flex-col items-center justify-between rounded-md border-[1px] border-richblack-700 
       py-4 px-2 md:p-8 md:px-12">
        <div className="flex items-center gap-2 md:gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-14 md:w-[60px] rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-richblack-5">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <div className=" w-full mt-4">
        <IconBtn
          customClasses = {"md:w-[50%] mx-auto items-center justify-center"  }
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
        </div>
   
      </div>
      <div className=" my-4 md:my-10 flex flex-col gap-y-6 md:gap-y-10 rounded-md border-[1px] border-richblack-700 bg-black p-4 px-5 md:p-8 md:px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <Link to={'/dashboard/settings'}
            className=" bg-yellow-100 text-black flex justify-center items-center gap-2 rounded-lg py-1 md:py-2 px-3">
             Edit  <RiEditBoxLine />
          </Link>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-sm font-medium pb-4`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself ..."}
        </p>
      </div>
      <div className=" my-4 md:my-10 flex flex-col gap-y-3 md:gap-y-10 rounded-md border-[1px] border-richblack-700 bg-black p-4 px md:p-8 md:px-12">
        <div className="flex  w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <Link to={'/dashboard/settings'}
            className=" bg-yellow-100 text-black  flex justify-center items-center gap-2 rounded-lg py-1 md:py-2 px-3">
             Edit  <RiEditBoxLine />
          </Link>
        </div>
        <div className="flex flex-col  lg:flex-row lg:gap-36 max-w-[600px]  ">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5 lg:ml-16">
            <div>
              <p className="mb-2 mt-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
              <p className="text-sm font-medium text-richblack-5">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
