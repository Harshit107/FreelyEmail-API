require('dotenv').config();
const { sendMail } = require('./src/services/email.service');

async function sendTest() {
  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; border: 1px solid #e1e8ed; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      <div style="background-color: #00466a; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">FreelyEmail Test Delivery</h1>
      </div>
      <div style="padding: 32px 28px; color: #333333;">
        <p style="font-size: 16px; margin-top: 0;">Hey Harshit,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #555555;">
          This is your first live test email dispatched through the newly configured <strong>Brevo SMTP & Transactional API Engine</strong>.
        </p>
        <div style="background: #f4f7fa; border-left: 4px solid #00466a; padding: 14px 18px; border-radius: 4px; margin: 24px 0;">
          <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Status:</strong> All Systems Operational &#x2705;</p>
          <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Engine:</strong> Brevo Transactional Relay</p>
          <p style="margin: 0; font-size: 14px;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <p style="font-size: 14px; color: #777777;">
          Everything is set up and working properly: centralized constants, standardized response contracts, and Brevo delivery.
        </p>
      </div>
      <div style="background: #f9fbfd; padding: 16px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="font-size: 12px; color: #999999; margin: 0;">&copy; ${new Date().getFullYear()} FreelyEmail Microservice</p>
      </div>
    </div>
  `;

  try {
    const messageId = await sendMail({
      app: 'FreelyEmail App',
      sender: 'harshit107.in+project01@gmail.com',
      recipient: 'harshit107.in+project01@gmail.com',
      replyTo: 'harshit107.in+project01@gmail.com',
      subject: '🎉 First Test Email: Brevo Integration Working!',
      text: 'Hello Harshit! This is your first live test email sent via Brevo from FreelyEmail.',
      html: htmlContent,
    });

    console.log('STATUS: SUCCESS');
    console.log('MESSAGE_ID:', messageId);
    console.log('RECIPIENT: harshit107.in+project01@gmail.com');
  } catch (error) {
    console.error('STATUS: FAILED');
    console.error('ERROR:', error);
  }
}

sendTest();
