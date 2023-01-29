const e = require('express');
const express = require('express');
const router = new express.Router();
const emailSender = require('../Email/EmailSender');
const otpVerificationAsString = require('../HTMLtemplets/otpVerification');



router.post('/public/email/notification', async (req, res) => {

    const reqEmailBody = req.body;

    const senderEmail = reqEmailBody.senderEmail; //may be single email or array of Email
    const recipientsEmail = reqEmailBody.recipientsEmail; //may be single email or array of Email
    const appName = reqEmailBody.appName;   //eg : google@donot-reply.online
    const subject = reqEmailBody.subject;   // Credit Notification
    const emailContent = reqEmailBody.emailContent; // your orignal Content
    const HTMLfile = reqEmailBody.HTMLfile; // Single HTML as string
    // console.log('senderEmail :>> ', reqEmailBody);


    await emailSender(appName,subject,recipientsEmail,senderEmail,emailContent,HTMLfile);

    res.status(200).send({"message" : "Success"});


})

router.post('/public/email/otpverification', async (req, res) => {

    const reqEmailBody = req.body;
    const senderEmail = reqEmailBody.senderEmail; //may be single email or array of Email
    const recipientsEmail = reqEmailBody.recipientsEmail; //may be single email or array of Email
    const appName = reqEmailBody.appName;   //eg : google@donot-reply.online
    const subject = reqEmailBody.subject;   // Credit Notification
    const otp = reqEmailBody.otp; // your orignal Content
    const withValidTime = reqEmailBody.time; // Single HTML as string    
    var otpValidString = otpVerificationAsString(appName, otp, withValidTime);

    await emailSender(appName, subject,recipientsEmail, senderEmail, otpValidString, otpValidString);
    
    res.status(200).send({"message" : "Success"});


   
})

module.exports = router;