import RenderSteps from "./RenderSteps"

export default function AddCourse() {
 

  return (
    <>
      <div className=" w-full mx-auto flex  items-start md:gap-x-6">
        <div className="flex flex-col">
          <h1 className=" mb-8  md:mb-12 md:text-start pl-4 md:pl-14 text-4xl font-medium bg-gradient-to-r from-[#6e58d2c3] to-[#923CB5] text-transparent bg-clip-text ">
            Add Course
          </h1>
          <div className=" w-full  mx-auto ">
            <RenderSteps />
          </div>
        </div>
        {/* Course Upload Tips */}
        <div className="sticky top-24 mt-24 hidden max-w-[420px] flex-1 rounded-md border-[1px] border-richblack-700 bg-pure-greys-900 px-4 py-6 xl:block">
          <p className="mb-8 text-xl font-bold  text-richblack-5">⚡ Course Upload Tips</p>
          <ul className="ml-5 list-item list-disc space-y-4 text-sm font-poppins text-richblack-5">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li>
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li>Make Announcements to notify any important</li>
            <li>Notes to all enrolled students at once.</li>
          </ul>
        </div>
      </div>
    </>
  )
}
