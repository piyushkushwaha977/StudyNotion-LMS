import React from 'react'
import { Link } from 'react-router-dom'

const CTAButton = ({children , linkto , active}) => {
  return ( 
    <>
<Link to={linkto}>
<div
  className={`overflow-hidden flex items-center p-1 px-2  
  h-12 ${active ? ' bg-gradient-to-r from-[#923CB5] to-[#1d1a1a]' : ' bg-gradient-to-r from-[#20A4F3] to-[#182B3A]' }
   text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group`}
>
  {children}
  <span
    className="absolute w-42 h-32 -top-8 -left-2 bg-purple-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-right"
  ></span>
  <span
    className="absolute w-36 h-32 -top-8 -left-2 bg-black rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-right"
  ></span>
  <span
    className="absolute w-36 h-32 -top-8 -left-2 bg-purple-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-right"
  ></span>
  <span
    className="  flex group-hover:opacity-100  group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5  z-10"
    > {children} </span>
</div>

</Link>
</>
  )
}

export default CTAButton