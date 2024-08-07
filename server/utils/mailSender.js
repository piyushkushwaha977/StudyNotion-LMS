const nodemailer = require("nodemailer");

const mailSender = async( email, title , body) => {

    try {
      let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
       });

      let infoSend = await transporter.sendMail({
        from:'StudyNotion || An Ed-Tech Platform..' ,
        to: `${email}`,
        subject: `${title}` ,
        html: `${body}`,
    });
        // console.log( "MAIL SENDER INFO ==", infoSend.response );  
        return infoSend
    } 
    catch (error) {
        console.log(error.message)
        return error.message
    }
};

module.exports = mailSender;