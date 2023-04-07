require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports.send_mail = async (email,confirmation_code)=>{

    try {
        let port = process.env.PORT || 2700;
        let url = `https://localhost:${port}/api/user_credentials/?confirmationCode=${confirmation_code}&email=${email}`;
    
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD
          }
        });
        
        var mailOptions = {
          from: process.env.MAIL_ID,
          to: email,
          subject: 'EMAIL VERIFICATION BY BudgetBonds',
          html: `Hi, Please click on the link below only if you had signed up in BudgetBonds 
          <br/> 
          <a href=${url} > LINK </a>`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
    
        console.log('MAIL SENT AT ==> ',url);
        return true;
    } catch (error) {
        return undefined;
    }
}