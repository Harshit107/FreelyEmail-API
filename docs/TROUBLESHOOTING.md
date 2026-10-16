# Troubleshooting

## Common Issues

---

## 1. MongoDB Connection Error

### Problem
```
MongoDB connection error: MongoDB is not defined
```

### Possible Reason
MongoDB connection string is missing or malformed.

### Where to Check
- `.env` file exists
- `MONGO_URL_PROD` or `MONGO_URL_LOCAL` is set
- Connection string format is correct

### Relevant File
`src/config/db.js`

### Possible Solution
Verify `.env` has one of these:
```bash
MONGO_URL_PROD=mongodb+srv://user:pass@cluster.mongodb.net/freelyemail?retryWrites=true&w=majority
MONGO_URL_LOCAL=mongodb://localhost/freelyEmail
```

---

## 2. SMTP Authentication Failed

### Problem
```
Failed to send email: Invalid login: authentication failed
```

### Possible Reason
SMTP credentials in `.env` are incorrect or expired.

### Where to Check
- `SENDINBLUE_EMAIL` matches your Sendinblue account
- `SENDINBLUE_PASSWORD` is the SMTP password (not login password)

### Relevant File
`src/services/email.service.js`

### Possible Solution
1. Generate new SMTP password in Sendinblue dashboard
2. Update `.env` with new credentials
3. Restart the API server

---

## 3. Email Not Received

### Problem
API returns success but email not received.

### Possible Reason
- Email marked as spam
- SMTP server rejected
- Recipient address is invalid

### Where to Check
- MongoDB `emails` collection for the record
- Sendinblue email logs/dashboard
- Recipient spam folder

### Relevant Files
- `src/services/email.service.js` → `saveEmailRecord()`
- `src/models/email.model.js`

### Possible Solution
1. Check MongoDB for the email record
2. Verify SMTP credentials in Sendinblue dashboard
3. Check recipient email address spelling

---

## 4. Validation Error

### Problem
```json
{
  "success": false,
  "error": "Enter Valid Recipient Email Address"
}
```

### Possible Reason
Missing required fields in request payload.

### Where to Check
- Request body has all required fields: `sender`, `recipient`, `app`, `subject`
- Fields are not empty strings

### Relevant File
`src/utils/validator.js`

### Possible Solution
Verify request payload has required fields:
```json
{
  "sender": "valid@email.com",
  "recipient": "valid@email.com",
  "app": "MyApp",
  "subject": "Test"
}
```

---

## 5. Rate Limiting Considerations

FreelyEmail-API does not apply internal rate limiting to email endpoints. If you experience `429 Too Many Requests`, check whether an upstream proxy (such as Cloudflare, NGINX, or client rate limiting) has rate limiting active.