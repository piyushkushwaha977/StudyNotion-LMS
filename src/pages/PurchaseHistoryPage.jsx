import React from 'react'
import { Link } from 'react-router-dom'

const PurchaseHistoryPage = () => {
  return (
    <div className=' w-full '>
       <h1 className=' text-white text-3xl md:text-6xl font-bold text-center mt-40'>SHOW NEW - COURSES</h1>

   <div className=' w-full mx-auto text-center mt-10 md:mt-[6rem]'>
   <Link to={'/courses-category/web-development'}
       className=' text-yellow-200 underline text-4xl font-poppins font-bold rounded-2xl w-fit  py-2 px-4'
       >Show courses</Link>
   </div>
     </div>
  )
}

export default PurchaseHistoryPage