const express = require('express');
const router = new express.Router();
const emailSender = require('../Email/EmailSender');
const otpVerificationAsString = require('../HTMLtemplets/otpVerification');

function validateData (data) {

    if(data == undefined || data == '') {
        return false;
    }
    return true;
}

function sendError (res, errorMessage) {
    console.log('errorMessage :>> ', errorMessage);
    res.status(400).send({
        "data" : {},
        "error" : errorMessage
    })
}


router.post('/public/email/notification', async (req, res) => {

    const reqEmailBody = req.body;

    const senderEmail = reqEmailBody.senderEmail; //may be single email or array of Email
    const recipientsEmail = reqEmailBody.recipientsEmail; //may be single email or array of Email
    const appName = reqEmailBody.appName;   //eg : google@donot-reply.online
    const subject = reqEmailBody.subject;   // Credit Notification
    const emailContent = reqEmailBody.emailContent; // your orignal Content
    const HTMLfile = reqEmailBody.HTMLfile; // Single HTML as string

    if(!validateData(senderEmail) ){
        
        sendError(res,"Enter Valid Sender Email Address");
        return;
    }

    if(!validateData(recipientsEmail) ){
        sendError(res,"Enter Valid recipient Email Address");
        return;
    }

    if(!validateData(appName) ){
        sendError(res,"Enter Valid App Name");
        return;
    }

    if(!validateData(subject) ){
        sendError(res,"Enter Valid Subject");
        return;
    }
    if(!validateData(emailContent) && !validateData(HTMLfile) ){
        sendError(res,"Enter Valid Email Content");
        return;
    }

    
    try{
       const msg = await emailSender(appName,subject,recipientsEmail,senderEmail,emailContent,HTMLfile);
        res.status(200).send({
            "data" : msg.messageId,
            "error" : {}
        });

    }
    catch(e){
        res.status(400).send({
            "data" : {},
            "error" : e.response
        });
    }
    
    


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

    try{
        const msg = await emailSender(appName,subject,recipientsEmail,senderEmail,emailContent,HTMLfile);
         res.status(200).send({
             "data" : msg.messageId,
             "error" : {}
         });
     }
     catch(e){
         res.status(400).send({
             "data" : {},
             "error" : e.response
         });
     }


   
})

module.exports = router;