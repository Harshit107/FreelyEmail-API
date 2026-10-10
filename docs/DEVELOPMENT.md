# Development Guide

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >=14.20.1 |
| Package Manager | npm |
| MongoDB | Local or Atlas |

## Installation

```bash
npm install
```

## Running the Project

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Build Commands

```bash
npm run build
```

Output: `dist/app.js`

## Environment Variables

Create `.env` file:
```bash
PORT=3000
MONGO_URL_PROD=mongodb+srv://user:pass@cluster.mongodb.net/freelyemail
SENDINBLUE_EMAIL=your-email@example.com
SENDINBLUE_PASSWORD=your-smtp-password
```

## Project Structure

```
FreelyEmail-API/
├── app.js                 # Entry point
├── tsconfig.json
├── package.json
├── .env                   # Environment variables
├── node_modules/
└── src/
    ├── config/
    │   └── db.js          # MongoDB connection
    ├── controllers/
    │   └── email.controller.js
    ├── services/
    │   └── email.service.js
    ├── routes/
    │   └── email.routes.js
    ├── models/
    │   └── email.model.js
    ├── middlewares/
    │   └── error.js
    ├── utils/
    │   ├── catchAsync.js
    │   └── validator.js
    ├── templates/
    │   ├── otpVerificationTemplate.js
    │   └── emailVerificationTemplate.js
    └── types/
        └── index.ts
```

## Important Files

| File | Purpose |
|------|---------|
| `app.js` | Express app entry point |
| `src/config/db.js` | MongoDB connection |
| `src/services/email.service.js` | SMTP logic |
| `src/controllers/email.controller.js` | Endpoint handlers |
| `src/routes/email.routes.js` | API routes |

## Common Tasks

### Change SMTP Provider

1. Update credentials in `.env`
2. Update SMTP settings in `src/services/email.service.js`

### Change Database

1. Update connection string in `.env`
2. `src/config/db.js` will automatically use the new URL