import React from 'react'
import { Link } from 'react-router-dom'
import { RiCheckDoubleFill } from "react-icons/ri";

const PurchaseHistoryPage = () => {
  return (
    <div className=' w-full text-white text-center '>

       <h2 className=' mt-40 text-2xl md:text-4xl'>Hii ✋</h2>
       <h1 className=' text-3xl md:text-5xl text-center'>Explore Our Courses</h1>

   <div className=' w-full mx-auto text-center mt-10 md:mt-[6rem]'>
     <Link to={'/courses-category/web-development'}
       className=' text-4xl font-thin  rounded-2xl w-fit  py-2 px-4 '>
         <RiCheckDoubleFill className='inline text-yellow-100 mr-2'/>
          Courses
       </Link>
       <div className=' w-48 rounded-lg mx-auto h-1 bg-[#da211b] '></div>
   </div>
     </div>
  )
}

export default PurchaseHistoryPage