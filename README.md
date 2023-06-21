
# FreelyEmail (API)

FreelyEmail API is a RESTful web service that provides developers with an easy-to-use interface for sending emails from within their applications. It allows developers to send emails quickly and easily without having to set up their own SMTP server or domain.

To use the API, a developer needs to make an HTTP request to the service with the required data for sending the email, such as the recipient's email address, subject, and message body. The API then takes care of the rest, including formatting and sending the email using the DoNot-Reply.online domain.

One of the main benefit of this FreelyEmail API is that it simplifies the process of sending emails for developers who may not have the time or resources to set up their own email infrastructure. It also provides an added layer of security, as it allows developers to send emails without disclosing their own domain or email server information.

The API is built on top of a scalable and reliable infrastructure that ensures high availability and performance. It also provides a simple and clear documentation that makes it easy for developers to integrate the API into their applications.

Summary (😂):
FreelyEmail is build on Node.js that makes it easy to send automated emails without writing any code. It doesnot require any email and Server configuration. Just call the API with the required data and boooom!!! Email Send 


It also come with Android and Node Js library which reduces the effort of managing APIs and handling errors.

# How to use:

## Base api structure  :https://email.api.harshit107.tech/YOUR-API-REQUEST

  
  #### * Send Simple Email :  https://email.api.harshit107.tech/public/email/notification
  ```
   * Request Type : POST
   * Body : { sender, recipient, replyTo, app, subject, message, HTMLfile }
 ```
  * Note : 
    * parameter must have same name as mentioned above
    * sender email should not contain any domain, we will add @donot-reply.online at the end.
    * Example : 
   ``` JavaScript
   const sendingObject = {
      "recipient" : "Email Address to whom you want to send Email", //  use Array of String for multiple email
      "app" : "Your App Name", 
      "replyTo" : "Your contact Email " // User can directly reply to this email
      "subject" : "Subject of your email",
      "sender" : "YourAppEmail", //eg: Your-App-Name // donot include @donot-reply.online // no space or special char
      "message" : "Email Message",  //your Email containt
      "HTMLfile" : "HTML File if you have" //must be in String and single html formate  
    } 
  ```
  
   
  #### * Send OTP Email : https://email.api.harshit107.tech/public/email/verification/otp
  ```
   * Request Type : POST
   * Body : {  sender,recipient, replyTo,  app, subject, otp, withValidTime,HTMLfile}
 ```
  * Note : 
    * parameter must have same name as mentioned above
    * sender email should not contain any domain, we will add @donot-reply.online at the end.
    * Example : 
   ``` JavaScript
  const msgBody = {
        "app" : App Name,
        "subject" : Subject,
        "recipient" : recipients Email,
        "replyTo" : ReplyTo
        "sender" : Sender Email,
        "otp" : otp,  // must 
        "withValidTime" : withValidTime, // not necessary 
        "HTMLfile" : HTMLFile
    }
  ```
  
  # Response
  
  Every Request will have object as response which will contain `data and error`.
  
  ### Success
  ``` JavaScript
  {
    data : "Message Id",
    error : {}
  }
  
  ```
  Status code  : 200.
  
  ### Error
  ``` JavaScript
  {
    data : {},
    error : "Error Reason"
  }
  
  ```
  Status code  : 400.
  
  
  
   
  #### * Request Auto OTP Email : https://email.api.harshit107.tech/public/email/verification/otp/request
  ```
   * Request Type : POST
   * Body : {  sender, recipient, replyTo, app, subject, withValidTime}
 ```
  * Note : 
    * parameter must have same name as mentioned above
    * sender email should not contain any domain, we will add @donot-reply.online at the end.
    * Example : 
   ``` JavaScript
  const msgBody = {
        "app" : App Name,
        "subject" : Subject,
        "recipient" : recipients Email,
        "replyTo" : ReplyTo
        "sender" : Sender Email,
        "withValidTime" : withValidTime, // Optional 
    }
  ```
  
  # Response
  
  Every Request will have object as response which will contain `data and error`.
  
  ### Success
  ``` JavaScript
  {
    data : {msgId, OTP}, //OTP : It is a 6 digit passcode that user received in mail, so use this OTP to verify user in Client side.
    error : {}
  }
  
  ```
  Status code  : 200.
  
  ### Error
  ``` JavaScript
  {
    data : {},
    error : "Error Reason"
  }
  
  ```
  Status code  : 400.
  
 

## Installation -------------   ( only for those who want to contribute )    --------------

Install my-project with npm

```bash
1 Clone the repository to your local machine using git clone
https://github.com/Harshit107/FreelyEmail-Api.git
2 Navigate to the project folder using cd Auto-Email-Sender
3 Install the dependencies using npm install
```
    
## Environment Variables 

To run this project, you will need to add the following environment variables to your .env file. || 
__contact for .env : contact@harshit107.tech__

`SendInBlue Email`

`SendInBlue Password`



## Demo

[Send your First Email ](https://test.donot-reply.online/)    // under developement


