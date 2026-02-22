const getOtpTemplate = (appName, otp, withValidTime) => {
  const validityText = withValidTime ? `This OTP is valid for <strong>${withValidTime} minutes</strong>.` : "Please use this OTP to complete your verification.";
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header -->
        <div style="background-color: #00466a; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">${appName}</h1>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px; color: #333333;">
            <p style="font-size: 16px; margin-bottom: 24px;">Hi there,</p>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #555555;">
                Thank you for choosing <strong>${appName}</strong>. ${validityText}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #00466a; background: #f0f4f8; padding: 12px 24px; border-radius: 6px; border: 1px solid #e1e8ed;">
                    ${otp}
                </span>
            </div>
            
            <p style="font-size: 14px; color: #888888; text-align: center; margin-top: 30px;">
                If you did not request this OTP, please ignore this email.
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

module.exports = getOtpTemplate;
