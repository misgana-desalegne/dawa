# Email Configuration for Feedback Feature

## Setting Up Email Credentials

The feedback feature requires Gmail SMTP credentials to send emails. Follow these steps:

### 1. Set Up Gmail App Password

Since Google no longer allows regular passwords for SMTP access, you need to create an "App Password":

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Navigate to **Security** (left sidebar)
3. Enable **2-Step Verification** if not already enabled
4. In Security settings, find **App passwords**
5. Select "Mail" and "Windows Computer" (or your device)
6. Google will generate a 16-character password
7. Copy this password

### 2. Add Credentials to `.env.local`

Create a `.env.local` file in the project root:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Replace:
- `your-gmail@gmail.com` with your Gmail address
- `your-16-char-app-password` with the password generated above
- Keep existing Stripe credentials as-is

### 3. Verify Configuration

When you start the server:

```bash
npm run dev:server
```

If email credentials are not configured, you'll see a warning in the console. The feedback endpoint will return an error if credentials are missing.

### Note

- Feedback emails will be sent TO `misgana21son@gmail.com`
- A confirmation email will be sent TO the user's provided email address
- FROM email will be your configured `EMAIL_USER`

If you use a different email service (like SendGrid, AWS SES, etc.), modify the transporter configuration in `server/index.js`.
