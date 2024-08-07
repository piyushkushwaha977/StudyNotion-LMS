import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

export default function Settings() {
  return (
    <div className="lg:w-9/12 mx-auto">
      <h1 className=" mb-10 md:mb-14 pl-4 text-4xl font-medium bg-gradient-to-r from-[#6e58d2c3] to-[#923CB5] text-transparent bg-clip-text">
        Edit Profile
      </h1>
      {/* Change Profile Picture */}
      <ChangeProfilePicture />
      {/* Profile */}
      <EditProfile />
      {/* Password */}
      <UpdatePassword />
      {/* Delete Account */}
      <DeleteAccount />
    </div>
  )
}
