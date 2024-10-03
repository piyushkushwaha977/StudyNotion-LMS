import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiCheckDoubleFill, RiExternalLinkFill } from "react-icons/ri";
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';

const PurchaseHistoryPage = () => {

  const [ coursesLink , setCoursesLink ] = useState([]);
  const [ loading, setLoading ] = useState(false);

  console.log("courses LInk data" , coursesLink)
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

  return (
    <div className=' w-full text-white text-center '>

       <h2 className=' mt-40 text-2xl md:text-4xl'>Hii ✋</h2>
       <h1 className=' text-3xl md:text-5xl text-center'>Explore Our Courses</h1>

   <div className=' w-full mx-auto text-center mt-4 md:mt-[2rem]'>
     <Link to={'/courses-category/web-development'}
       className=' text-4xl font-thin  rounded-2xl w-fit  py-2 px-4 '>
         <RiCheckDoubleFill className='inline text-yellow-100 mr-2'/>
         New Courses
       </Link>
       <div className=' w-72 rounded-lg mx-auto h-1 bg-[#da211b] '></div>
   </div>

   {loading && (  <h2>Loading....</h2> )}
 
               <div className=' w-fit mx-auto mt-5 '>
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
                                  className="rounded-lg "
                                  key={i}
                                >
                                <div 
                                  className='py-1 font-poppins md:text-xl text-lg bg-gradient-to-r text-pure-greys-300  hover:bg-pure-greys-900 flex gap-1'> 
                                  <span><RiExternalLinkFill className='inline text-xl md:text-2xl text-caribbeangreen-200 mb-1 ml-2 '/></span>
                                  {"  "}
                                  {subLink.name}
                                </div>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )
                       }
              </div>

  </div>
  )
}

export default PurchaseHistoryPage