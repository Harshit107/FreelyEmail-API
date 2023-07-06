const emailVerificationAsString = function (appName, link, withValidTime, replyTo) {
  var emailVerificationString = `<!DOCTYPE html>
        <html>
        <head>
          <title>Email Verification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f3f3f3;
             
              text-alignment : center;
            }

            .container {
              max-width: 400px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              border : 1px solid #ccc;
            }

            h1 {
              text-align: center;
              margin-top: 0;
              color: #333;
            }

            p {
              margin-bottom: 20px;
              color: #555;
            }
            .verification {
              margin: 0px 100px;
              text-align : center;  
            }
            .verification-link {

              display: block;
              padding: 10px 20px;
              font-size: 16px;
              text-decoration: none;
              background-color: #4CAF50;
              color: #fff;
              border-radius: 5px;
                          
              transition: background-color 0.3s;
            }

            .verification-link:hover {
              background-color: #45a049;
            }
          </style>
        </head>
          <body>
            <div class="container">
              <h1>Email Verification :  ${appName}</h1>
              <p>Thank you for signing up with our service! To ensure the security of your account and activate your membership, we kindly request you to verify your email address.<br>
              Please click the link below to proceed with the verification process ${
                withValidTime ? "valid for " + withValidTime + " min" : ""
              }:</p>
            <div class='verification'>
              <a class="verification-link" href=${link}>Verify Email</a>
              <p>${link}</p>
            </div>
              
            <p>
            If the above link is not clickable, please copy and paste it into your web browser's address bar.<br><br>

            If you did not sign up for an account on our platform, please ignore this email. Rest assured that your email address will not be used without your consent.<br>

            If you have any questions or need further assistance, please feel free to contact our support team at ${replyTo}
            <p>
            </div>
          </body>
        </html>

       `;
  return emailVerificationString;
};

module.exports = emailVerificationAsString;
