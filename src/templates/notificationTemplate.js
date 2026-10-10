/**
 * Modern HTML Template Generator for Standard Notification Emails
 * Features:
 * - Fluid card design with soft ambient glow and subtle border
 * - Mobile responsive table structure
 * - Clean typography and contrast
 * - Safe for Gmail, Outlook, Apple Mail, etc.
 */

const getNotificationTemplate = (appName, subject, message, options = {}) => {
  const safeApp = appName || "FreelyEmail";
  const safeSubject = subject || "Notification";
  const safeMessage = message || "";
  const year = new Date().getFullYear();
  const ctaText = options.ctaText;
  const ctaUrl = options.ctaUrl;

  const ctaBlock = ctaText && ctaUrl ? `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
      <tr>
        <td align="left">
          <a href="${ctaUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35); letter-spacing: 0.2px;">
            ${ctaText} &rarr;
          </a>
        </td>
      </tr>
    </table>
  ` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${safeSubject}</title>
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
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #4f46e5 0%, #818cf8 50%, #c084fc 100%);"></td>
          </tr>

          <!-- Header / Brand -->
          <tr>
            <td style="padding: 32px 36px 20px 36px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <div style="display: inline-block; padding: 6px 12px; background-color: #eef2ff; border-radius: 8px;">
                      <span style="font-size: 15px; font-weight: 700; color: #4338ca; letter-spacing: -0.2px;">${safeApp}</span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-size: 12px; color: #94a3b8; font-weight: 500;">Notification</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 0 36px 36px 36px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.35; letter-spacing: -0.3px;">
                ${safeSubject}
              </h1>
              
              <div style="font-size: 15px; line-height: 1.7; color: #475569; word-break: break-word;">
                ${safeMessage.replace(/\n/g, '<br/>')}
              </div>

              ${ctaBlock}
            </td>
          </tr>

          <!-- Subtle Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <div style="height: 1px; background-color: #f1f5f9;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #fafbfd; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; font-weight: 400;">
                Sent securely by <strong>${safeApp}</strong> via <span style="color: #4f46e5; font-weight: 600;">FreelyEmail</span>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${year} ${safeApp}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        
        <!-- Sub-footer Notice -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin-top: 20px;">
          <tr>
            <td align="center" style="font-size: 11px; color: #94a3b8; line-height: 1.5; padding: 0 16px;">
              This is an automated transactional message. If you did not expect this communication, you can safely ignore this email.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
};

module.exports = getNotificationTemplate;
