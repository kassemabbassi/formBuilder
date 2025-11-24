# Form Builder Application

A professional form builder platform similar to Google Forms, built with Next.js, Supabase, and modern web technologies.

## Features

- **User Authentication**: Secure sign up, sign in, and password reset functionality with password visibility toggle
- **Event Management**: Create and manage events with comprehensive details and automatic deadline enforcement
- **Dynamic Form Builder**: Drag-and-drop interface with 24+ field types
- **Public Form Sharing**: Generate secure, shareable URLs for form distribution
- **Response Management**: View, search, edit, delete, and export form submissions in real-time
- **Professional Design**: Beautiful UI with light/dark mode support and smooth animations
- **Real-time Updates**: Instant form updates and submissions using Supabase subscriptions
- **Secure & Scalable**: Built with Supabase for enterprise-grade security
- **Deadline Management**: Automatic form closure when deadline is reached
- **Participant Management**: Edit or delete participant responses with verification dialogs

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with PKCE flow
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Git installed

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd form-builder-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

   To find your Supabase credentials:
   - Go to your Supabase project dashboard
   - Click Settings (gear icon) → API
   - Copy the Project URL and anon/public key

4. **Set up the database**
   
   Run the SQL scripts in your Supabase SQL Editor in this order:
   
   a. **Create tables** (`scripts/01-create-tables.sql`)
      - Creates events, form_fields, form_submissions, and submission_answers tables
      - Sets up proper relationships and indexes
   
   b. **Set up Row Level Security** (`scripts/02-setup-rls.sql`)
      - Configures security policies
      - Ensures users can only access their own data
      - Allows public access to active forms
   
   c. **Create app users table** (`scripts/03-create-appusers-table.sql`)
      - Creates appusers table for storing user profiles
      - Links to Supabase auth users
   
   d. **Add deadline field** (`scripts/05-add-deadline-field.sql`)
      - Adds deadline support to events table

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### 1. Sign Up / Sign In

**Sign Up:**
1. Click "Get Started" or "Sign Up" on the homepage
2. Enter your display name, email, and password (minimum 6 characters)
3. Use the eye icon to toggle password visibility
4. Confirm your password
5. Click "Create Account"
6. Check your email for a confirmation link
7. Click the confirmation link to activate your account

**Sign In:**
1. Click "Sign In" on the homepage
2. Enter your email and password
3. Use the eye icon to toggle password visibility
4. Click "Sign In"
5. You'll be redirected to your dashboard

**Forgot Password:**
1. Click "Forgot password?" on the sign-in page
2. Enter your email address
3. Check your email for a password reset link
4. Click the link and enter your new password
5. Sign in with your new password

### 2. Create an Event

1. From your dashboard, click "Create New Event"
2. Fill in the event details:
   - **Title**: Name of your event (required)
   - **Description**: Detailed description of the event
   - **Event Type**: Category (Conference, Workshop, Webinar, etc.)
   - **Start Date & Time**: When the event begins
   - **End Date & Time**: When the event ends
   - **Location**: Physical or virtual location
   - **Organizer Information**: Your contact details
   - **Max Participants**: Limit the number of registrations
   - **Banner Color**: Customize the event's visual theme
   - **Form Deadline**: Set an optional deadline for form submissions
3. Click "Create Event"
4. You'll be redirected to the form builder

**Deadline Functionality:**
- When you set a deadline, the form automatically closes at that exact time
- Participants cannot submit after the deadline
- The form displays a "Form Closed" message if accessed after the deadline
- You can still manually close forms by toggling the active status

### 3. Build Your Form

The form builder has three main sections:

**Left Panel - Event Settings:**
- Edit event title and description
- Toggle form active/inactive status
- View form statistics

**Middle Panel - Form Fields:**
- Click "Add Field" to add new fields
- Choose from 24+ field types:
  - **Basic**: Text, Email, Number, Phone, URL
  - **Text**: Textarea, Password
  - **Choice**: Dropdown, Radio, Checkbox, Multi-select
  - **Date & Time**: Date, Time, DateTime
  - **Advanced**: File Upload, Rating, Slider, Color Picker, Scale, Matrix, Signature, Hidden, Section Header, Divider

**Right Panel - Field Properties:**
- Configure field settings:
  - Label and placeholder text
  - Required/optional toggle
  - Validation rules (min/max length, min/max value)
  - Options for choice fields
  - Help text for users
- Reorder fields by dragging
- Delete fields you don't need

**Saving:**
- Click "Save Form" to save your changes
- Changes are saved to the database immediately with real-time updates

### 4. Share Your Form

1. From your dashboard, find your event card
2. Click the "Copy Link" button
3. Share the link via:
   - Email
   - Social media
   - Messaging apps
   - QR code (generate using any QR code tool)

**The public form link format:**
\`\`\`
https://your-domain.com/f/[unique-slug]
\`\`\`

The slug is extremely long and random, making it virtually impossible to guess.

### 5. View Responses

1. From your dashboard, click "View Responses" on an event card
2. You'll see:
   - Total number of submissions
   - Submission date and time
   - First 3 fields of each response
3. Click the eye icon to see the complete submission
4. Use the search bar to filter responses
5. Click "Export CSV" to download all responses

**Response Management Features:**
- Search through submissions in real-time
- View detailed information for each response
- **Edit Responses**: Click "Edit" to modify participant data
- **Delete Responses**: Click "Delete" to remove a submission (requires confirmation)
- Export data to CSV for analysis
- See submission metadata (date, time, user agent)
- All changes update in real-time across all users

### 6. Edit or Delete Events

**Edit an Event:**
1. Click on the event card or "Edit" button
2. Modify the form fields as needed
3. Click "Save Form"
4. Changes appear instantly on the dashboard

**Delete an Event:**
1. Click the delete button (trash icon) on an event card
2. Confirm the deletion
3. All associated form submissions will also be deleted
4. The event disappears from your dashboard immediately

### 7. Manage Your Account

**Update Profile:**
- Your profile information is stored in the appusers table
- Contact information can be updated in event settings

**Sign Out:**
- Click your profile icon in the header
- Select "Sign Out"

## Security Features

- **Row Level Security (RLS)**: Users can only access their own events and submissions
- **Secure Authentication**: Powered by Supabase Auth with PKCE flow and email verification
- **Password Requirements**: Minimum 6 characters with confirmation and visibility toggle
- **Email Verification**: Required email confirmation for new accounts
- **Secure Form URLs**: Extremely long, random slugs (40+ characters) prevent guessing
- **Input Validation**: Client and server-side validation for all fields
- **SQL Injection Protection**: Parameterized queries via Supabase client
- **XSS Protection**: React's built-in escaping and sanitization
- **CSRF Protection**: Supabase handles CSRF tokens automatically
- **Secure Headers**: Proper security headers configured in Next.js
- **Real-time Subscriptions**: Secure WebSocket connections via Supabase

## Performance Optimizations

- **Server Components**: Reduced JavaScript bundle size
- **Real-time Subscriptions**: Instant updates without polling
- **Optimistic Updates**: Instant UI feedback
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Supabase query caching
- **Code Splitting**: Automatic route-based splitting
- **Framer Motion**: Hardware-accelerated animations
- **Responsive Design**: Mobile-first approach with proper scrolling

## Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add environment variables**
   - In Vercel project settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - For production, update the redirect URL in Supabase:
     - Go to Supabase → Authentication → URL Configuration
     - Add your Vercel domain to "Site URL" and "Redirect URLs"

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted with Docker

## Troubleshooting

### Email Confirmation Issues

If users can't sign in after registration:
- Check if email confirmation is required in Supabase
- Go to Supabase → Authentication → Settings
- Toggle "Enable email confirmations" off for development
- For production, ensure email templates are configured

### Database Errors

If you see 400 Bad Request errors:
- Ensure all SQL scripts have been run in order
- Check that tables exist in Supabase Table Editor
- Verify RLS policies are enabled

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart the development server after adding variables
- Check `.env.local` file is in the root directory
- Verify no typos in variable names

### Slow Performance

- Check your Supabase plan limits
- Optimize queries by adding indexes
- Enable Supabase connection pooling
- Use Vercel Edge Functions for better performance

### Real-time Updates Not Working

- Ensure Supabase Realtime is enabled in your project
- Check browser console for WebSocket errors
- Verify RLS policies allow the operations
- Restart the development server

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
3. Review Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
4. Open an issue on GitHub

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

Built with:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)
