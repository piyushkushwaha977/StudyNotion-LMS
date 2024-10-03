import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Logo from './Logo'
import { Link, matchPath, useNavigate } from 'react-router-dom'
import {NavbarLinks} from '../../data/navbar-links'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaCartShopping } from "react-icons/fa6";
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import { ACCOUNT_TYPE } from '../../utils/constants'
import { logout } from "../../services/operations/authAPIs"
import { categories } from '../../services/apis'
import { apiConnector } from '../../services/apiConnector'
import { BsChevronDown} from "react-icons/bs"
import { BiSolidCategoryAlt } from "react-icons/bi";
import { RiInformation2Fill, RiMenu3Fill } from "react-icons/ri";
import { MdCall, MdSpaceDashboard } from 'react-icons/md'
import { RiCloseLine } from "react-icons/ri";
import { IoHome } from 'react-icons/io5'
import { IoLogOut } from "react-icons/io5";
import { FaCheckDouble } from "react-icons/fa6";
import { BiSolidLogInCircle } from "react-icons/bi";
import { FaAngleDown } from "react-icons/fa6";
import { RiExternalLinkFill } from "react-icons/ri";

const Navbar = () => {

  const [ isMenuOpen , setIsMenuOpen ] = useState(false)
  const {user} =  useSelector( (state) => state.profile);
  const {totalItems} =  useSelector( (state) => state.cart);
  const {token} = useSelector( (state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef();
  
  const [ coursesLink , setCoursesLink ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  // console.log("courseslink array" , coursesLink)

  useOnClickOutside(ref, () => setIsMenuOpen(false))

  const fetchCoursesData = async() => {
    setLoading(true)
    try {
      let result = await apiConnector("GET", categories.CATEGORIES_API);
      setCoursesLink(result?.data?.data)
      setLoading(false)
    }
     catch (error) {
      console.log("error while fetching courses category for navbar")
      console.log(error);
    }
  }

  useEffect( () => {
    fetchCoursesData()
  },[])

  const matchRoute = (route) => {
      return  matchPath( {path:route} , location.pathname)
  }
  
  function handleMenu(){
     setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className=' fixed w-full  bg-black bg-opacity-70 backdrop-blur-md z-[80] border-b border-pure-greys-800   '>
                      {/* border-b border-pure-greys-700 */}
     <div className=' hidden md:flex  max-w-maxContent mx-auto  items-center  justify-between '>
        
        {/* LOGO -ADDED */}
         <Link to="/" className=' ml-6'>
           <Logo/>
         </Link>   
        
        {/* NAV-ITEMS */}
        <nav>
            <ul className=' flex gap-4 '>
              {
                NavbarLinks.map( (navItem, index) => (
                  <li key={index}  className=' cursor-pointer'>
                           { navItem.title === "Courses" 
                                    ? 
                                    (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p className=' font-bold'>New {navItem.title}</p>
                      <BsChevronDown className=' mt-1' />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-gradient-to-r from-[#FFEFBA] to-[#FFFFFF] 
                        p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center font-bold"> Loading... </p>
                        ) : coursesLink.length ? (
                          <> {/* ?.filter(  (subLink) => subLink?.courses?.length > 0 ) */}
                            {
                              coursesLink
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/courses-category/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-3 lg:pl-2  hover:bg-richblack-50"
                                  key={i}
                                >
                                  <div 
                                  className=' font-bold bg-gradient-to-r from-[#0f0c29] to-[#302b63] text-transparent bg-clip-text'> 
                                  <span><BiSolidCategoryAlt className='inline text-xl text-black '/></span>
                                  {"  "}
                                  {subLink.name}
                                  </div>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                )
                        :
                (<Link to={navItem?.path}>
                  <p className={`${matchRoute(navItem.path) ? " text-yellow-100" : " text-pure-greys-5 hover:text-yellow-100" }`}>
                {navItem.title}
                </p>
                </Link>)      
              }
                </li>
                ))
              }  
            </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <FaCartShopping className="text-2xl text-richblack-100 hover:transition-all duration-500 hover:text-yellow-200" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token === null && (
            <Link to="/login" >
              <button className="rounded-[8px] border border-richblack-400 bg-richblack-900 px-[12px] py-[8px] text-richblack-100 hover:text-yellow-200 font-bold">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-400 bg-richblack-900 px-[12px] py-[8px] hover:text-yellow-200 text-richblack-100 font-bold">
                Sign up
              </button>
            </Link>
          )}
          {
            token !== null && <ProfileDropDown/>
          }
        </div>
    </div>

         {/* MOBILE RESPONSIVE NAVBAR  */}
    <div className=' md:hidden top-0 h-14 flex justify-between items-center '>

          {/* LOGO -ADDED */}
        <Link to="/" className=' ml-2'>
           <div className=' font-semibold text-[26px] bg-gradient-to-r from-[#d1d5bc] to-[#a093b9] text-transparent bg-clip-text'
           > Study<span className=' text-[22px]'>Notion</span> </div>
        </Link> 

          {/* DASHBOARD BUTTON  -ADDED */}
        <div className=' flex gap-x-5'>
          { token && (
           <Link to={"/dashboard/my-profile"}>
            <div className="flex w-full items-center gap-x-1 px-2 py-1.5 text-sm font-bold bg-pure-greys-900 text-richblack-25 rounded-l-full rounded-r-full border border-richblack-300
             hover:bg-richblack-900 hover:transition-all hover:duration-300 hover:text-yellow-200">
                Dashboard
               <MdSpaceDashboard />
            </div>
          </Link>  
          )}

          {
            isMenuOpen ? ( <button
                            onClick={handleMenu}
                            className="mr-4 md:hidden"> 
                             <RiCloseLine  fontSize={28} fill="#AFB2BF" /> 
                          </button>) 
                              : 
                         ( <button
                             onClick={handleMenu}
                             className="mr-4 md:hidden">
                             <RiMenu3Fill fontSize={28} fill="#AFB2BF" />
                          </button>)
          }
       </div>
    </div>

      {
        isMenuOpen && 
         (<motion.div 
           initial={{opacity: 0 , x: 100}}
           animate={{opacity:1 , x: 0}}
           transition={{duration: 0.6}}          
          className=' h-screen md:hidden fixed inset-0 overflow-auto z-[200] translate-x-0   '>
        
           <div className=' flex  min-h-full'>
           {/* Left Section of Navbar */}
            <div className=' w-1/4  bg-pure-greys-800  opacity-60 backdrop-blur-sm  '>
              <div className="mt-12 ml-auto mr-5 h-14 aspect-square rounded-full bg-richblack-400 grid place-items-center text-lg cursor-pointer removeBlueBoxColor">
               <button
                 onClick={handleMenu}
                 className=" md:hidden font-bold"> 
                  <RiCloseLine  fontSize={36} className=' text-black '/> 
               </button>
               </div>
            </div>

             {/* Right Section of Navbar */}

             <div
               ref={ref}
              className=' w-3/4 pt-20 bg-[#080808] text-white'>
               
              <div className=' mx-8 border-b border-pure-greys-500'>
              { token && (
                <div className=' flex flex-col gap-y-4 p-5'>
               { token && (
                  <Link to={"/dashboard/my-profile"}>
                    <div className="flex w-fit items-center gap-x-2 px-4 py-2 text-lg font-bold bg-pure-greys-900 text-richblack-25 rounded-l-full rounded-r-full border border-richblack-300
                         hover:bg-richblack-900 hover:transition-all hover:duration-300 hover:text-yellow-200">
                           Dashboard
                       <MdSpaceDashboard />
                   </div>
                  </Link>  
                  )} 

                {
                  token && (
                    <button
                     onClick={ () => dispatch(logout(navigate))}
                     className=' text-pure-greys-200 flex gap-x-2 items-center  text-xl '> 
                     <IoLogOut className=' inline text-[#c92222be] text-3xl'/>
                     Logout</button>
                  )
                }
               </div>)}
              
              {/* LOGIN / SIGNUP BUTTON FOR MOBILE */}
               {
                !token && (
                  <div className=' flex flex-col gap-y-4 p-5'>
                   <Link to={"/login"} onClick={() => setIsMenuOpen(false)} >
                    <div className=' text-pure-greys-200 text-xl gap-x-2  flex items-center  '> 
                      <FaCheckDouble className=' inline  text-2xl'/>
                      Login 
                     </div>
                   </Link>
                    
                   <Link to={'/signup'} onClick={() => setIsMenuOpen(false)}>
                    <div className=' text-pure-greys-200 text-xl flex gap-x-2 items-center  '> 
                      <BiSolidLogInCircle className=' inline text-2xl'/>
                      SignUp
                     </div>
                   </Link>
                 </div>
                )
              }
              </div>

             <div className=' mx-14 flex flex-col gap-3 pt-4'>
                  <Link to={"/"} onClick={() => setIsMenuOpen(false)}>
                    <div className=' text-pure-greys-200 text-xl gap-x-2  flex items-center  '> 
                      <IoHome className=' inline  text-2xl'/>
                      Home
                     </div>
                   </Link>
                    
                   <Link to={'/about-us'} onClick={() => setIsMenuOpen(false)}>
                    <div className=' text-pure-greys-200 text-xl flex gap-x-2 items-center  '> 
                      <RiInformation2Fill className=' inline text-2xl'/>
                      About Us
                     </div>
                   </Link>

                   <Link to={'/contact-us'} onClick={() => setIsMenuOpen(false)}>
                    <div className=' text-pure-greys-200 text-xl flex gap-x-2 items-center border-b border-pure-greys-500 pb-3 '> 
                      <MdCall className=' inline text-2xl'/>
                      Contact Us
                     </div>
                   </Link>             
             </div> 
 
             {/* Common Routes */}
              <div className=''>
                <div className=' flex flex-col gap-y-5 p-5 '>
                 <>
                  <details open >
                     <summary className=' pl-6 text-yellow-200 text-xl flex gap-x-2 items-center '>
                      <BiSolidCategoryAlt className=' inline text-2xl'/>
                        <span className='border-b border-r-pure-greys-500'> New Courses</span>
                      <FaAngleDown className=' ml-2 inline text-2xl'/>
                     </summary>

                     <div className=' ml-2 mt-2'>
                       {
                        coursesLink.length > 0 ? (
                          <>
                            {
                              coursesLink
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/courses-category/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent  hover:bg-richblack-400 "
                                  key={i}
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                <div 
                                  className='py-1 font-bold text-lg bg-gradient-to-r text-pure-greys-300 underline flex gap-1'> 
                                  <span><RiExternalLinkFill className='inline text-xl text-caribbeangreen-200 mb-1 '/></span>
                                  {"  "}
                                  {subLink.name}
                                  </div>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center"> Courses Not Found</p>
                        )
                       }
                     </div>
                  </details>
                 </>

               </div>

              </div>
          

             </div>

           </div>



         </motion.div>
        )}

 
 
      
 







     
 



  </div>
  )
}

export default Navbar