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

function validateRequest (req, res) {
    if(!validateData(req.senderEmail) ){
        
        sendError(res,"Enter Valid Sender Email Address");
        return false;
    }

    if(!validateData(req.recipientsEmail) ){
        sendError(res,"Enter Valid recipient Email Address");
        return false;
    }

    if(!validateData(req.appName) ){
        sendError(res,"Enter Valid App Name");
        return false;;
    }

    if(!validateData(req.subject) ){
        sendError(res,"Enter Valid Subject");
        return false;;
    }
    
    return true;
}


router.post('/public/email/notification', async (req, res) => {

    const reqEmailBody = req.body;

    const {senderEmail,recipientsEmail,appName,subject,emailContent,HTMLfile} = reqEmailBody; //may be single email or array of Email
    
    // const recipientsEmail = reqEmailBody.recipientsEmail; //may be single email or array of Email
    // const appName = reqEmailBody.appName;   //eg : google@donot-reply.online
    // const subject = reqEmailBody.subject;   // Credit Notification
    // const emailContent = reqEmailBody.emailContent; // your orignal Content
    // const HTMLfile = reqEmailBody.HTMLfile; // Single HTML as string

    if(!validateRequest(reqEmailBody,res))
        return;
   
    if(!validateData(emailContent) && !validateData(HTMLfile) ){
        sendError(res,"Enter Valid Email Content");
        return false;;
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


// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------


router.post('/public/email/otpverification', async (req, res) => {

    const reqEmailBody = req.body;
    
    const {senderEmail,recipientsEmail,appName,subject,otp,withValidTime} = reqEmailBody; //may be single email or array of Email
       

    if(!validateRequest(reqEmailBody,res))
        return;

    if(!validateData(otp) ){
        sendError(res,"Enter Valid OTP");
        return false;;
    }

    var otpValidString = otpVerificationAsString(appName, otp, withValidTime) ;
    

    try{
        const msg = await emailSender(appName,subject,recipientsEmail,senderEmail,otp,otpValidString);
        
         res.status(200).send({
             "data" : msg.messageId,
             "error" : {}
         });
     }
     catch(e){
        console.log(e);
         res.status(400).send({
             "data" : {},
             "error" : e.response || "Error Occured, Check your Input"
         });
     }


   
})

module.exports = router;