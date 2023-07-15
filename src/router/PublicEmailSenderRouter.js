const express = require("express");
const router = new express.Router();
const emailSender = require("../Email/EmailSender");
const otpVerificationAsString = require("../HTMLtemplets/otpVerificationTemplate");
const emailVerificationViaLink = require("../HTMLtemplets/emailVerificationTemplate");
const { validateData, validateRequest } = require("../Validator");
const StoreEmail = require('../model/EmailStore');

function sendError(res, errorMessage) {
  console.log("errorMessage :>> ", errorMessage);
  res.status(400).send({
    data: {},
    error: errorMessage,
  });
}

const StoreEmailFun = async (data) => {

  const storeNewEmail = await new StoreEmail(data);
  console.log(storeNewEmail);
  // await StoreEmail.save();
  console.log(storeNewEmail)

}

// /---------------    Simple Email  -------------------------------/

router.post("/public/email/notification", async (req, res) => {
  const reqEmailBody = req.body;
  const { sender, recipient, replyTo, app, subject, message, HTMLfile } =
    reqEmailBody; //may be single email or array of Email

  // const recipient = reqEmailBody.recipient; //may be single email or array of Email
  // const app = reqEmailBody.app;   //eg : google@donot-reply.online
  // const subject = reqEmailBody.subject;   // Credit Notification
  // const message = reqEmailBody.message; // your orignal Content
  // const HTMLfile = reqEmailBody.HTMLfile; // Single HTML as string

  if (!validateRequest(reqEmailBody, res)) return;

  if (!validateData(message) && !validateData(HTMLfile)) {
    sendError(res, "Enter Valid Email Content");
    return false;
  }

  try {
    const msg = await emailSender(
      app,
      subject,
      recipient,
      sender,
      replyTo,
      message,
      HTMLfile
    );
    await StoreEmailFun({ ...req.body, messageId: msg });
    res.status(200).send({
      data: { msg },
      error: {},
    });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({
      data: {},
      error: e.message,
    });
  }
});

// ---------------------       Email OTP With Templete      --------------------------------------------------

router.post("/public/email/verification/otp", async (req, res) => {
  const reqEmailBody = req.body;
  const {
    sender,
    recipient,
    replyTo,
    app,
    subject,
    otp,
    withValidTime,
    HTMLfile,
  } = reqEmailBody; //may be single email or array of Email

  if (!validateRequest(reqEmailBody, res)) return;

  if (!validateData(otp)) {
    sendError(res, "Enter Valid OTP");
    return false;
  }
  var HTMLtemplete =
    HTMLfile || otpVerificationAsString(app, otp, withValidTime);

  try {
    const msg = await emailSender(
      app,
      subject,
      recipient,
      sender,
      replyTo,
      otp,
      HTMLtemplete
    );
    res.status(200).send({
      data: { msg },
      error: {},
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      data: {},
      error: e.response || "Error Occured, Check your Input",
    });
  }
});

// ---------------------       Email Request OTP With Templete      --------------------------------------------------

router.post("/public/email/verification/otp/request", async (req, res) => {
  const reqEmailBody = req.body;
  const { sender, recipient, replyTo, app, subject, withValidTime } =
    reqEmailBody; //may be single email or array of Email

  if (!validateRequest(reqEmailBody, res)) return;

  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  var HTMLtemplete = otpVerificationAsString(app, otp, withValidTime);

  try {
    const msg = await emailSender(
      app,
      subject,
      recipient,
      sender,
      replyTo,
      otp,
      HTMLtemplete
    );
    res.status(200).send({
      data: {
        messageId: msg,
        otp: otp,
      },
      error: {},
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      data: {},
      error: e.response || "Error Occured, Check your Input",
    });
  }
});



// --------------------    Email verification with link -------------
router.post("/public/email/verification/link", async (req, res) => {
  const reqEmailBody = req.body;
  const {
    sender,
    recipient,
    replyTo,
    app,
    subject,
    link,
    withValidTime,
    HTMLfile,
  } = reqEmailBody; //may be single email or array of Email

  if (!validateRequest(reqEmailBody, res)) return;

  if (!validateData(link)) {
    sendError(res, "Enter Valid link");
    return false;
  }
  var HTMLtemplete =
    HTMLfile || emailVerificationViaLink(app, link, withValidTime, replyTo);

  try {
    const msg = await emailSender(
      app,
      subject,
      recipient,
      sender,
      replyTo,
      link,
      HTMLtemplete
    );
    res.status(200).send({
      data: { msg },
      error: {},
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      data: {},
      error: e.response || "Error Occured, Check your Input",
    });
  }
}); 


// --------------------   Request Email verification with link -------------
router.post("/public/email/verification/link/request", async (req, res) => {
  const reqEmailBody = req.body;
  const {
    sender,
    recipient,
    replyTo,
    app,
    subject
  } = reqEmailBody; //may be single email or array of Email

  if (!validateRequest(reqEmailBody, res)) return;

  var HTMLtemplete =
    HTMLfile || emailVerificationAsString(app, link, withValidTime, replyTo);

  try {
    const msg = await emailSender(
      app,
      subject,
      recipient,
      sender,
      replyTo,
      link,
      HTMLtemplete
    );
    res.status(200).send({
      data: { msg },
      error: {},
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      data: {},
      error: e.response || "Error Occured, Check your Input",
    });
  }
}); 


module.exports = router;
