# API Documentation - Backend

## Base URL

```
/api/v1/emails
```

Full URLs: `http://localhost:3000/api/v1/emails`

---

## 1. Health Check

**Endpoint**: `GET /api/v1/health`  
**Purpose**: Check if API server is running

### Response
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 14.2,
    "timestamp": "2026-09-28T14:30:00.000Z"
  },
  "message": "Server is working perfectly fine.",
  "error": null
}
```

---

## 2. Send Notification Email

**Endpoint**: `POST /api/v1/emails/send`  
**Purpose**: Send a plain text or custom HTML email

### Request Body
```json
{
  "sender": "string (required)",
  "recipient": "string (required)",
  "replyTo": "string (optional)",
  "app": "string (required)",
  "subject": "string (required)",
  "message": "string (optional)",
  "HTMLfile": "string (optional)"
}
```

**Note**: At least one of `message` or `HTMLfile` is required.

### Response (Success)
```json
{
  "success": true,
  "data": {
    "messageId": "abc123"
  },
  "message": "Email dispatched successfully",
  "error": null
}
```


### Response (Validation Error)
```json
{
  "success": false,
  "data": null,
  "error": {
    "errorCode": "VALIDATION_ERROR",
    "message": "A valid recipient email address is required"
  }
}
```


**Controller**: `src/controllers/email.controller.js` → `sendNotification()`

---

## 3. Send OTP (Custom)

**Endpoint**: `POST /api/v1/emails/otp/send`  
**Purpose**: Send email with custom OTP code

### Request Body
```json
{
  "sender": "string (required)",
  "recipient": "string (required)",
  "replyTo": "string (optional)",
  "app": "string (required)",
  "subject": "string (required)",
  "otp": "string (required)",
  "withValidTime": "number (optional)",
  "HTMLfile": "string (optional)"
}
```

**Note**: `otp` field is required.

### Response (Success)
```json
{
  "success": true,
  "data": {
    "messageId": "abc123"
  },
  "message": "OTP email dispatched successfully",
  "error": null
}
```

**Controller**: `src/controllers/email.controller.js` → `sendOtp()`

---

## 4. Request Auto-Generated OTP

**Endpoint**: `POST /api/v1/emails/otp/request`  
**Purpose**: Let API generate and send a 6-digit OTP

### Request Body
```json
{
  "sender": "string (required)",
  "recipient": "string (required)",
  "replyTo": "string (optional)",
  "app": "string (required)",
  "subject": "string (required)",
  "withValidTime": "number (optional)"
}
```

### Response (Success)
```json
{
  "success": true,
  "data": {
    "messageId": "abc123",
    "otp": "123456"
  },
  "message": "OTP generated and dispatched successfully",
  "error": null
}
```

**Controller**: `src/controllers/email.controller.js` → `requestOtp()`

---

## 5. Send Verification Link

**Endpoint**: `POST /api/v1/emails/verification/link`  
**Purpose**: Send email with verification button/link

### Request Body
```json
{
  "sender": "string (required)",
  "recipient": "string (required)",
  "replyTo": "string (optional)",
  "app": "string (required)",
  "subject": "string (required)",
  "link": "string (required)",
  "withValidTime": "number (optional)",
  "HTMLfile": "string (optional)"
}
```

**Note**: `link` field is required.

### Response (Success)
```json
{
  "success": true,
  "data": {
    "messageId": "abc123"
  },
  "message": "Verification link email dispatched successfully",
  "error": null
}
```


**Controller**: `src/controllers/email.controller.js` → `sendLinkVerification()`

---

## Error Responses

All errors return JSON with `success: false`, `data: null`, and a structured `error` object with `errorCode` and `message`.

```json
{
  "success": false,
  "data": null,
  "error": {
    "errorCode": "VALIDATION_ERROR",
    "message": "Sender is required, A valid recipient email address is required"
  }
}
```

For full error catalog and route constants, see [CONSTANTS_AND_ERRORS.md](CONSTANTS_AND_ERRORS.md).

---

## Rate Limiting

**Window**: 15 minutes  
**Max Requests**: 100 per IP

### Rate Limit Response
```json
{
  "success": false,
  "data": null,
  "error": {
    "errorCode": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests from this IP, please try again after 15 minutes"
  }
}
```