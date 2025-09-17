# Email Setup Instructions

This document explains how to set up email notifications for the contact form.

## Overview

The contact form sends email notifications to `admin@yahskapolymers.com` when users submit inquiries. The implementation uses **Nodemailer with SMTP**, which works with any email provider (Gmail, Outlook, Yahoo, etc.).

## Setup Options

Choose one of the following email providers:

### Option 1: Gmail (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update Environment Variables**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-character-app-password
   SMTP_FROM_NAME=Yahska Polymers Contact Form
   ```

### Option 2: Outlook/Hotmail

1. **Update Environment Variables**:
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@outlook.com
   SMTP_PASSWORD=your-email-password
   SMTP_FROM_NAME=Yahska Polymers Contact Form
   ```

### Option 3: Yahoo Mail

1. **Generate App Password**:
   - Go to Yahoo Account settings
   - Account Security → Generate app password
   - Select "Mail" and generate password

2. **Update Environment Variables**:
   ```env
   SMTP_HOST=smtp.mail.yahoo.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@yahoo.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM_NAME=Yahska Polymers Contact Form
   ```

### Option 4: Custom SMTP Server

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
SMTP_FROM_NAME=Yahska Polymers Contact Form
```

## Configuration Steps

### 1. Update Environment Variables

1. Open `.env.local` file in the project root
2. Replace the placeholder values with your actual SMTP credentials
3. Save the file

### 2. Restart the Development Server

```bash
npm run dev
```

## Testing

1. Navigate to the contact page: `http://localhost:3000/contact`
2. Fill out and submit the contact form
3. Check the admin email (`admin@yahskapolymers.com`) for the notification
4. Check the browser console and server logs for any errors

## Email Format

The email notifications include:
- Contact person's information (name, email, phone, company, industry)
- Inquiry type and message
- Timestamp in IST
- Reply-to address set to the customer's email for easy responses

## Troubleshooting

### Common Issues:

1. **"Authentication failed" error**
   - Double-check username and password
   - For Gmail: Ensure 2FA is enabled and use App Password
   - For Yahoo: Use App Password, not regular password

2. **"Connection timeout" error**
   - Check SMTP host and port settings
   - Verify firewall/network settings
   - Try different ports (25, 465, 587)

3. **Emails not being received**
   - Check spam/junk folders
   - Verify the recipient email address
   - Check server logs for delivery errors

4. **"Invalid login" error**
   - Verify email credentials
   - Check if "Less secure app access" is enabled (for some providers)

### Testing with Different Providers

**Gmail Issues:**
- Must use App Password (not regular password)
- Enable 2-Factor Authentication first

**Outlook Issues:**
- May need to enable "Less secure apps"
- Sometimes requires OAuth instead of basic auth

**Yahoo Issues:**
- Requires App Password
- Check Yahoo's security settings

## Production Deployment

When deploying to production:
1. Set all SMTP environment variables on your hosting platform
2. Use a professional email address (not personal Gmail)
3. Consider using a dedicated SMTP service for better deliverability
4. Test the contact form on the live site

## Cost

**Free Options:**
- Gmail: Free with your Google account
- Outlook: Free with Microsoft account
- Yahoo: Free with Yahoo account

**Professional SMTP Services:**
- SendGrid: 100 emails/day free
- Mailgun: 5,000 emails/month free
- Amazon SES: Very low cost

## Security Notes

- Never commit SMTP credentials to version control
- Use environment variables for all sensitive data
- Consider using App Passwords instead of main passwords
- The contact form includes basic validation and sanitization