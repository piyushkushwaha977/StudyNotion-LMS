const jwt = require("jsonwebtoken");
// const User = require("../models/User");
require("dotenv").config();

// MIDDLEWARE FOR AUTHENTICATION
exports.auth = async( req, res, next ) => {

    try {
        // Fetch Data from req 
        const token  =  req?.cookies?.token 
                        || req?.body?.token
                        || req?.header("Authorization")?.replace("Bearer ", "")
        


        // const VaildTokenFromHeader = req.header("Authorization").replace("Bearer ", "")
        // console.log(  "Vaild Token From Header -" , VaildTokenFromHeader)            

        // Check token 
        if( !token ){
            return res.status(404).json({
                success:false,
                message: ' Token Not found for Authentication In Middleware'
            })
        }
        // console.log("Token Fetched By Auth Middleware -- ", token)

        try {
           const decode =  jwt.verify( token , process.env.JWT_SECRET) 
           req.user = decode;
        //    console.log("Auth MIddleware called piyush ")
        //    console.log( `decoded token ==`, decode );
        } 
        catch (error) {
            console.log(error);
            return res.status(404).json({
                success:false,
                message: ' ERROR TOKEN NOT FOUND'
            })
        };

        next();
    }
    catch (error) {
        console.log("Auth middleware Error",error)
        return res.status(404).json({
            success:false,
            message: ' ERROR WHILE VERIFYING TOKEN FOR AUTH',
            problem :error.message
        })
    
    }
};

// MIDDLEWARES FOR STUDENT ONLY
exports.isStudent = async( req, res, next ) => {
    
    try {
       if( req.user.accountType !== "Student" ) {
           return res.status(401).json({
            success:false,
            message:" This is a protected route for student only "
           })
       };
    //    console.log("isStudent MIddleware called piyush ")
       next();
        
    } 
    catch (error) {
        return res.status(404).json({
            success:false,
            message: ' User Role Cannot verified PLS try again.. '
        })
    }
};

// MIDDLEWARE FOR INSTRUCTOR
exports.isInstructor = async( req, res, next ) => {
    
    try {
       if( req.user.accountType !== "Instructor" ) {
           return res.status(401).json({
            success:false,
            message:" This is a protected route for Instructor only "
           })
       };
    //    console.log("isInstructor MIddleware called piyush ")
       next();
        
    } 
    catch (error) {
        return res.status(404).json({
            success:false,
            message: ' User Role Cannot verified PLS try again.. '
        })
    }
};


// MIDDDLEWARE FOR ADMIN
exports.isAdmin = async( req, res, next ) => {
    
    try {
       if( req.user.accountType !== "Admin" ) {
           return res.status(401).json({
            success:false,
            message:" This is a protected route for Admin only "
           })
       };
       console.log("isAdmin MIddleware called piyush ")
       next();
        
    } 
    catch (error) {
        return res.status(404).json({
            success:false,
            message: ' User Role Cannot verified PLS try again.. '
        })
    }
};