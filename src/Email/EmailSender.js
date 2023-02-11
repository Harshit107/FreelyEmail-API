"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config()


const sendMail = async function (appName,subject,recipientsEmail,senderEmail, message, HTMLfile) {

    // console.log(appName,subject,senderEmail, HTMLfile);
    console.log('Sender Page :>> ', recipientsEmail);

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
        from: `"${appName}" <${senderEmail}@donot-Reply.online>`,
        to: recipientsEmail,
        subject: `${subject}`,
        text: `${message}`,
        html: HTMLfile
    };

    const info =  await mailTransporter.sendMail(mailDetails);
    // console.log('info :>> ', info);
    return info;
   

}
 module.exports = sendMail

