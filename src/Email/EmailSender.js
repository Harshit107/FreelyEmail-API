"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config()


const sendMail = async function (
  app,
  subject,
  recipient,
  sender,
  replyTo,
  message,
  HTMLfile
) {
  //after changing this please review domain
  const authEmail = process.env.SENDINBLUE_EMAIL;
  const authPass = process.env.SENDINBLUE_PASSWORD;

  let mailTransporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
      user: authEmail,
      pass: authPass,
    },
  });

  let mailDetails = {
    from: `"${app}" <${sender}@donot-Reply.online>`,
    to: recipient,
    replyTo: `${replyTo}`,
    subject: `${subject}`,
    text: `${message}`,
    html: HTMLfile,
  };
  const info = await mailTransporter.sendMail(mailDetails);
  return info.messageId.replace('<',"").replace('>',"");
};
 module.exports = sendMail

