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
    if(!validateData(req.sender) ){
        
        sendError(res,"Enter Valid Sender Email Address");
        return false;
    }

    if(!validateData(req.recipient) ){
        sendError(res,"Enter Valid recipient Email Address");
        return false;
    }

    if(!validateData(req.app) ){
        sendError(res,"Enter Valid App Name");
        return false;;
    }

    if(!validateData(req.subject) ){
        sendError(res,"Enter Valid Subject");
        return false;;
    }
    
    return true;
}


// /---------------    Simple Email  -------------------------------/

router.post('/public/email/notification', async (req, res) => {

    const reqEmailBody = req.body;
    const {sender,recipient,app,subject,message,HTMLfile} = reqEmailBody; //may be single email or array of Email
    
    // const recipient = reqEmailBody.recipient; //may be single email or array of Email
    // const app = reqEmailBody.app;   //eg : google@donot-reply.online
    // const subject = reqEmailBody.subject;   // Credit Notification
    // const message = reqEmailBody.message; // your orignal Content
    // const HTMLfile = reqEmailBody.HTMLfile; // Single HTML as string

    if(!validateRequest(reqEmailBody,res))
        return;
   
    if(!validateData(message) && !validateData(HTMLfile) ){
        sendError(res,"Enter Valid Email Content");
        return false;;
    }
    
    try{
       const msg = await emailSender(app,subject,recipient,sender,message,HTMLfile);
        res.status(200).send({
            "data" : msg,
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


// ---------------------       Email OTP With Templete      --------------------------------------------------

router.post('/public/email/otp', async (req, res) => {

    const reqEmailBody = req.body;
    const {sender,recipient,app,subject,otp,withValidTime, HTMLfile} = reqEmailBody; //may be single email or array of Email

    if(!validateRequest(reqEmailBody,res))
        return;

    if(!validateData(otp) ){
        sendError(res,"Enter Valid OTP");
        return false;;
    }
    var HTMLtemplete = HTMLfile || otpVerificationAsString(app, otp, withValidTime) ;

    try{
        const msg = await emailSender(
          app,
          subject,
          recipient,
          sender,
          otp,
          HTMLtemplete
        );  
         res.status(200).send({
             "data" : msg,
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