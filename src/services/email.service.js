const nodemailer = require("nodemailer");
const Email = require("../models/email.model");
const { APIError } = require("../middlewares/error");
require("dotenv").config();

/**
 * Sends an email using Sendinblue SMTP (or other configured SMTP)
 */
const sendMail = async (app, subject, recipient, sender, replyTo, message, htmlContent) => {
  const authEmail = process.env.SENDINBLUE_EMAIL;
  const authPass = process.env.SENDINBLUE_PASSWORD;

  if (!authEmail || !authPass) {
    throw new APIError("SMTP credentials are not configured properly.", 500);
  }

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
      user: authEmail,
      pass: authPass,
    },
  });

  const mailOptions = {
    from: `"${app}" <${sender}@donot-reply.online>`,
    to: recipient,
    replyTo: replyTo || sender,
    subject: subject,
    text: message,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info.messageId.replace("<", "").replace(">", "");
  } catch (error) {
    throw new APIError(`Failed to send email: ${error.message}`, 500);
  }
};

/**
 * Saves email record to the database
 */
const saveEmailRecord = async (emailData) => {
  try {
    const newRecord = new Email(emailData);
    await newRecord.save();
    return newRecord;
  } catch (error) {
    console.error("Failed to save email record to DB:", error.message);
    // Don't throw error here to avoid failing the whole request if DB logging fails, 
    // unless strict tracking is required.
  }
};

module.exports = {
  sendMail,
  saveEmailRecord,
};
