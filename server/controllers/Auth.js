const User = require("../models/User");
const OTP = require("../models/Otp");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
require("dotenv").config();

// Sending Otp to User For SignUp 
exports.sendOtp = async(req , res) => {

try {
        // Fetching email from req body
        const {email} = req.body;
    
        // Checking User Already exist in DB
        const checkUserRegistered =  await User.findOne({email});
    
        // Throw message if user already exist with this email 
        if(checkUserRegistered){
            return res.status(401).json({
                success:false,
                message:'User Already registered with this Email..'
            })
        };

        // Generating OTP with otpgenerator
        var otp =  OtpGenerator.generate( 6 , {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });

        // console.log(`generated OTP = ${otp}`);
 
        // Checking OTP is Unique
        let result = await OTP.findOne({otp:otp});

        while (result) {
            otp = OtpGenerator.generate( 6 , {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            })
            result = await OTP.findOne({otp:otp});
        }

        const payLoad = {email, otp}

        // Create an DB entry of generated Otp and return success res
        const otpBody =  await OTP.create(payLoad);
        // console.log( "OTP BODY DATA --", otpBody);

        return res.status(200).json({
            success:true,
            message:'OTP Sent Successfully ',
            otp
        })


} 
catch (error) {
    console.log(`Error while generating OTP -- ${error}`);
    return res.status(401).json({
        success:false,
        message:error.message,
    })
}

}

// Controller for User SignUp 

exports.signUp = async ( req , res ) => {
    
try {
        // Fetch Data 
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
    
        // Vaidation of Data
        if( !(firstName && lastName && email && password && confirmPassword && otp)) {
            return res.status(400).json({
                success:false,
                message:'Please fill All the Credentials fields'
            })
        };
        
        // Checking Both passwords are matches or not
        if( password !== confirmPassword ){
            return res.status(400).json({
                success:false,
                message:'BOTH FILLED PASSWORDS DOES NOT MATCH TRY AGAIN'
            })
        };
    
        // Checking User exist or not 
        const registeredUser = await User.findOne({email});
    
      if(registeredUser){
            return res.status(400).json({
                success:false,
                message:'USER ALREADY EXIST WITH THIS EMAIL ..'
            })
        }
        // Finding the Most Recent OTP 
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        // console.log(`RECENT OTP GENERATED obj == `, recentOtp );
    
        // Validation on OTP
      if( recentOtp.length === 0 ) {
        return res.status(404).json({
          success:false,
          message:'THERE IS NO OTP WITH EMAIL'
        })
      }
      else if (otp !== recentOtp[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			 });
		  }
    
      // Hasing the Password 
      const hassedPassword = await bcrypt.hash(password , 10);

      // Create the user
      let approved = ""
      approved === "Instructor" ? (approved = false) : (approved = true)
    
      // Create entry of PROFILE Details for id 
      const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });
    
      // Create User Entry INTO DB
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hassedPassword,
            approved: approved,
            accountType,
            additionalDetails: profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    
         });

         return res.status(200).json({
            success:true,
            message:'USER IS REGISTERD SUCCESSFULLY',
            user,
         })

} 
  catch (error) {
    console.log(error)
    return res.status(400).json({
        success:false,
        message:' User Not Registered. Please try again.'
     })
}

}

// LOGIN CONTROLLER

exports.login = async( req , res) => {

    try {
      // Fetch Data 
      const { email , password } = req.body ;
       
      // Validate data 
      if( !(email && password)){
        return res.status(403).json({
            success:false,
            message:'PLEASE FILL ALL THE REQUIRED FIELDS '
        })
      }
      // Check if User EXIST 
      const user = await User.findOne({email});
      // console.log("user form login controller - " , user)

      if( !user) {
        return res.status(403).json({
            success:false,
            message:'NO ACCOUNT WITH THIS EMAIL IS EXIST .. pls SignUp '
        })
      };
      // Checking Password
      if( await bcrypt.compare( password , user.password)){
        const payLoad = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        };
        // Creationg Jwt by using Sign()
        const token =  jwt.sign( payLoad , process.env.JWT_SECRET , {
            expiresIn:"24h",
        })
        // user = user.toObject()
        user.token = token;
        user.password = undefined;
 
        // Create Cookie and Send it Into RESponse
        const options = {
            httponly:true,
            expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
        res.cookie("token", token, options).status(200).json({
          success: true,
          message: `User Logged In Successfully..`,
          token,
          user,
        })

     
      } else {
          return res.status(401).json({
            success: false,
            message: `PASSWORD IS INCORRECT TRY AGAIN WIHT NEW PASSWORD`,
        })
      }
        
    } 
    catch (error) {
        console.log(`Error While logging -- ${error}`)
        return res.status(401).json({
            success:false,
            message:' LOGIN FAILURE  PLS TRY AGAIN ...'
        })
    }                                    
};


// Controller for Changing Password
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
           updatedUserDetails.email,
           "Password for your account has been updated",
           passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        // console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } 
    catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }
  