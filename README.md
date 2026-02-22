# FreelyEmail-API

A centralized, scalable, and modular REST API designed to automatically dispatch customized emails, notifications, and verification links across different applications. Originally built to handle automated emails for an external project, this service is now fully functional, modular, and easy to extend.

## 🚀 Key Features

- **Decoupled Architecture**: Follows best practices with `Controller`, `Service`, and `Routes` layers.
- **Rich HTML Templates**: Includes out-of-the-box, modern, and responsive HTML email templates for OTPs and Links.
- **Dynamic Content Support**: Inject dynamic parameters (e.g., OTP codes, App Name, time validity).
- **Centralized Error Handling**: Structured error responses and APIError classes.
- **Robust Validations**: Enforced standard API payload validation before processing.
- **Multiple Email Types**: Support for plain text, internal templates, and user-provided HTML templates.
- **MongoDB Logging**: Automatically tracks and stores all dispatched email metadata for robust auditing.

## 📁 Directory Structure

```text
📦 FreelyEmail-API
 ┣ 📂 src
 ┃ ┣ 📂 config         # Database and configuration files
 ┃ ┣ 📂 controllers    # Request/Response handlers
 ┃ ┣ 📂 middlewares    # Express middlewares (e.g. global error handler)
 ┃ ┣ 📂 models         # Mongoose database schemas
 ┃ ┣ 📂 routes         # API endpoint definitions
 ┃ ┣ 📂 services       # Business logic (e.g. nodemailer implementation)
 ┃ ┣ 📂 templates      # Modern HTML email templates
 ┃ ┗ 📂 utils          # Helper utilities (validations, catchAsync)
 ┣ 📜 app.js           # API entry point
 ┣ 📜 .env             # Environment Variables
 ┗ 📜 package.json     # Project Metadata & dependencies
```

## 🛠 Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/en/) >= 14.x
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- An SMTP provider account (e.g., [Sendinblue / Brevo](https://www.brevo.com/), SendGrid, NodeMailer)

## ⚙️ Environment Variables

Create a `.env` file in the root folder and configure the following parameters:

```bash
PORT=3000
MONGO_URL_PROD=mongodb+srv://<username>:<password>@cluster.mongodb.net/freelyemail?retryWrites=true&w=majority
SENDINBLUE_EMAIL=your-smtp-email@example.com
SENDINBLUE_PASSWORD=your-smtp-password
```

## 💻 Installation & Running

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd FreelyEmail-API
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server for Development:**
   ```bash
   npm run dev
   ```

4. **Start the server for Production:**
   ```bash
   npm start
   ```

## 🔌 API Endpoints

**Base URL**: `/api/v1/emails`

### 1. General Notification Email
Send a simple text or custom HTML email.
- **Endpoint:** `POST /send`
- **Body:**
  ```json
  {
    "sender": "noreply",
    "recipient": "user@example.com",
    "replyTo": "support@example.com",
    "app": "My Awesome App",
    "subject": "Welcome to our app!",
    "message": "Thank you for joining us.",
    "HTMLfile": "<html>...</html>" 
  }
  ```

### 2. Send OTP with Template
Send an OTP to a user. You can generate your own OTP and pass it in the request.
- **Endpoint:** `POST /otp/send`
- **Body:**
  ```json
  {
    "sender": "auth",
    "recipient": "user@example.com",
    "app": "My Awesome App",
    "subject": "Your Verification Code",
    "otp": "123456",
    "withValidTime": 10
  }
  ```

### 3. Request Auto-Generated OTP 
Let the API generate a secure 6-digit OTP and send it via email automatically. Returns the OTP in the response body.
- **Endpoint:** `POST /otp/request`
- **Body:**
  ```json
  {
    "sender": "auth",
    "recipient": "user@example.com",
    "app": "My Awesome App",
    "subject": "Your Verification Code",
    "withValidTime": 10
  }
  ```

### 4. Send Verification Link
Send an email with an action button for the user to click and verify their account.
- **Endpoint:** `POST /verification/link`
- **Body:**
  ```json
  {
    "sender": "auth",
    "recipient": "user@example.com",
    "app": "My Awesome App",
    "subject": "Verify Your Email Address",
    "link": "https://myapp.com/verify?token=abcxyz",
    "withValidTime": 30
  }
  ```

### 5. Health Check
Check whether the service is running.
- **Endpoint:** `GET /api/v1/health`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Server is working perfectly fine."
  }
  ```

## 🤝 Contributing
Issues and Pull Requests are welcome to make this API even more robust.
