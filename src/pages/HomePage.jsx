import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import HighLightText from '../components/core/HomPage/HighLightText';
import CTAButton from '../components/core/HomPage/CTAButton';
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomPage/CodeBlocks';
import CHButton from '../components/core/HomPage/CHButton';
import LearningLanguageSection from '../components/core/HomPage/LearningLanguageSection';
import TimelineSection from '../components/core/HomPage/TimelineSection';
import InstructorSection from '../components/core/HomPage/InstructorSection';
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/HomPage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';


const HomePage = () => {
  return (
  
<div className='left-0 top-0  -z-10  w-full'>
  {/* GRADIENT -  */}
   <div className="relative w-full bg-black"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div><div className=" fixed left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>

    <div className='relative h-full'>
       {/* SECTION 1 */}
       <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        {/* Become a Instructor Button */}
        <Link to={"/signup"}
        >
        <div className="flex items-center mt-36 gap-3 cursor-pointer text-white font-semibold bg-gradient-to-r from-gray-800
         to-black px-4 py-2 rounded-full border border-gray-600 hover:scale-105 duration-200 hover:text-gray-500 hover:border-gray-800 hover:from-black hover:to-gray-900">
          Become an Instructor 
          <FaArrowRight className=''/>
        </div>
        </Link>


        {/* Heading */}
        <div className="text-center text-3xl md:text-4xl font-semibold">
          <span className=' text-3xl md:text-4xl bg-gradient-to-r  from-[#C797EB] to-[#F0ECFC] text-transparent bg-clip-text'>Empower Your Future with</span>
          <HighLightText text={"Coding Skills"} />
        </div>
        
        {/* Sub Heading */}
        <div className="-mt-3 w-[90%] font-poppins text-center text-[16px] md:text-lg font-bold text-richblack-200">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        {/* CTA Buttons */}
        <div className=" mt-4 md:mt-8 flex flex-row gap-7">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More 
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book Demo
          </CTAButton>
        </div>
     
        {/* Video Section */}
        <div className="mx-3 mt-8 md:mt-12 my-7 shadow-[10px_-5px_50px_-5px] shadow-[#91A6FF]">
          <video
            className=" md:shadow-[14px_10px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>
 
          {/* Code Section 1  */}
          <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock your
                <HighLightText text={"Future Potential"} /> with our online
                courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it Yourself ",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute bg-yellow-200 w-[250px] h-[200px] rounded-full blur-[90px]"></div>}
          />
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighLightText text={"Coding in Seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Daily Lessons",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimate from "react";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute bg-blue-200 w-[250px] h-[200px] rounded-full blur-[90px] "></div>}
          />
        </div>
   
        {/* Explore Section */}
        <div className='relative w-full'>
        <ExploreMore/>
        </div>
        

    </div>

       {/* Section 2 */}
    <div className="bg-pure-greys-5 text-richblack-700">
      <div className="homepage_bg z-20 h-[320px]">
            {/* Explore Full Catagory Section */}
           <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
             <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CHButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CHButton>
              <CHButton active={false} linkto={"/login"}>
                Learn More
              </CHButton>
             </div>
           </div>
         </div>

         <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
          {/* Job that is in Demand - Section 1 */}
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%] ">
              Get the skills you need for a{" "}
              <HighLightText text={"Job Which are in Demand."} />
            </div>
            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[20px] font-semibold">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <div className=' w-fit mx-auto md:ml-1'>
              <CTAButton active={true} linkto={"/signup"}>
                <div className="">Learn More</div>
              </CTAButton>
              </div>
            </div>
          </div>

          {/* Timeline Section - Section 2 */}
          <TimelineSection />

          {/* Learning Language Section - Section 3 */}
          <LearningLanguageSection />
        </div> 

    </div>

    
    {/* Section 3 */}
    <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        {/* Become a instructor section */}
        <InstructorSection />
    </div>


    <div>
      <ReviewSlider/>
    </div>

      {/* Footer */}
      <Footer />






        </div>

    </div>
</div>
  )
}

export default HomePage