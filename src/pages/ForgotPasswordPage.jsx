import { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getPasswordResetToken } from "../services/operations/authAPIs"
import PageLoader from "../components/common/PageLoader"

const ForgotPassword = () => {

  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(getPasswordResetToken(email, setEmailSent))
  }

  if (loading ) {
    return (
      <div className="grid h-screen w-full place-items-center bg-black">
        <PageLoader/>
      </div>
    )
  }
  
  return (
    <div className=" w-full grid min-h-[calc(100vh)] place-items-center bg-black ">
     { !loading && (
         <div className="max-w-[500px] p-4 lg:p-8 mx-auto">
           <h1 className="text-[2rem] font-semibold leading-[2.375rem] bg-gradient-to-r from-[#6e58d2c3] to-[#923CB5] text-transparent bg-clip-text  ">
             {!emailSent ? "Reset your password" : "Check email"}
           </h1>
           <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100 font-bold">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>
          <form onSubmit={handleOnSubmit}>
            {!emailSent && (
              <label className="w-full">
                <p className="mb-1 text-[1rem] leading-[1.375rem] text-richblack-5">
                  Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="form-style w-full py-3 rounded-lg px-2"
                />
              </label>
            )}
            <button
              type="submit"
              className="mt-6 w-1/2 rounded-[8px] bg-gradient-to-r from-[#923CB5] to-[#1d1a1a] py-[12px] px-[12px] font-bold text-white"
            >
              {!emailSent ? "Sumbit" : "Resend Email"}
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword