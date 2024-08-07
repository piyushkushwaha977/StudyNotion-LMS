/* eslint-disable no-unused-vars */
const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const SubSection = require("../models/SubSection");
const Section = require("../models/Section")
const CourseProgress = require("../models/CourseProgress")
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const {convertSecondsToDuration} = require("../utils/secToDurarion")


// COURSE CREATE CONTROLLER

exports.createCourse = async( req , res ) => {

    try {
    // Get all required fields from request body
    let {
        courseName,
        courseDescription,
        whatYouWillLearn, 
        price ,
        tag: _tag ,
        category,
        instructions: _instructions,
        status} = req.body;
       
       // Fetch Image from files
        const thumbnail = req.files.thumbnailImage;

      // Parsing Tag & Instructions
      const tag = JSON.parse(_tag);
      const instructions = JSON.parse(_instructions);

       // Validation of data and image
       if(
           !(courseName||
            courseDescription||
            whatYouWillLearn||
            price||
            tag.length||
            thumbnail||
            category||
            instructions.length)
        ){
        return res.status(400).json({
            success:false,
            message:'ALL THE FIELDS ARE REQUIRED..'
        })
       }
       // Checking course Status
       if( !status || status === undefined){
             status = "Draft"
       }
       // Validate the Instructor
       const userId = req.user.id;
       const instructorDetails = await User.findById(userId, {
            accountType:"Instructor"
    })
      //  console.log("INSTRUCTOR DETAILS VIA ID For Course Creation ", instructorDetails);

       if(!instructorDetails){
        return res.status(458).json({
            success:false,
            message:'Instructor not Found try with INSTRUCTOR  Acc..'
        })
       };
       // Check Category is Valid or not
       const categoryDetails = await Category.findById(category);
       if(!categoryDetails){
        return res.status(458).json({
            success:false,
            message:'categoryDetails not Found try with another CATEG0RY..'
        })
       };

       // Upload Image To Cloudinary
       const thumbnailImage = await uploadImageToCloudinary(
         thumbnail,
        process.env.FOLDER_NAME
    )
        // console.log("Thumbnail image of course ",thumbnailImage)
       // Create an DB entry of Course
       const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            tag,
            status:status,
            instructions,
       });

       // Update the Instructor User Schema with new course added
       await User.findByIdAndUpdate( 
           {_id:instructorDetails._id},
           {
            $push:{
                courses:newCourse._id,
            }
           },
           {new:true}
       );
       
        const categoryDetail2 = await Category.findByIdAndUpdate(

             {_id : categoryDetails._id},
             {
                $push:{
                    courses: newCourse._id
                }
             },
             {new:true},
            //  console.log("courses added to category Schema")
       );
     
       return res.status(200).json({
        success:true,
        message:'COURSE CREATED SUCCESSFULLY ',
        data:newCourse
       })

    } 
    catch (error) {
        console.log("Error while creating course --", error)
        return res.status(458).json({
            success:false,
            message:"Some Issue While Creating Course",
            errro:error.message
        })
    }
};

// Edit Course Details Controllers dddd
exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        // console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course Updated Successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }


// Controller for getAllCourses
exports.getAllCourses = async(req,res) => {

  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
};


// Handler for GET ALL DETAILS OF COURSE
exports.getCourseDetails = async (req, res) => {
    try {
        
        // Checking course id 
        const {courseId} = req.body;

        const courseDetails  = await Course.findOne(
                                   {_id : courseId })
                                .populate(
                                {
                                    path:"instructor",
                                    populate:{
                                        path:"additionalDetails"
                                    }
                                  }
                                ).populate("category")
                                 .populate("ratingAndReviews") 
                                 .populate(
                                   {
                                     path:"courseContent",
                                     populate:{
                                        path:"subSection",
                                        select: "-videoUrl",
                                     }
                                   }
                                 )
                                 .exec();

        //validation
        if(!courseDetails) {
            return res.status(400).json({
                success:false,
                message:`Could not find the course with this ID == ${courseId}`,
            });
        }

      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }

          let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)


        //return response
        return res.status(200).json({
            success:true,
            message:"Course Details fetched successfully",
            data:courseDetails,
            totalDuration
        })      
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

// Handler for GET FULL COURSE  DETAILS OF A COURSE
exports.getFullCourseDetails = async (req, res) => {
  try {
    const courseId = req.body.courseId
    // console.log("courseId from backend " , courseId)
    const userId = req.user.id
    // console.log("userId from backend " , userId)
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    })

    // console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Handler for Getting Instructor Courses List 
exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
};

// Handler for Deleting the Whole Course 
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
    // console.log("courseId from Delete Server : " , courseId)
    // console.log("courseId from Delete Server : " , req.body)
    // return ;

      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found to Delete" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studendsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course Deleted Successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error  issue while deleting course",
        error: error.message,
      })
    }
  };
  