# FreelyEmail-API Documentation

## Overview

This folder contains documentation for the FreelyEmail-API backend service.

## Documentation Structure

| File | Purpose |
|------|---------|
| [README.md](README.md) | This overview file |
| [INTEGRATION.md](INTEGRATION.md) | How API connects to SDK |
| [API.md](API.md) | Complete REST API documentation |
| [CONFIGURATION.md](CONFIGURATION.md) | Environment and configuration |
| [FEATURES.md](FEATURES.md) | Feature descriptions |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Setup and run commands |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues and solutions |
| [AI-KNOWLEDGE.md](AI-KNOWLEDGE.md) | Quick reference for AI agents |

## Quick Start

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create `.env` file:
```bash
PORT=3000
MONGO_URL_PROD=mongodb+srv://user:pass@cluster.mongodb.net/freelyemail
SENDINBLUE_EMAIL=your-email@example.com
SENDINBLUE_PASSWORD=your-smtp-password
```

### Run Server

```bash
npm run dev
```

### API Base URL

```
http://localhost:3000/api/v1/emails
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/emails/send` | Send notification email |
| POST | `/api/v1/emails/otp/send` | Send email with custom OTP |
| POST | `/api/v1/emails/otp/request` | Request auto-generated OTP |
| POST | `/api/v1/emails/verification/link` | Send verification link |

## Project Structure

```
FreelyEmail-API/
├── app.js                 # Entry point
├── src/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── controllers/
│   │   └── email.controller.js
│   ├── services/
│   │   └── email.service.js
│   ├── routes/
│   │   └── email.routes.js
│   ├── models/
│   │   └── email.model.js
│   ├── middlewares/
│   │   └── error.js
│   ├── utils/
│   │   ├── catchAsync.js
│   │   └── validator.js
│   ├── templates/
│   │   ├── otpVerificationTemplate.js
│   │   └── emailVerificationTemplate.js
│   └── types/
│       └── index.ts
```

## See Also

- [FreelyEmail-Node-library Documentation](../FreelyEmail-Node-library/docs/README.md) - SDK documentation