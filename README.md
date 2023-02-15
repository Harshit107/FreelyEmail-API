
# Auto-Email-Sender (API)

AutoEmailSender API is a RESTful web service that provides developers with an easy-to-use interface for sending emails from within their applications. It allows developers to send emails quickly and easily without having to set up their own SMTP server or domain.

To use the API, a developer needs to make an HTTP request to the service with the required data for sending the email, such as the recipient's email address, subject, and message body. The API then takes care of the rest, including formatting and sending the email using the DoNot-Reply.online domain.

One of the main benefits of your AutoEmailSender API is that it simplifies the process of sending emails for developers who may not have the time or resources to set up their own email infrastructure. It also provides an added layer of security, as it allows developers to send emails without disclosing their own domain or email server information.

The API is built on top of a scalable and reliable infrastructure that ensures high availability and performance. It also provides a simple and clear documentation that makes it easy for developers to integrate the API into their applications.

In summary, your AutoEmailSender API provides a simple, secure, and reliable way for developers to send emails from within their applications without having to configure their own email infrastructure

Summery (😂):
Auto-Email-Sender is build on Node.js that makes it easy to send automated emails without writing any code. It doesnot require any email and Server configuration. Just call the API with the required data and boooom!!! Email Send 


It also come with Android and Node Js library which reduces the effort of managing APIs and handling errors.

## How to use:

### API  : https://send.donot-reply.online/public/email

  
  #### * Send Simple Email : /notification
  ```
   * Request Type : POST
   * Body : { senderEmail,recipientsEmail,appName,subject,emailContent,HTMLfile }
 ```
  * Note : 
    * parameter must have same name as mentioned above
    * sender email should not contain any domain, we will add @donot-reply.online at the end.
    * Example : 
   ``` JavaScript
   const sendingObject = {
      "recipientsEmail" : "Email Address to whom you want to send Email", //  use Array of String for multiple email
      "appName" : "Your APP Name", 
      "subject" : "Subject of your email",
      "senderEmail" : "YourAppEmail", //eg: Your-App-Name // donot include @donot-reply.online // no space or special char
      "emailContent" : "Email Message",  //your Email containt
      "HTMLfile" : "HTML File if you have" //must be in String and single html formate  
    } 
  ```
  
   
  #### * Send OTP Email : /OtpVerification
  ```
   * Request Type : POST
   * Body : { appName,subject,recipientsEmail,senderEmail, otp, withValidTime }
 ```
  * Note : 
    * parameter must have same name as mentioned above
    * sender email should not contain any domain, we will add @donot-reply.online at the end.
    * Example : 
   ``` JavaScript
  const msgBody = {
        "appName" : appName,
        "subject" : subject,
        "recipientsEmail" : recipientsEmail,
        "senderEmail" : senderEmail,
        "otp" : otp,  // must 
        "withValidTime" : withValidTime // not necessary 
    }
  ```

 

## Installation -------------   ( only for those who want to contribute )    -------------------------------------- 

Install my-project with npm

```bash
1 Clone the repository to your local machine using git clone
https://github.com/Harshit107/Donot-Reply-EmailSender-Api.git
2 Navigate to the project folder using cd Auto-Email-Sender
3 Install the dependencies using npm install
```
    
## Environment Variables 

To run this project, you will need to add the following environment variables to your .env file 
contact for .env : contact@harshit107.tech

`SendInBlue Email`

`SendInBlue Password`



## Demo

https://www.test.donot-reply.online

