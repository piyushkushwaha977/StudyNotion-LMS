const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate")
const optSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:60 * 5,
    }

});

// A FUNCTION USING MAILSENDER from UTILs TO SEND OTP FOR VERIFICATION

async function sendVerificationEmail( email, otp ){
    
    try {
        const mailResponse = await mailSender(
             email ,
            "EMAIL Verifcation for StudyNotion",
            emailTemplate(otp)
        )
        // console.log("This is the data of MailResponse -- ", mailResponse)
        // console.log("Email sent successfully: ", mailResponse.response);
    } 
    catch (error) {
        console.log(`Error Occured while sending mails `, error )
    }
};


optSchema.pre("save" , async function(next){
    
    if(this.isNew)
    await sendVerificationEmail( this.email , this.otp )

    next();
})

module.exports = mongoose.model( "OTP" , optSchema );