"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config()


const sendMail = async function (appName,senderEmail, message, HTMLfile) {

    const fromEmail =process.env.SENDINBLUE_EMAIL;
    const password = process.env.SENDINBLUE_PASSWORD;
 
    appName = appName || Notification
    message = message || 'This is just a notification'
    let mailTransporter = nodemailer.createTransport({ 
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: { 
            user: fromEmail, 
            pass: password
        } 
    }); 
      

    let mailDetails = {
        from: `${appName}@imharshit.tech`,
        to: senderEmail,
        subject: `${appname}`,
        text: `${message}`,
        html: HTMLfile
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