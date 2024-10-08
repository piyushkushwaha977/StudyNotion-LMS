const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress")
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Course = require("../models/Course");
const { convertSecondsToDuration } = require("../utils/secToDurarion");
require("dotenv").config();

// CONTROLLER FOR UPDATING ADDITIONAL DETAILS(PROFILE) IN USER PROFILE

exports.updateProfile = async( req,res ) => {
    try {
      // Fetch Data 
      const {
        firstName = "",
        lastName = "",
        dateOfBirth = "",
        about = "",
        contactNumber = "",
        gender = "",
      } = req.body
      const id = req.user.id;

      //validate Data Missing
      // Find profileID and update 
      const userDetails = await User.findById(id)
      const profile = await Profile.findById(userDetails.additionalDetails)
  
      //add given data to profile section
      userDetails.firstName = firstName
      userDetails.lastName = lastName
      profile.dateOfBirth = dateOfBirth
      profile.about = about
      profile.gender = gender
      profile.contactNumber = contactNumber

      // Save the Additional Details to Profile Schema
      await profile.save()
      await userDetails.save()

      // Find the updated user details
      const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    return res.json({
			success: true,
			message: "Profile updated successfully",
			updatedUserDetails,
		});
	
    }
     catch (error) {
        console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
    };
}

// CONTROLLER FOR DELETING USER ACCOUNT BUT FIRST DELETE ITS ADDITIONAL DETAILS AND
// THEN DELETE ITS WHOLE PROFILE

exports.deleteAccount = async( req,res ) => {
    // learn something about cron job or time schedule
try {
        const id = req.user.id ;
        // console.log(`GIVEN USER ID FOR DELETING ACCOUNT = ${id}`);
        // find user valid or not
        const user = await User.findById({ _id : id });
        
        if(!user){
            return res.status(404).json({
                success:false,
                message:'ACCOUNT OR USER BOTH ARE NOT FOUND'
            })
        };
        // FIRST DELETE ADDITIONAL PROFILE DATA 
        await Profile.findByIdAndDelete({ _id: user.additionalDetails })

        // DELETING STUDENTS PURCHASED COURSES
        for (const courseId of user.courses) {
            await Course.findByIdAndUpdate(
              courseId,
              { $pull: { studendsEnrolled: id } },
              { new: true }
            )
          }
        
        // DELETE WHOLE USER DETAILS 
        await User.findByIdAndDelete({ _id : id});
    
        res.status(200).json({
            success: true,
            message: "User Account Deleted Successfully",
        });
} 
catch (error) {
    console.log(error);
	return	res
			.status(500)
			.json({ success: false, message: "User Cannot  Deleted successfully" });
	}
};

// JUST FOR FUN GET ALL USER DETAILS HANDLER (not necessary)
exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    // console.log("Userdetails ID == " , id)
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()
    // console.log("All Details of A User - " , userDetails)
  return res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// HANDLER FOR UPDATE USER PICTURE

exports.updateDisplayPicture = async (req, res) => {
    try {
    
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;
        const uploadedImage = await uploadImageToCloudinary( 
                                    displayPicture , 
                                    process.env.FOLDER_NAME ,
                                    1000,
                                    1000);
        // console.log(`UPLOADED IMAGE DETAILS == `, uploadedImage);

        const updatedProfile = await User.findByIdAndUpdate( { _id : userId },
                               { image: uploadedImage.secure_url },
                                {new:true} )
     
        res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }
};

// Handler for GET ALL ENROLLED COURSES BY USER
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()

    // console.log(" UserDetails from Enrolled courses Controllers ::: " , userDetails)
    
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseId: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Handler for Get Required Information of Instructor Dashboard
exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studendsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
