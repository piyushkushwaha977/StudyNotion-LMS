import React from 'react'
import CHButton from "./CHButton";
import { FaArrowRight } from "react-icons/fa";
import Instructor from "../../../assets/Images/Instructor.png";
import HighLightText from './HighLightText';

const InstructorSection = () => {
  return (
    <div>
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-[50%] shadow-[10px_-5px_50px_-5px] shadow-[#91A6FF]">
            <img
              src={Instructor}
              alt=""
              className=" md:shadow-white  md:shadow-[-10px_-10px_0_0] "
            />
          </div>
          <div className="lg:w-[50%] flex gap-10 flex-col">
            <h1 className="lg:w-[50%] text-4xl font-semibold ">
              Become an
              <HighLightText text={"Instructor"} />
            </h1>

            <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
              Instructors from around the world teach millions of students on
              StudyNotion. We provide the tools and skills to teach what you
              love.
            </p>

            <div className=" mx-auto md:w-fit">
              <CHButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-3">
                  Start Teaching Today
                  <FaArrowRight className='inline' />
                </div>
              </CHButton>
            </div>
          </div>
        </div>
    </div>
  )
}

export default InstructorSection