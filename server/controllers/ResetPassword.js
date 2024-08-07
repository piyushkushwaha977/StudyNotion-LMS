const User = require("../models/User");
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt");
const crypto = require("crypto")

// RESET PASSWORD TOKEN ;
exports.resetPasswordToken = async( req, res) => {
    
try {
        const email = req.body.email
    
        const user = await User.findOne({email:email});
    
        if(!user){
            return res.status(404).json({
                 success:false,
                 message:'ACCOUNT NOT REGISTERD WITH THIS EMAIL'
            })
        };
    
        const token = crypto.randomBytes(20).toString("hex");
    
        const updatedDetails = await User.findOneAndUpdate( 
                                             {email:email},
                                             {
                                                token:token,
                                                resetPasswordExpires:Date.now() + 3600000
                                             },
                                             {new:true}
                                            );
        // console.log("DETAILS", updatedDetails);
    
        const url = `https://study-notion-full-stack-lovat.vercel.app/forgot-password/${token}`  ;
        
        await mailSender(
               email,
               "LINK FOR RESET YOUR OLD-PASSWORD",
               `LINK TO RESET YOUR STUDY-NOTION PASSWORD = ${url}`
        );
    
        return res.status(200).json({
            success:true,
            message:'EMAIL SENT SUCCESSFULLY PLS.. CHECK YOU GMAIL ACCOUNT FOR CHANGE PWD'
        });

}
 catch (error) {
    console.log("error while sending email" , error);
    return res.status(400).json({
        success:false,
        message:'something went wrong while reset TOKEN Pls try again..'
    });
}

};

// For RESET PASSWORD AND UPDATE IN DB
exports.resetPassword = async( req, res) => {
    try {
       // fetch Data
       const { password , confirmPassword , token } = req.body;
       // validate data
       if( password !== confirmPassword ){
        return res.status(402).json({
            success:false,
            message:' BOTH PASSWORDS DOES NOT MATCH'
        })
       };
       // Fetch User Details from DB
       const userDetails = await User.findOne({token:token});
       // IF no entry
       if(!userDetails){
        return res.status(402).json({
            success:false,
            message:' TOKEN IS INVALID'
        })
       };

       // Check token expire time
       if( userDetails.resetPasswordExpires < Date.now() ) {
        return res.status(402).json({
            success:false,
            message:' TOKEN IS EXPIRED PLS TRY AGAIN AND FILL ON TIME'
        })
       };

       // Hasing the password
       const hassedPassword = await bcrypt.hash( password, 10);

       // Updating Password to DB
       await User.findOneAndUpdate(
        {token:token},
        {password:hassedPassword},
        {new:true},
       );

       // return res
       return res.status(200).json({
        success:true,
        message:' YOUR NEW PASSWORD UPDATED SUCCESSFULLY'
       })

    } 
    catch (error) {
        console.log(`ERROR WHILE UPDATING OR RESET PASSWORD = ${error}`);
        return res.status(401).json({
            success:false,
            message:' ERROR WHILE UPDATING OR RESET PASSWORD'
        })
    }
}