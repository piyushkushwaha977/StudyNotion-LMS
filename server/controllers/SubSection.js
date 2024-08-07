const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


// Controller for Creating a Subsection
exports.createSubSection = async(req,res) => {
    try {

        // Fetch Data and video from file
        const { sectionId, title, description} = req.body;
        const video = req.files.video;
   
        // Now Validate the Data 
        if( !(sectionId||title||description||video)) {
            return res.status(458).json({
                success:false,
                message:'ALL FIELDS ARE REQUIRED TO CREATE SUB-SEC'
            })
        };
        // console.log("Video of Subsection" , video)

        // Upload Video to Cloud and Get an URL
        const uploadedVideo = await uploadImageToCloudinary(
                                            video,
                                            process.env.FOLDER_NAME
                                        )
        // Create Subsection
        const subSectionDetails = await SubSection.create({
                                       title:title,
                                       timeDuration:`${uploadedVideo.duration}`,
                                       description:description,
                                       videoUrl:uploadedVideo.secure_url
                                     }
                                    );
                                  
        // Update the corresponding section with the newly created sub-section 
        const updatedSection = await Section.findByIdAndUpdate(
                                                   {_id:sectionId},
                                                   {$push:{subSection:subSectionDetails._id}},
                                                   {new:true}, 
                                            )
                                            .populate("subSection")

                return res.status(200).json({
                success:true,
                message:'NEW SUB SECTION CREATED SUCCESSFULLY',
                data:updatedSection,
            })
    }
     catch (error) {
        console.log("Error while creating subSection : ",error)
        return res.status(400).json({
            success:false,
            message:'ERROR WHILE CREATING SUB-SECTION',
            error:error.message
        })
    }
};

// Controller for updating subSection
exports.updateSubSection = async( req,res ) => {
    try {
        // fetch data 
        const {sectionId, subSectionId, title, description} = req.body;
        const subSection = await SubSection.findById(subSectionId)

        if(!subSection){
            return res.status(404).json({
                success:true,
                message:'SUBSECTION NOT FOUND FOR UPDATING'
            })
        }
        if( title !== undefined ){
            subSection.title = title
        }
        if( description !== undefined ){
            subSection.description = description
        }
        if( req.files && req.files.video !== undefined ){
            const video = req.files.video
            const uploadedVideoDetails = await uploadImageToCloudinary( video,
                                                            process.env.FOLDER_NAME
                                                )
            subSection.videoUrl = uploadedVideoDetails.secure_url
            subSection.timeDuration = `{Time Duration of Uploaded Video -- ${uploadedVideoDetails.duration}}`                                    
        }
        await subSection.save()
        
         // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection")

        // console.log("updated Section data == ", updatedSection)
        // console.log("updated SubSection data == ", updatedSection.subSection)

        // Return updatedSection in response
        return res.status(200).json({
            success:true,
            message:'Subsection and Section both Updated Successfully ',
            data:updatedSection
        })
    } 
    catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "An error occurred while updating the section and subsection",
        })
      }
}


// Controller for Deleting Sub-section 
exports.deleteSubSection = async (req, res) => {
	try {
		//HW -> req.params -> test
		const { sectionId, subSectionId } = req.body;
 
        await Section.findByIdAndUpdate({_id: sectionId},
            {
                $pull:{
                subSection:subSectionId
            }
        })

        const Subsection = await SubSection.findByIdAndDelete( {_id: subSectionId})
        if(!Subsection){
            return res.status(404).json({
                success:false,
                message:'Subsection Not Found To Delete'
            })
        }
        
        const section = Section.findById(sectionId).populate("subSection")

        return res.status(200).json({
            success:true,
            message:"SUBSECTION DELETED SUCCESSFULLY",
            data:section
        })
	} 
    catch (error) {
		console.error("Error deleting subSection:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

