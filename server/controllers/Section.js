const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");



// Controller for creating section or updating it into course 
exports.createSection = async( req, res ) => {
    try {
        const { sectionName, courseId} = req.body;

        if(!(sectionName && courseId )) {
            return res.status(404).json({
                success:false,
                message:'MISSING REQUIRED FIELDS'
            })
        };
        // Creating Section in db
        const newSection = await Section.create({sectionName});
      
        // Entering section into course Schema
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                             courseId , 
                                            {
                                               $push:{
                                                courseContent:newSection._id
                                               }                                     
                                            },
                                            {new:true}
                                        )
                                         .populate( {
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection"
                                            }
                                         })
                                         .exec()       
                                                  
        return res.status(200).json({
            success:true,
            message:'A NEW SECTION CREATED SUCCESSFULLY',
            updatedCourseDetails,
        })                                                               

    } 
    catch (error) {
        return res.status(400).json({
            success:false,
            message:'ISSUE WHILE CREATING SECTION',
            error:error.message
        })  
    }
};

//  Controller for Section Update
exports.updateSection = async( req, res) => {
    try {
        
        const { sectionName, sectionId, courseId } = req.body;

        if(!(sectionName && sectionId && courseId )) {
            return res.status(404).json({
                success:false,
                message:'PLS FILL ALL THE REQUIRED DETAILS'
            })
        };

        // Update Section 
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
                                        {
                                            sectionName
                                        },
                                        {new:true});

        // console.log("updated section", updatedSection)

        const course = await Course.findById(courseId)
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();

        // console.log("Course Details after Section Updated : " , course)

        return res.status(200).json({
            success:true,
            message:'SECTION UPDATED SUCCESSFULLY',
            section:updatedSection,
            data:course
        });                            
       
    } 
    catch (error) {
        console.error("Error updating section:", error)
        return res.status(400).json({
            success:false,
            message:'ISSUE WHILE UPDATING SECTION',
            error:error.message
        })  
    }
};

//  Handler for  Detele Section 
exports.deleteSection = async( req,res) => {
    try {
        // fetch data from Parameter
        const {sectionId , courseId } = req.body

        if(!(sectionId && courseId)){
            return res.status(404).json({
                success:false,
                message:"MISSING IDs FOR DELETE SECTION"
            })
        }

        await Course.findByIdAndUpdate( courseId ,{
            $pull: {
                courseContent:sectionId,
             }
        })
        // findByIdAndDelete
        const section = await Section.findById(sectionId)
         
        if (!section) {
            return res.status(404).json({
              success: false,
              message: "Section not found",
            })
          }
           
           // Delete the associated subsections
         await SubSection.deleteMany({ _id: { $in: section.subSection } })

         await Section.findByIdAndDelete(sectionId)

        // find the updated course and return it
        const course = await Course.findById(courseId)
          .populate({
          path: "courseContent",
          populate: {
          path: "subSection",
          },
        })
         .exec()  

        // return res
        return res.status(200).json({
            success:true,
            message:'SECTION DELETED SUCCESSFULLY',
            data:course
        })
    } 
    catch (error) {
        return res.status(400).json({
            success:false,
            message:'ISSUE WHILE DELETING SECTION',
            error:error.message
        })
    }

};