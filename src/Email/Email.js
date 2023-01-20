"use strict";

const nodemailer = require("nodemailer");
require('dotenv').config()


const sendMail = async function (email, message, preHtml) {

    const fromEmail =process.env.SENDINBLUE_EMAIL;
    const password = process.env.SENDINBLUE_PASSWORD;
    const appname = 'LetsChat'
 
    
    message = 'This is just a testing mail from Auto Email'
    let mailTransporter = nodemailer.createTransport({ 
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: { 
            user: fromEmail, 
            pass: password
        } 
    }); 
      

    let mailDetails = {
        from: "noreply@imharshit.tech",
        to: email,
        subject: `${appname}`,
        text: `${message}`,
        html: preHtml
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs : '+err);
        } else {
            console.log('Email sent successfully');
        }
    });

    

}
module.exports = sendMail