/**
 * Modern HTML Template Generator for OTP Verification Emails
 * Features:
 * - Premium card layout with gradient accent line
 * - Beautiful glass-style OTP display box with letter spacing
 * - Countdown validity badge
 * - Security warning callout
 * - Mobile responsive table structure for maximum email client compatibility
 */

const getOtpTemplate = (appName, otp, withValidTime) => {
  const safeApp = appName || "FreelyEmail";
  const safeOtp = otp || "000000";
  const year = new Date().getFullYear();
  const validityNotice = withValidTime
    ? `Expires in <strong>${withValidTime} minutes</strong>`
    : `Expires shortly`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your Verification Code</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a, span { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #1e293b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);">
          
          <!-- Top Gradient Accent -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%);"></td>
          </tr>

          <!-- Header / Brand -->
          <tr>
            <td style="padding: 32px 36px 16px 36px;" align="center">
              <div style="display: inline-block; padding: 6px 14px; background-color: #eef2ff; border-radius: 10px;">
                <span style="font-size: 16px; font-weight: 700; color: #4338ca; letter-spacing: -0.3px;">${safeApp}</span>
              </div>
            </td>
          </tr>

          <!-- Title & Subtitle -->
          <tr>
            <td style="padding: 8px 36px 20px 36px; text-align: center;">
              <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.4px;">
                Verification Code
              </h1>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                Use the one-time code below to authenticate your request for <strong>${safeApp}</strong>.
              </p>
            </td>
          </tr>

          <!-- OTP Display Card -->
          <tr>
            <td style="padding: 10px 36px 24px 36px;" align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px 28px;">
                <tr>
                  <td align="center">
                    <span style="font-family: 'SF Mono', Consolas, 'Roboto Mono', 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #1e1b4b; text-indent: 10px; display: inline-block;">
                      ${safeOtp}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <div style="display: inline-block; padding: 3px 10px; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 6px;">
                      <span style="font-size: 12px; font-weight: 600; color: #92400e;">
                        ⏱ ${validityNotice}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding: 0 36px 28px 36px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px; padding: 14px 16px;">
                <tr>
                  <td style="font-size: 12px; line-height: 1.6; color: #64748b; text-align: left;">
                    🔒 <strong>Security Tip:</strong> Never share this code with anyone. Our team will never ask for your verification code. If you didn't request this, you can safely disregard this message.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <div style="height: 1px; background-color: #f1f5f9;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 22px 36px; background-color: #fafbfd; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; font-weight: 400;">
                Powered by <strong>${safeApp}</strong> &bull; Protected by <span style="color: #4f46e5; font-weight: 600;">FreelyEmail</span>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${year} ${safeApp}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <!-- Microfooter -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin-top: 18px;">
          <tr>
            <td align="center" style="font-size: 11px; color: #94a3b8; line-height: 1.5; padding: 0 16px;">
              This is an automated system message. Replies to this address are not monitored.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
};

module.exports = getOtpTemplate;
