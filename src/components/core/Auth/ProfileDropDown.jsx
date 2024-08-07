import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
// import { RiDashboardHorizontalFill } from "react-icons/ri";
import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { logout } from "../../../services/operations/authAPIs"
import { MdSpaceDashboard } from "react-icons/md";

export default function ProfileDropDown() {
  const {user} = useSelector( (state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))
 
  // useEffect( () => {
  //   getUserDetails( token , navigate)
  // })

  return (
    // DASHBOARD 
  <div className=" flex gap-3">  
    <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
  <div className="flex w-full items-center gap-x-2 py-[7px] px-[12px] text-md font-bold bg-pure-greys-900 text-richblack-25 rounded-l-full rounded-r-full border border-richblack-300
   hover:bg-richblack-900 hover:transition-all hover:duration-300 hover:text-yellow-200">
    Dashboard
    <MdSpaceDashboard className="text-xl" />
  </div>
    </Link>  

    {/* Actual Dropdown */}
    <button className="relative" onClick={() => setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-xl text-richblack-100" />
      </div>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-black"
          ref={ref}
        >
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>
          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
            }}
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  </div>  
  )
}
