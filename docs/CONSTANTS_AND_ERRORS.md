# Centralized Architecture: Constants, Routing & Unified Error Handling

## 1. 📖 Human-Readable Overview

### Why Centralization?
In modern production applications, hardcoding strings (URLs, endpoints, and error messages) directly inside route files, controllers, and services introduces bugs, makes future refactoring difficult, and leads to inconsistent responses across different endpoints.

The `FreelyEmail-API` utilizes a **Single Source of Truth** for:
1. **Routing and URLs**: Endpoints and base paths are defined once in [`src/constants/index.js`](../src/constants/index.js) and imported wherever needed.
2. **Configuration Defaults**: Port, SMTP hosts, and fallback domain names are centralized.
3. **Unified Error Contract**: All errors—whether from a malformed request body, schema validation, rate limiter, or SMTP failure—return an identical, predictable JSON structure.

### High-Level Flow
```mermaid
flowchart TD
    Client[Client / SDK Request] --> App[Express app.js]
    App -->|Check Endpoint via ROUTES| Router[src/routes/email.routes.js]
    Router --> Controller[src/controllers/email.controller.js]
    Controller -->|Throws APIError(message, 400, ERROR_CODES)| ErrorHandler[src/middlewares/error.js]
    Controller --> Service[src/services/email.service.js]
    Service -->|Throws APIError(message, 500, ERROR_CODES)| ErrorHandler
    ErrorHandler -->|Formats JSON Output| ClientError[Unified Error Response: { success: false, data: null, error: { errorCode, message } }]
```

---

## 2. ⚙️ Technical Specification: Constants

All constants are frozen (`Object.freeze`) to guarantee immutability at runtime.

File location: [`src/constants/index.js`](../src/constants/index.js)

### Route Registry (`ROUTES`)
```javascript
const ROUTES = Object.freeze({
  API_BASE: "/api/v1",
  HEALTH: "/api/v1/health",
  LEGACY_CHECK_SERVER: "/checkServer",
  EMAILS: Object.freeze({
    BASE: "/api/v1/emails",
    SEND: "/send",
    OTP_SEND: "/otp/send",
    OTP_REQUEST: "/otp/request",
    LINK_VERIFICATION: "/verification/link",
  }),
});
```

### Configuration Defaults (`DEFAULT_CONFIG`)
```javascript
const DEFAULT_CONFIG = Object.freeze({
  PORT: 3000,
  SMTP_HOST: "smtp-relay.brevo.com",
  SMTP_PORT: 587,
  DEFAULT_FROM_DOMAIN: "donot-reply.online",
});

```

### Centralized Success Messages (`SUCCESS_MESSAGES`)
```javascript
const SUCCESS_MESSAGES = Object.freeze({
  HEALTH: "Server is working perfectly fine.",
  EMAIL_SENT: "Email dispatched successfully",
  OTP_SENT: "OTP email dispatched successfully",
  OTP_REQUESTED: "OTP generated and dispatched successfully",
  LINK_SENT: "Verification link email dispatched successfully",
});
```

---

## 3. ✨ Unified Success Response Specification

All successful responses return HTTP status `200` with the following unified JSON envelope:

```typescript
interface UnifiedSuccessResponse<T = any> {
  success: true;
  data: T;
  message: string;
  error: null;
}
```

### Examples:

#### Standard Email Dispatch
```json
{
  "success": true,
  "data": {
    "messageId": "msg_01HXYZ987654"
  },
  "message": "Email dispatched successfully",
  "error": null
}
```

#### Health Check
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 24.5,
    "timestamp": "2026-09-28T14:30:00.000Z"
  },
  "message": "Server is working perfectly fine.",
  "error": null
}
```

---

## 4. 🛡️ Unified Error Handling Specification

### The JSON Error Contract
All failure responses return HTTP status `>= 400` with the following contract:


```typescript
interface UnifiedErrorResponse {
  success: false;
  data: null;
  error: {
    errorCode: string;
    message: string;
    details?: any;
  };
}
```

#### Example Output:
```json
{
  "success": false,
  "data": null,
  "error": {
    "errorCode": "VALIDATION_ERROR",
    "message": "Sender is required, A valid recipient email address is required",
    "details": {
      "validationErrors": [
        "Sender is required",
        "A valid recipient email address is required"
      ]
    }
  }
}
```

### The `APIError` Class
Located in [`src/middlewares/error.js`](../src/middlewares/error.js), `APIError` extends the native `Error` class:

```javascript
const { APIError } = require("../middlewares/error");
const { ERROR_CODES, ERROR_MESSAGES } = require("../constants");

// Syntax: new APIError(message, statusCode, errorCode, details);
throw new APIError(
  ERROR_MESSAGES[ERROR_CODES.INVALID_OTP],
  400,
  ERROR_CODES.INVALID_OTP
);
```

If `errorCode` is omitted, `APIError` automatically resolves sensible defaults based on status code:
- `400` → `ERROR_CODES.VALIDATION_ERROR`
- `404` → `ERROR_CODES.ROUTE_NOT_FOUND`
- `429` → `ERROR_CODES.RATE_LIMIT_EXCEEDED`
- `500` → `ERROR_CODES.INTERNAL_SERVER_ERROR`

---

## 4. 📋 Error Catalog

| Error Code | HTTP Status | Message | Description |
| :--- | :---: | :--- | :--- |
| `INVALID_JSON` | 400 | "Invalid JSON payload provided" | Triggered when request body contains unparseable JSON |
| `VALIDATION_ERROR` | 400 | "Validation failed for request data" | Payload fields failed schema or type verification |
| `MISSING_REQUIRED_FIELDS` | 400 | "Required fields are missing in request" | Sender, recipient, app, or subject missing |
| `INVALID_RECIPIENT` | 400 | "A valid recipient email address is required" | Recipient email does not conform to regex pattern |
| `MISSING_EMAIL_CONTENT` | 400 | "Email content is required (either message or HTMLfile)" | Neither text body nor HTML string provided |
| `INVALID_OTP` | 400 | "A valid OTP code is required" | OTP is blank or not a string |
| `INVALID_LINK` | 400 | "A valid verification link is required" | Verification URL is missing or blank |
| `ROUTE_NOT_FOUND` | 404 | "Route not found: METHOD /path" | Endpoint requested does not exist |
| `RATE_LIMIT_EXCEEDED` | 429 | "Too many requests from this IP, please try again after 15 minutes" | IP made >100 requests in 15 minute window |
| `SMTP_NOT_CONFIGURED` | 500 | "Brevo SMTP credentials are not configured in environment variables." | Missing environment variables for nodemailer (BREVO_EMAIL / BREVO_PASSWORD) |
| `EMAIL_SEND_FAILED` | 500 | "Failed to send email: [reason]" | Transporter failed to deliver the message |

| `INTERNAL_SERVER_ERROR` | 500 | "Internal Server Error" | Unhandled crash or unhandled promise rejection |

---

## 5. 🛠 Developer Guide: How to Extend

### How to Add a New Route
1. Open [`src/constants/index.js`](../src/constants/index.js) and add your endpoint path under `ROUTES`:
   ```javascript
   ROUTES.EMAILS.ATTACHMENT = "/send/attachment";
   ```
2. Bind the route in [`src/routes/email.routes.js`](../src/routes/email.routes.js):
   ```javascript
   router.post(ROUTES.EMAILS.ATTACHMENT, emailController.sendWithAttachment);
   ```

### How to Add a New Error Code
1. Open [`src/constants/index.js`](../src/constants/index.js):
   ```javascript
   ERROR_CODES.INVALID_ATTACHMENT = "INVALID_ATTACHMENT";
   ERROR_MESSAGES[ERROR_CODES.INVALID_ATTACHMENT] = "File attachment size exceeds allowable limit";
   ```
2. In your controller or service, throw with `APIError`:
   ```javascript
   if (fileSize > MAX_SIZE) {
     throw new APIError(
       ERROR_MESSAGES[ERROR_CODES.INVALID_ATTACHMENT],
       400,
       ERROR_CODES.INVALID_ATTACHMENT
     );
   }
   ```
   The centralized `errorHandler` will automatically format and serialize the response.
