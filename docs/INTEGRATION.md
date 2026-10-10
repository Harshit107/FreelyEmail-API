# Integration: API → SDK

## Communication Flow

```
Client Application (uses SDK)
    ↓
SDK makes HTTP request to API
    ↓
API endpoint receives request
    ↓
Controller processes request
    ↓
Service sends email via SMTP
    ↓
Service saves record to MongoDB
    ↓
API returns response
    ↓
SDK parses response
    ↓
Client receives result
```

## SDK → API Request

### HTTP Request
```javascript
POST /api/v1/emails/otp/request
Content-Type: application/json

{
  "sender": "auth",
  "recipient": "user@example.com",
  "app": "MyApp",
  "subject": "Your OTP",
  "withValidTime": 10
}
```

### API Response
```json
{
  "success": true,
  "data": {
    "messageId": "abc123",
    "otp": "123456"
  },
  "error": null
}
```

## API → SDK Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "messageId": "abc123"
  },
  "error": null
}
```

### Validation Error Response
```json
{
  "success": false,
  "error": "Enter Valid Recipient Email Address"
}
```

### Server Error Response
```json
{
  "success": false,
  "error": "SMTP credentials are not configured properly."
}
```

## Request Validation

### Required Fields (All Endpoints)
| Field | Type | Required |
|-------|------|----------|
| `sender` | string | Yes |
| `recipient` | string | Yes |
| `app` | string | Yes |
| `subject` | string | Yes |

### Endpoint-Specific Requirements
| Endpoint | Extra Required Fields |
|----------|----------------------|
| `/send` | `message` OR `HTMLfile` |
| `/otp/send` | `otp` |
| `/verification/link` | `link` |

## Shared Data Structures

### Email Model (MongoDB)
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

### API Error Class
```javascript
class APIError extends Error {
  statusCode: number;
  message: string;
}
```

## Database Schema

**Collection**: `emails`

**Fields**:
- `sender` (String, required)
- `recipient` (String, required)
- `replyTo` (String, optional)
- `messageId` (String, required)
- `app` (String, required)
- `type` (String: "notification", "otp", "link")
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/emails/send` | Send notification email |
| POST | `/api/v1/emails/otp/send` | Send OTP (custom) |
| POST | `/api/v1/emails/otp/request` | Request auto-generated OTP |
| POST | `/api/v1/emails/verification/link` | Send verification link |

## Rate Limiting

**Window**: 15 minutes  
**Max Requests**: 100 per IP

Applied to all routes under `/api/v1/emails`.