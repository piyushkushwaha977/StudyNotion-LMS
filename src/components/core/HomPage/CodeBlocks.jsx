import React from "react";
import CTAButton from "./CTAButton";
import { TypeAnimation } from "react-type-animation";
import { FaArrowRight } from "react-icons/fa";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGradient,
  codeColor,
}) => {
  return (
    <div className={`flex ${position} w-[90%] my-12 md:my-20 justify-between flex-col lg:gap-8 gap-6 mx-auto`}>


      {/* Section 1  */}
      <div className="w-[100%] lg:w-[50%] flex flex-col gap-6">
        {heading}

        {/* Sub Heading */}
        <div className="text-richblack-300 text-base font-bold w-[75%] -mt-3">
          {subheading}
        </div>

        {/* Button Group */}
        <div className="flex mt-4 gap-7 md:mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.link}>
            <span className="flex items-center gap-2">
              {ctabtn1.btnText} <FaArrowRight className=" hidden md:block"/>
            </span>
          </CTAButton>
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.link}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* Section 2 */}

      <div className="h-fit mt-4 border-t border-l rounded-md code-border flex flex-row py-3 text-[10px]
       sm:text-sm leading-[20px] sm:leading-6 relative w-[100%] lg:w-[370px]">
        {backgroundGradient}
        {/* Indexing */}
        <div className="text-center flex flex-col  w-[10%] select-none text-richblack-400 font-inter font-bold ">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
          <p>12</p>

        </div>

        {/* Codes */}
        <div
          className={` w-full md:w-[70%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}
        >
          <TypeAnimation
            sequence={[codeblock, 1000, ""]}
            cursor={true}
            repeat={Infinity}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
