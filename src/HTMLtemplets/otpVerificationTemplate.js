


const otpVerificationAsString = function (appName,OTP,withValidTime) {

  var optVerificationString = `<!DOCTYPE html>
        <html lang="en">
          <body>    
              <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                  <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">${appName}</a>
                    </div>
                    <p style="font-size:1.1em">Hi,</p>
                    <p>Thank you for choosing ${appName}. Use the following OTP to complete your procedures. 
                    ${
                      withValidTime == undefined
                        ? ""
                        : `OTP is valid for ${withValidTime}  minutes`
                    }</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                    <p style="font-size:0.9em;">Regards,<br />${appName}</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                  </div>
                </div>

          </body>
        </html>
       `;
      return optVerificationString;
}

module.exports = otpVerificationAsString;