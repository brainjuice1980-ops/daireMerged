# Quick Setup Guide

This guide will help you get Lucra running on your local machine in minutes.

## Prerequisites

Install these first:
1. **Node.js** (v16+) from https://nodejs.org/
2. **Code Editor** - VS Code recommended

## Quick Start (5 minutes)

### Step 1: Download and Extract
Download the project and extract it to a folder on your computer.

### Step 2: Run Setup Script

**On Windows:**
- Double-click `setup.bat`
- Follow the prompts

**On Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Manual Setup (if scripts don't work):**
```bash
npm install
```

### Step 3: Get Your API Keys

#### Supabase (Required)
1. Go to https://supabase.com/dashboard
2. Sign in or create free account
3. Click "New Project"
4. Fill in project details and create
5. Go to Settings > API
6. Copy:
   - Project URL
   - anon/public key

#### Google Gemini AI (Required)
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### Step 4: Configure Environment

Open `.env` file in the project folder and update:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GEMINI_API_KEY=your-gemini-key-here
```

### Step 5: Set Up Database

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push

# Deploy all edge functions
supabase functions deploy
```

#### Option B: Manual Setup

1. Open https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Click "New Query"
5. Copy and run each file from `supabase/migrations/` folder in this order:
   - `20251104084110_create_real_estate_schema.sql`
   - `20251104095259_add_global_real_estate_tables.sql`
   - `20251104103319_add_client_otp_authentication.sql`
   - `20251104175918_add_client_profile_information.sql`
   - `20251104181410_add_staff_authentication_system.sql`
   - `20251104182101_add_client_password_authentication.sql`

6. Deploy Edge Functions:
   - Go to Edge Functions in Supabase Dashboard
   - Click "Deploy new function"
   - Upload each function from `supabase/functions/` folder

### Step 6: Start the App

```bash
npm run dev
```

Open your browser to: http://localhost:5173

## First Login

### Create Admin Account (Do this first!)

You need to manually create an admin account in Supabase:

1. Go to your Supabase Dashboard
2. Click on "Table Editor"
3. Select the `users` table
4. Click "Insert row"
5. Fill in:
   - email: your@email.com
   - name: Your Name
   - role: Owner
   - temp_password: admin123
   - temp_password_expires_at: (set to tomorrow's date)
   - force_password_change: true

6. Click "Save"

Now you can login with:
- Email: your@email.com
- Password: admin123

You'll be prompted to change your password on first login.

### Test Client Registration

1. Click "Sign Up" on homepage
2. Fill in registration form
3. Verify OTP codes (check console logs in development)
4. Login with email and password

## Common Issues

### Port Already in Use
```bash
npx kill-port 5173
npm run dev
```

### Can't Connect to Database
- Double-check your `.env` file
- Verify Supabase URL and keys are correct
- Make sure migrations were applied

### Edge Functions Not Working
- Verify functions are deployed in Supabase Dashboard
- Check function logs in Supabase for errors
- Make sure CORS headers are enabled

### Environment Variables Not Loading
- `.env` file must be in root folder (same level as package.json)
- Restart dev server after changing `.env`
- All variables must start with `VITE_`

## Project Structure

```
lucra/
├── .env                    # Your API keys (create this)
├── setup.sh               # Mac/Linux setup script
├── setup.bat              # Windows setup script
├── README.md              # Full documentation
├── SETUP_GUIDE.md         # This file
├── package.json           # Dependencies
├── App.tsx                # Main app
├── components/            # All UI components
├── lib/                   # Database helpers
├── services/              # API services
├── supabase/
│   ├── migrations/        # Database schema
│   └── functions/         # Edge functions
└── data/                  # Mock data
```

## Need Help?

1. Check the full README.md for detailed information
2. Review Supabase Dashboard logs
3. Check browser console for errors
4. Verify all migrations are applied
5. Ensure edge functions are deployed

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## What's Next?

Once running:
1. Login as admin
2. Create staff users in Clients section
3. Explore Content Studio
4. Try AI features
5. Upload documents to Vault
6. Add property listings

## Production Deployment

For production deployment:
1. Build the app: `npm run build`
2. Deploy `dist/` folder to your hosting (Vercel, Netlify, etc.)
3. Set environment variables in hosting platform
4. Ensure Supabase production project is configured

Enjoy using Lucra!
