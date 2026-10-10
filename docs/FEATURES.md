# Features Documentation

## Feature 1: Send Notification Email

### Purpose
Send a simple notification email with plain text message or custom HTML.

### Flow
```
Client Application (SDK)
  ↓
POST /api/v1/emails/send
  ↓
Controller: sendNotification()
  ↓
Service: sendMail() → Sendinblue SMTP
  ↓
Service: saveEmailRecord() → MongoDB
  ↓
Response: { success: true, data: { messageId } }
```

### Request Payload
```json
{
  "sender": "support-bot",
  "recipient": "user@example.com",
  "replyTo": "support@example.com",
  "app": "MyApp",
  "subject": "Welcome",
  "message": "Plain text fallback",
  "HTMLfile": "<html>...</html>"
}
```

### Important Files
- **Controller**: `src/controllers/email.controller.js` → `sendNotification()`
- **Service**: `src/services/email.service.js` → `sendMail()`
- **Route**: `src/routes/email.routes.js` → `/send`

---

## Feature 2: Send OTP with Custom Code

### Purpose
Send an email containing a custom OTP code provided by the client.

### Flow
```
Client Application (SDK)
  ↓
POST /api/v1/emails/otp/send
  ↓
Controller: sendOtp()
  ↓
Service: sendMail() with OTP template
  ↓
Service: saveEmailRecord() → MongoDB
  ↓
Response: { success: true, data: { messageId } }
```

### Request Payload
```json
{
  "sender": "auth",
  "recipient": "user@example.com",
  "app": "MyApp",
  "subject": "Your OTP",
  "otp": "123456",
  "withValidTime": 10
}
```

### Important Files
- **Controller**: `src/controllers/email.controller.js` → `sendOtp()`
- **Template**: `src/templates/otpVerificationTemplate.js`

---

## Feature 3: Request Auto-Generated OTP

### Purpose
Let the API generate a secure 6-digit OTP and send it via email. Returns the OTP in the response.

### Flow
```
Client Application (SDK)
  ↓
POST /api/v1/emails/otp/request
  ↓
Controller: requestOtp()
  ↓
Service: generate OTP (Math.random)
  ↓
Service: sendMail() with OTP template
  ↓
Service: saveEmailRecord() → MongoDB
  ↓
Response: { success: true, data: { messageId, otp } }
```

### Request Payload
```json
{
  "sender": "auth",
  "recipient": "user@example.com",
  "app": "MyApp",
  "subject": "Your OTP",
  "withValidTime": 10
}
```

### Response
```json
{
  "success": true,
  "data": {
    "messageId": "abc123",
    "otp": "123456"
  }
}
```

### Important Files
- **Controller**: `src/controllers/email.controller.js` → `requestOtp()`
- **Template**: `src/templates/otpVerificationTemplate.js`

---

## Feature 4: Send Verification Link

### Purpose
Send an email with an action button linking to a verification URL.

### Flow
```
Client Application (SDK)
  ↓
POST /api/v1/emails/verification/link
  ↓
Controller: sendLinkVerification()
  ↓
Service: sendMail() with Link template
  ↓
Service: saveEmailRecord() → MongoDB
  ↓
Response: { success: true, data: { messageId } }
```

### Request Payload
```json
{
  "sender": "auth",
  "recipient": "user@example.com",
  "app": "MyApp",
  "subject": "Verify Your Email",
  "link": "https://myapp.com/verify?token=abc",
  "withValidTime": 30
}
```

### Important Files
- **Controller**: `src/controllers/email.controller.js` → `sendLinkVerification()`
- **Template**: `src/templates/emailVerificationTemplate.js`

---

## Feature 5: Health Check

### Purpose
Verify that the API service is running and responsive.

### Endpoint
```
GET /api/v1/health
```

### Response
```json
{
  "success": true,
  "message": "Server is working perfectly fine."
}
```

### Important Files
- **Route**: `app.js` → `/api/v1/health`

---

## Email Templates

### OTP Template

**File**: `src/templates/otpVerificationTemplate.js`

**Features**:
- Large, monospaced OTP display
- Validity time text
- Warning about unsolicited requests
- Branding header/footer

**Parameters**: `appName`, `otp`, `withValidTime`

### Link Verification Template

**File**: `src/templates/emailVerificationTemplate.js`

**Features**:
- Verification button with link
- Fallback text link
- Validity time text
- Reply-to instructions
- Branding header/footer

**Parameters**: `appName`, `link`, `withValidTime`, `replyTo`

---

## Database Logging

All email transactions are logged to MongoDB.

**Schema**: `src/models/email.model.js`

```javascript
{
  sender: String,
  recipient: String,
  replyTo: String,
  messageId: String,
  app: String,
  type: "notification" | "otp" | "link",
  createdAt: Date,
  updatedAt: Date
}
```

**Service**: `src/services/email.service.js` → `saveEmailRecord()`

**Non-blocking**: If database save fails, the email still sends.