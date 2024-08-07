const Category = require("../models/Category");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }
  

// CREATE CATEGORY HANDLER FUNCTION
exports.createCategory = async(req, res) => {
   try {
     // fetch the data
     const { name , description } = req.body;
     // validate on data
     if( !name ) {
         return res.status(400).json({
             success:false,
             message:'ALL FIELDS ARE REQUIRED'
         })
     };
     // Create DB entry of tag
     const categoryDetails = await Category.create({
         name:name,
         description:description,
     });
    //  console.log("Created Category details --", categoryDetails)
 
     return res.status(200).json({
         success:true,
         message:'Category Created Successfully via Admin'
     })

   } 
   catch (error) {
    console.log("Error while creating Category-- ",error)
        return res.status(458).json({
        success:false,
        message:'FAILED Category CREATION ERRORRR..',
        Issue:error.message
    })
  }
}
// CONTROLLER OF SHOWALLCATEGORIES

exports.showAllCategories = async( req,res ) => {

    try {
        // Fetch the tag from db
       const allCategory = await Category.find( {} , 
                                            {name:true , description:true}
                                            );
       // retrun all tags in res
       return res.status(200).json({
        success:true,
        message:'ALL CATEGORIES',
        data:allCategory,
       })
    }
    catch (error) {
        return res.status(458).json({
            success:false,
            message:error.message
        })
    }
};

// Handler for Get Category Page Details TODO: OLD ONE WRITTEN BY PIYUSH
// exports.categoryPageDetails = async( req,res ) => {
//     try {
//         const {categoryId} = req.body;
//         // Get Data From Selected Category
//         const selectedCategoryDetails = await Category.findById(categoryId)
//                                                     .populate("courses")
//                                                     .exec();
//         if(!selectedCategoryDetails){
//             return res.status(404).json({
//                 success:false,
//                 message:'NO Data Found ON Selected Category'
//             })
//         } 
//         // Get Data From Differet Category
//         const differentCategoryDetails = await Category.find(
//                                                          {_id: {$nq: categoryId} }  
//                                                     )
//                                                      .populate("courses")
//                                                      .exec();

//         // Get Top Selling Courses Category
//         const  topSellingCategoryDetails = await Category.find()      
        
        
//         // Response
//         return res.status(200).json({
//             success:true,
//             data:{
//                 selectedCategoryDetails,
//                 differentCategoryDetails,
//                 topSellingCategoryDetails,
//             }
//         })

//     }
//      catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }
// }

// Handler for Get Category Page Details 
exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
  
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()
  
      // console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
        
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
  
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }
  