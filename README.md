# Lucra - Real Estate AI Platform

A comprehensive real estate management platform with AI-powered content creation, client management, and intelligent market insights.

## Features

- **AI-Powered Content Studio**: Generate social media posts, property descriptions, and marketing content
- **Client Management**: Secure client portal with OTP and password authentication
- **Staff Dashboard**: Role-based access for Owners, Admins, and Property Advisors
- **Market Intelligence**: AI-driven property valuations and market analysis
- **Contract Management**: Digital contract handling and tracking
- **Content Planner**: Schedule and manage marketing campaigns
- **Vault**: Secure document storage and management

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom email/password + OTP system
- **AI Integration**: Google Gemini AI
- **Backend**: Supabase Edge Functions (Deno)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional) - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

## Local Development Setup

### 1. Clone or Download the Project

If using Git:
```bash
git clone <your-repo-url>
cd lucra
```

Or download and extract the project files to a directory.

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**For detailed setup instructions for ALL required services (including email and SMS), see [ENV_SETUP.md](ENV_SETUP.md)**

Quick links:
- **Supabase**: [Dashboard](https://supabase.com/dashboard) - Get URL and anon key from Settings > API
- **Gemini AI**: [Get API Key](https://makersuite.google.com/app/apikey)
- **Resend** (Email): [Get API Key](https://resend.com) - Add to Supabase secrets
- **Twilio** (SMS): [Get Credentials](https://www.twilio.com/try-twilio) - Add to Supabase secrets

### 4. Set Up Supabase Database

#### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link to your project:
```bash
supabase link --project-ref your-project-ref
```

3. Apply migrations:
```bash
supabase db push
```

4. Configure Supabase secrets for email and SMS:
```bash
supabase secrets set RESEND_API_KEY=your_resend_key
supabase secrets set TWILIO_ACCOUNT_SID=your_twilio_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_twilio_token
supabase secrets set TWILIO_PHONE_NUMBER=your_twilio_number
```

5. Deploy edge functions:
```bash
supabase functions deploy
```

#### Option B: Manual Setup

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run each migration file in order from `supabase/migrations/`:
   - `20251104084110_create_real_estate_schema.sql`
   - `20251104095259_add_global_real_estate_tables.sql`
   - `20251104103319_add_client_otp_authentication.sql`
   - `20251104175918_add_client_profile_information.sql`
   - `20251104181410_add_staff_authentication_system.sql`
   - `20251104182101_add_client_password_authentication.sql`

4. Add secrets in Supabase Dashboard (Edge Functions > Settings > Secrets):
   - `RESEND_API_KEY`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`

5. Deploy Edge Functions manually through Supabase Dashboard

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
lucra/
├── components/              # React components
│   ├── icons/              # Icon components
│   ├── Dashboard.tsx       # Main dashboard
│   ├── ContentStudio.tsx   # AI content creation
│   ├── Clients.tsx         # Client management
│   ├── UnifiedLogin.tsx    # Smart login system
│   └── ...
├── lib/                    # Utilities and helpers
│   ├── db/                 # Database operations
│   ├── supabase.ts         # Supabase client
│   └── database.types.ts   # TypeScript types
├── services/               # External service integrations
│   ├── geminiService.ts    # Google Gemini AI
│   └── apiService.ts       # API utilities
├── data/                   # Mock data and constants
├── supabase/              # Supabase configuration
│   ├── migrations/        # Database migrations
│   └── functions/         # Edge functions
├── App.tsx                # Main app component
├── index.tsx              # App entry point
├── .env                   # Environment variables (create this)
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
└── tailwind.config.js     # Tailwind CSS config
```

## Authentication System

### For Clients:
1. **Sign Up**: New clients register with email, phone, first name, last name, location, and password
2. **OTP Verification**: Email and SMS OTP sent for verification
3. **Login**: Email + password authentication

### For Staff:
1. **Registration**: Admin creates staff accounts with temporary passwords
2. **First Login**: Staff login with temporary password (valid 24 hours)
3. **Password Change**: Forced password change on first login
4. **Subsequent Logins**: Email + permanent password

### Unified Login:
The system automatically detects user type (client or staff) based on email and authenticates accordingly.

## User Roles

- **Owner**: Full system access, can manage everything
- **Admin**: Can manage users, clients, contracts, and content
- **Property Advisor**: Can manage clients and create content
- **Client**: Access to personal dashboard and AI tools

## Edge Functions

The following Supabase Edge Functions are deployed:

- `generate-client-otp`: Generate OTP codes for registration
- `verify-client-otp`: Verify OTP and create client account
- `client-login`: Authenticate client users
- `staff-login`: Authenticate staff users
- `unified-login`: Smart login that detects user type
- `change-password`: Change user password
- `request-password-reset`: Request password reset OTP
- `reset-password`: Reset password with OTP verification

## Database Schema

### Main Tables:
- `users`: All system users (staff and clients)
- `clients`: Client-specific data
- `client_profiles`: Extended client information
- `client_otp_verifications`: OTP verification records
- `contracts`: Contract management
- `listings`: Property listings
- `chat_conversations`: AI chat history
- `chat_messages`: Individual chat messages
- `content_items`: Generated content
- `master_prompts`: AI prompt templates
- `vault_items`: Document storage

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Troubleshooting

### Common Issues:

**Port already in use:**
```bash
# Kill the process using port 5173
npx kill-port 5173
npm run dev
```

**Environment variables not loading:**
- Ensure `.env` file is in root directory
- Restart dev server after changing `.env`
- Variables must start with `VITE_` to be accessible in frontend

**Database connection errors:**
- Verify Supabase URL and anon key in `.env`
- Check that migrations have been applied
- Ensure RLS policies are enabled

**Edge function errors:**
- Check Supabase dashboard for function logs
- Verify functions are deployed
- Ensure CORS headers are properly configured

**Build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Update dependencies: `npm update`

## Security Notes

- Never commit `.env` file to version control
- Use environment variables for all sensitive data
- Supabase RLS (Row Level Security) is enabled on all tables
- All passwords are hashed using bcrypt
- OTP codes expire after 10 minutes
- Maximum 5 OTP verification attempts

## API Keys Required

1. **Supabase**: For database and authentication
2. **Google Gemini AI**: For AI content generation
3. **Resend**: For sending OTP and notification emails
4. **Twilio**: For sending OTP via SMS

**See [ENV_SETUP.md](ENV_SETUP.md) for complete setup instructions including free tier limits and cost breakdowns.**

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase logs in the dashboard
3. Check browser console for frontend errors
4. Review edge function logs for backend errors

## License

Proprietary - All rights reserved

## Contributing

This is a private project. Contact the project owner for contribution guidelines.
