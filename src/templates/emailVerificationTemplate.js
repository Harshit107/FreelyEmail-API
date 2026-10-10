/**
 * Modern HTML Template Generator for Link / Action Verification Emails
 * Features:
 * - Clean, sleek CTA button with subtle shadow and rounded corners
 * - Fallback plain URL display box with click-to-copy feel
 * - Expiration pill badge
 * - Fully responsive card layout
 */

const getLinkTemplate = (appName, link, withValidTime, replyTo, options = {}) => {
  const safeApp = appName || "FreelyEmail";
  const safeLink = link || "#";
  const year = new Date().getFullYear();
  const buttonText = options.buttonText || "Verify My Email";
  const validityNotice = withValidTime
    ? `This link expires in <strong>${withValidTime} minutes</strong>.`
    : `This link will expire soon for your security.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify Your Email</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #1e293b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #06b6d4 100%);"></td>
          </tr>

          <!-- Header / Brand -->
          <tr>
            <td style="padding: 32px 36px 16px 36px;" align="center">
              <div style="display: inline-block; padding: 6px 14px; background-color: #eff6ff; border-radius: 10px;">
                <span style="font-size: 16px; font-weight: 700; color: #1d4ed8; letter-spacing: -0.3px;">${safeApp}</span>
              </div>
            </td>
          </tr>

          <!-- Content Header -->
          <tr>
            <td style="padding: 8px 36px 20px 36px; text-align: center;">
              <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.4px;">
                Confirm Your Email Address
              </h1>
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #64748b;">
                Tap the button below to confirm your account and complete your sign-in for <strong>${safeApp}</strong>.
              </p>
            </td>
          </tr>

          <!-- Action CTA Button -->
          <tr>
            <td style="padding: 12px 36px 28px 36px;" align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);">
                    <a href="${safeLink}" target="_blank" style="display: inline-block; padding: 14px 34px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 10px; letter-spacing: 0.2px;">
                      ${buttonText} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <div style="margin-top: 14px;">
                <span style="font-size: 12px; color: #94a3b8; font-weight: 500;">
                  ⏱ ${validityNotice}
                </span>
              </div>
            </td>
          </tr>

          <!-- Fallback Plain URL Box -->
          <tr>
            <td style="padding: 0 36px 28px 36px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px;">
                <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; font-weight: 600;">
                  Button not working? Paste this link in your browser:
                </p>
                <p style="margin: 0; font-size: 11px; word-break: break-all; line-height: 1.5;">
                  <a href="${safeLink}" style="color: #2563eb; text-decoration: underline;">${safeLink}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td style="padding: 0 36px 24px 36px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                If you did not request this verification, you can safely ignore this email${replyTo ? ` or contact us at <a href="mailto:${replyTo}" style="color: #64748b;">${replyTo}</a>` : ""}.
              </p>
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
                Secured by <strong>${safeApp}</strong> &bull; Delivered via <span style="color: #2563eb; font-weight: 600;">FreelyEmail</span>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${year} ${safeApp}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <!-- Microfooter -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin-top: 18px;">
          <tr>
            <td align="center" style="font-size: 11px; color: #94a3b8; line-height: 1.5; padding: 0 16px;">
              This is an automated system email. Replies to this email address are unmonitored.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
};

module.exports = getLinkTemplate;
