"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config()


const sendMail = async function (appName,subject,senderEmail, message, HTMLfile) {

    const authEmail =process.env.SENDINBLUE_EMAIL;
    const authPass = process.env.SENDINBLUE_PASSWORD;
 
    let mailTransporter = nodemailer.createTransport({ 
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: { 
            user: authEmail, 
            pass: authPass
        } 
    }); 
      

    let mailDetails = {
        from: `${appName}@donot-Reply.online`,
        to: senderEmail,
        subject: `${subject}`,
        text: `${message}`,
        html: HTMLfile
    };

    const info =  await mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs : '+err);
            return "error"
        } else {
            console.log('Email sent successfully');
            return "success"
        }
        // console.log("Data : "+data);
    });

   

}
 module.exports = sendMail

