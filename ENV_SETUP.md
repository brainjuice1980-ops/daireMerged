# Environment Variables Setup Guide

This guide explains how to obtain and configure all required API keys and credentials for production-ready authentication.

## Required Services

### 1. Supabase (Database & Backend)
### 2. Resend (Email Service)
### 3. Twilio (SMS Service)
### 4. Google Gemini AI (AI Content Generation)

---

## 1. Supabase Setup

Supabase provides your database and serverless functions.

### Steps:

1. **Create Account**
   - Go to https://supabase.com/dashboard
   - Sign up with GitHub or email

2. **Create Project**
   - Click "New Project"
   - Choose organization
   - Enter project name
   - Set database password (save this!)
   - Select region closest to your users
   - Click "Create new project"
   - Wait 2-3 minutes for provisioning

3. **Get Credentials**
   - Go to Settings > API
   - Copy:
     - **Project URL** (e.g., https://xxxxx.supabase.co)
     - **anon/public key** (long string starting with "eyJ...")

4. **Add to .env**:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

5. **Configure Edge Function Secrets**

You need to add email and SMS credentials to Supabase for the edge functions to use:

```bash
# Using Supabase CLI
supabase secrets set RESEND_API_KEY=your_resend_key
supabase secrets set TWILIO_ACCOUNT_SID=your_twilio_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_twilio_token
supabase secrets set TWILIO_PHONE_NUMBER=your_twilio_number
```

Or manually in Supabase Dashboard:
- Go to Edge Functions > Settings
- Add each secret under "Function Secrets"

---

## 2. Resend Setup (Email Service)

Resend sends OTP codes and password reset emails.

### Steps:

1. **Create Account**
   - Go to https://resend.com
   - Sign up with email or GitHub

2. **Get API Key**
   - After login, go to API Keys
   - Click "Create API Key"
   - Name it (e.g., "Lucra Production")
   - Copy the key immediately (shown only once!)

3. **Verify Domain (Optional but Recommended)**
   - For production, verify your domain
   - Go to Domains > Add Domain
   - Follow DNS setup instructions
   - Update the `from` field in edge functions:
     ```typescript
     from: "Lucra <noreply@yourdomain.com>"
     ```

4. **Free Tier Limits**
   - 100 emails/day free
   - 3,000 emails/month free
   - No credit card required for free tier

5. **Add to Supabase Secrets**:
```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

### Testing Email Locally

For development, use the default `onboarding@resend.dev` sender. This works without domain verification but emails may go to spam.

---

## 3. Twilio Setup (SMS Service)

Twilio sends OTP codes via SMS.

### Steps:

1. **Create Account**
   - Go to https://www.twilio.com/try-twilio
   - Sign up with email
   - Verify your email and phone

2. **Get Trial Credits**
   - New accounts get free trial credits
   - Enough for testing (15-20 SMS messages)

3. **Get Credentials**
   - From Console Dashboard, copy:
     - **Account SID** (starts with AC...)
     - **Auth Token** (click to reveal)
   - Go to Phone Numbers > Manage > Active numbers
   - Copy your **Twilio Phone Number** (e.g., +1234567890)

4. **Trial Account Limitations**
   - Can only send to verified phone numbers
   - Add verified numbers: Console > Phone Numbers > Verified Caller IDs
   - Click "+" to add a number
   - Verify via SMS code

5. **Upgrade for Production**
   - For production, upgrade account (pay-as-you-go)
   - Add payment method
   - Can send to any number
   - ~$0.0075 per SMS in US
   - International rates vary

6. **Add to Supabase Secrets**:
```bash
supabase secrets set TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token_here
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890
```

### Testing SMS

For development with trial account:
- Verify your test phone numbers in Twilio Console
- Only verified numbers will receive SMS
- Upgrade to production for unrestricted sending

---

## 4. Google Gemini AI Setup

Gemini powers AI content generation.

### Steps:

1. **Get API Key**
   - Go to https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Select existing project or create new
   - Copy the API key

2. **Free Tier Limits**
   - 60 requests per minute
   - 1,500 requests per day
   - Free to use

3. **Add to .env**:
```env
VITE_GEMINI_API_KEY=your-gemini-key-here
```

---

## Complete .env File

Create a `.env` file in your project root with all credentials:

```env
# Supabase (Frontend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google Gemini AI
VITE_GEMINI_API_KEY=your-gemini-key-here
```

## Supabase Edge Function Secrets

These are NOT in .env but configured in Supabase:

```bash
# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Setting Supabase Secrets

### Method 1: Using Supabase CLI (Recommended)

```bash
# Install CLI if not already installed
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Set secrets
supabase secrets set RESEND_API_KEY=your_key
supabase secrets set TWILIO_ACCOUNT_SID=your_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_token
supabase secrets set TWILIO_PHONE_NUMBER=your_number

# Verify secrets are set
supabase secrets list
```

### Method 2: Using Supabase Dashboard

1. Go to your project dashboard
2. Navigate to Edge Functions
3. Click on any function
4. Go to "Settings" or "Secrets" tab
5. Add each secret:
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key
   - Click "Save"
6. Repeat for all secrets

---

## Verification Checklist

After setting up all credentials:

- [ ] Supabase project created and credentials added to .env
- [ ] Resend API key obtained and added to Supabase secrets
- [ ] Twilio account created and credentials added to Supabase secrets
- [ ] Gemini API key obtained and added to .env
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] Supabase secrets verified with `supabase secrets list`
- [ ] Test registration flow with real email
- [ ] Test SMS on verified number (trial) or any number (production)

---

## Cost Breakdown

### Free Tier Usage

| Service | Free Tier | Sufficient For |
|---------|-----------|----------------|
| Supabase | 500MB database, 2GB bandwidth | Small to medium apps |
| Resend | 3,000 emails/month | Testing and small deployments |
| Twilio | $15 trial credit | Initial testing only |
| Gemini | 1,500 requests/day | Most use cases |

### Production Costs (Estimated)

For 1,000 monthly active users:

- **Supabase**: $0-25/month (depending on usage)
- **Resend**: $20/month (10,000 emails)
- **Twilio**: $7.50/month (1,000 SMS)
- **Gemini**: Free (within limits)

**Total**: ~$30-55/month for 1,000 active users

---

## Security Best Practices

1. **Never commit .env file**
   - Already in .gitignore
   - Double-check before pushing

2. **Use different keys for development/production**
   - Create separate Supabase projects
   - Use different API keys

3. **Rotate keys regularly**
   - Change keys every 3-6 months
   - Update in all environments

4. **Monitor usage**
   - Check Resend dashboard for email delivery
   - Monitor Twilio for SMS costs
   - Review Supabase logs for errors

5. **Rate limiting**
   - Implement on frontend to prevent abuse
   - Add captcha for registration if needed

---

## Troubleshooting

### Emails not sending
- Verify RESEND_API_KEY is set in Supabase secrets
- Check Resend dashboard for error logs
- Ensure "from" email domain is verified (production)
- Check spam folder

### SMS not sending
- Verify all three Twilio secrets are set
- For trial accounts, verify recipient phone number
- Check Twilio console for error messages
- Ensure phone number format is E.164 (e.g., +1234567890)

### Edge functions failing
- Check Supabase function logs
- Verify all secrets are set correctly
- Ensure functions are deployed
- Check CORS headers are configured

### Environment variables not loading
- Restart dev server after changing .env
- Ensure variables start with VITE_
- Check .env file is in project root

---

## Support Links

- **Supabase Docs**: https://supabase.com/docs
- **Resend Docs**: https://resend.com/docs
- **Twilio Docs**: https://www.twilio.com/docs
- **Gemini Docs**: https://ai.google.dev/docs

---

## Next Steps

1. Complete all setup steps above
2. Test in development environment
3. Deploy to production
4. Monitor usage and costs
5. Upgrade services as needed

For questions or issues, refer to the main README.md or service documentation.
