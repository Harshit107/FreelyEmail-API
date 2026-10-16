# Configuration

## Environment Variables

| Variable | Purpose | Example | Required |
|----------|---------|---------|----------|
| `PORT` | Server port | `3000` | No (default: 3000) |
| `APP_BASE_URL` | App base URL | `http://localhost:3000` | No |
| `MONGO_URL_LOCAL` | Local MongoDB | `mongodb://localhost/freelyEmail` | No |
| `MONGO_URL_PROD` | Production MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/...` | Yes (one of them) |
| `BREVO_EMAIL` | Brevo SMTP account email / username | `user@example.com` | Yes (or `SENDINBLUE_EMAIL`) |
| `BREVO_PASSWORD` | Brevo SMTP master key / password | `xsmtpsib-...` | Yes (or `SENDINBLUE_PASSWORD`) |
| `SMTP_HOST` | SMTP server host | `smtp-relay.brevo.com` | No (default: `smtp-relay.brevo.com`) |
| `SMTP_PORT` | SMTP server port | `587` | No (default: 587) |
| `DEFAULT_FROM_DOMAIN` | Fallback verified sender domain | `donot-reply.online` | No |

**Note**: `SENDINBLUE_EMAIL` and `SENDINBLUE_PASSWORD` are also supported for backwards compatibility.


## Configuration Files

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "app.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### package.json

```json
{
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "express-rate-limit": "^8.7.0",
    "helmet": "^8.3.0",
    "mongoose": "^9.10.2",
    "nodemailer": "^8.0.11"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/express-rate-limit": "^5.1.3",
    "@types/node": "^26.6.2",
    "@types/nodemailer": "^8.0.2",
    "nodemon": "^3.1.14",
    "ts-node": "^10.9.2",
    "typescript": "^7.0.2"
  }
}
```

## Middleware Configuration

### Helmet
Enables security headers for Express.

### CORS
Allows all origins (default settings).

### Rate Limiting
Direct API rate limiting is unthrottled for high throughput. Edge rate limiting can be applied at the reverse proxy (e.g., Cloudflare, NGINX) or via client-side throttling.

## MongoDB Connection

Attempts connection in this order:
1. `MONGO_URL_PROD`
2. `MONGO_URL`
3. `MONGO_URI`
4. `MONGODB_URI`

Fails with process exit if no connection string found.

**File**: `src/config/db.js`