const getLinkTemplate = (appName, link, withValidTime, replyTo) => {
  const validityText = withValidTime ? `This link is valid for <strong>${withValidTime} minutes</strong>.` : "Please click the button below to verify your email address.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header -->
        <div style="background-color: #00466a; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">${appName}</h1>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px; color: #333333;">
            <p style="font-size: 16px; margin-bottom: 24px;">Hello there,</p>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #555555;">
                Thank you for registering with <strong>${appName}</strong>. ${validityText}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="display: inline-block; background-color: #00466a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 28px; border-radius: 4px; border: 1px solid #00466a;">
                    Verify Email Address
                </a>
            </div>
            
            <p style="font-size: 14px; color: #888888; text-align: center; margin-top: 30px;">
                If the button doesn't work, copy and paste the following link into your browser:<br>
                <a href="${link}" style="color: #00466a; word-break: break-all;">${link}</a>
            </p>
            
            <p style="font-size: 14px; color: #888888; text-align: center; margin-top: 20px;">
                If you did not request this email, please ignore this email or reply to ${replyTo || "us"}.
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fbfd; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="font-size: 13px; color: #999999; margin: 0;">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
            </p>
        </div>

    </div>
</body>
</html>`;
};

module.exports = getLinkTemplate;
