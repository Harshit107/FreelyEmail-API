# AI Knowledge Base - API

## Quick Reference

### Key Controllers

| Controller | Purpose | Endpoint |
|------------|---------|----------|
| `sendNotification()` | Send notification email | POST /send |
| `sendOtp()` | Send email with custom OTP | POST /otp/send |
| `requestOtp()` | Request auto-generated OTP | POST /otp/request |
| `sendLinkVerification()` | Send verification link email | POST /verification/link |

### Important Paths

| File | Purpose |
|------|---------|
| `app.js` | Express app entry point |
| `src/config/db.js` | MongoDB connection |
| `src/controllers/email.controller.js` | Endpoint handlers |
| `src/services/email.service.js` | SMTP + DB operations |
| `src/routes/email.routes.js` | API routes |
| `src/models/email.model.js` | Email schema |
| `src/templates/otpVerificationTemplate.js` | OTP HTML template |
| `src/templates/emailVerificationTemplate.js` | Link HTML template |

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/emails/send` | Send notification |
| POST | `/api/v1/emails/otp/send` | Send OTP (custom) |
| POST | `/api/v1/emails/otp/request` | Request auto OTP |
| POST | `/api/v1/emails/verification/link` | Send verification link |

### Database Collection

**Collection**: `emails`

**Fields**:
- `sender`: String
- `recipient`: String
- `replyTo`: String (optional)
- `messageId`: String
- `app`: String
- `type`: "notification" \| "otp" \| "link"
- `createdAt`: Date
- `updatedAt`: Date

### Common Tasks

**Add new email type**:
1. Add template in `src/templates/`
2. Add controller in `src/controllers/email.controller.js`
3. Add route in `src/routes/email.routes.js`

**Change OTP template**:
- Edit: `src/templates/otpVerificationTemplate.js`

**Add authentication**:
1. Add middleware in `src/middlewares/`
2. Add auth check to routes
3. Update SDK to include auth header

### Email Types

| Type | Template | Description |
|------|----------|-------------|
| `notification` | Custom HTML | Plain text or custom HTML |
| `otp` | OTP template | OTP with large display |
| `link` | Link template | Verification link with button |

### Error Handling

**Global Handler**: `src/middlewares/error.js`

**APIError Class**:
```javascript
class APIError extends Error {
  constructor(message, statusCode);
}
```

**Validation Errors**: `src/utils/validator.js`

### SMTP Configuration

**Service**: `src/services/email.service.js`

**Settings**:
- Host: `smtp-relay.sendinblue.com`
- Port: `587`
- Auth: `SENDINBLUE_EMAIL` and `SENDINBLUE_PASSWORD`