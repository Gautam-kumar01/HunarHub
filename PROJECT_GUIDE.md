# 🚀 HunarHub - Complete Project Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features Implemented](#features-implemented)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)
7. [User Flows](#user-flows)
8. [API Routes](#api-routes)
9. [Deployment](#deployment)
10. [Testing Guide](#testing-guide)

---

## 🎯 Project Overview

**HunarHub** is a skill-based student social networking platform that connects students with recruiters through verified projects and portfolios. Unlike traditional job boards, HunarHub emphasizes **proof of work** over credentials.

### Core Value Proposition
- **For Students**: Showcase real projects, earn skill badges, apply to internships
- **For Recruiters**: Discover talent based on actual work, not just resumes

---

## ✅ Features Implemented

### 🔐 Authentication & Authorization
- [x] Email/Password signup with role selection (Student/Recruiter)
- [x] Email verification flow
- [x] Secure login with session management
- [x] Protected routes via middleware
- [x] Row Level Security (RLS) policies

### 👤 User Profiles
- [x] Profile creation on signup (automatic trigger)
- [x] Profile editing (name, bio, headline, skills)
- [x] Public profile view for students
- [x] Avatar support

### 📂 Project Management (Students)
- [x] Upload projects with:
  - Title, description
  - Cover image (Supabase Storage)
  - GitHub & demo links
  - Tags/skills
- [x] View own projects in profile
- [x] Public project showcase on Explore page

### 💼 Internship Posting (Recruiters)
- [x] Post internship opportunities with:
  - Job title, company name
  - Location & job type (Full-time/Part-time/Remote)
  - Salary range
  - Requirements list
- [x] View all posted jobs
- [x] Manage applications

### 🔍 Discovery & Search
- [x] **Explore Page**: Browse all student projects
- [x] **Internships Board**: View open positions
- [x] Search functionality for projects and jobs
- [x] Filter by skills/tags

### 📝 Application System
- [x] Students can apply to internships with:
  - Resume/portfolio link
  - Cover letter
- [x] Recruiters can:
  - View all applications
  - Update application status (Pending/Interview/Accepted/Rejected)
- [x] Students can track application status

### 📊 Dashboard
- [x] Role-based dashboard layout
- [x] **Student Dashboard**:
  - Total projects count
  - Active applications count
  - Quick actions (Upload Project, Browse Jobs)
- [x] **Recruiter Dashboard**:
  - Active jobs count
  - Total applications count
  - Quick actions (Post Job, View Candidates)

### 🔔 Notifications
- [x] Notifications page
- [x] Database schema for notifications
- [x] UI for viewing notifications

### ⚙️ Settings
- [x] Account information display
- [x] Email preferences
- [x] Profile visibility toggle
- [x] Dark mode toggle (UI ready)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Tailwind

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js Server Actions & Route Handlers

### Infrastructure
- **Hosting**: Vercel (recommended)
- **Database Hosting**: Supabase Cloud
- **File Storage**: Supabase Storage

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### 1. Clone & Install
```bash
cd web
npm install
```

### 2. Environment Setup
Create `.env.local` in the `web` directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://jsrsjokrlfdjuejbnyoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Database Setup
1. Go to Supabase Dashboard → SQL Editor
2. Run the `schema.sql` file from the project root
3. Create Storage Bucket:
   - Go to Storage → Create Bucket
   - Name: `project-assets`
   - Make it **Public**
4. Apply Storage Policies (see `storage_policies.sql`)

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
web/
├── app/
│   ├── (auth)/
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   └── auth/
│   │       ├── callback/       # Email verification callback
│   │       ├── signout/        # Logout route
│   │       └── actions.ts      # Auth server actions
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── profile/            # Profile management
│   │   ├── projects/
│   │   │   └── create/         # Upload project
│   │   ├── post-job/           # Post internship (recruiters)
│   │   ├── applications/       # Applications management
│   │   ├── notifications/      # Notifications page
│   │   └── settings/           # Settings page
│   ├── explore/                # Browse projects
│   ├── internships/
│   │   ├── page.tsx            # Internships board
│   │   └── [id]/               # Job detail & apply
│   ├── profile/
│   │   └── [id]/               # Public profile view
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   └── SearchBar.tsx           # Reusable search component
├── utils/
│   └── supabase/
│       ├── client.ts           # Client-side Supabase
│       ├── server.ts           # Server-side Supabase
│       └── middleware.ts       # Session refresh utility
├── middleware.ts               # Next.js middleware
└── package.json
```

---

## 🗄️ Database Schema

### Tables

#### `profiles`
- User profile information
- Links to `auth.users`
- Fields: `full_name`, `email`, `role`, `bio`, `headline`, `skills`, `avatar_url`

#### `projects`
- Student projects
- Fields: `title`, `description`, `cover_image_url`, `demo_link`, `github_link`, `tags`, `likes_count`

#### `internships`
- Job postings by recruiters
- Fields: `title`, `company_name`, `location`, `type`, `salary_range`, `requirements`, `status`

#### `applications`
- Student applications to internships
- Fields: `student_id`, `internship_id`, `cover_letter`, `resume_url`, `status`

#### `notifications`
- User notifications
- Fields: `user_id`, `type`, `title`, `message`, `read`

#### `messages` (Schema ready, UI pending)
- Direct messaging between users

### RLS Policies
All tables have Row Level Security enabled:
- Users can only view/edit their own data
- Public read access for projects and open internships
- Recruiters can manage their own job postings

---

## 👥 User Flows

### Student Flow
1. **Signup** → Email verification → Dashboard
2. **Upload Project** → Add details & image → Submit
3. **Browse Jobs** → Search internships → View details
4. **Apply** → Submit resume & cover letter
5. **Track Applications** → View status updates

### Recruiter Flow
1. **Signup** → Email verification → Dashboard
2. **Post Job** → Add requirements → Publish
3. **View Candidates** → Review applications
4. **Update Status** → Accept/Reject/Interview
5. **Browse Talent** → Explore student projects

---

## 🔌 API Routes

### Server Actions
- `app/auth/actions.ts`: `login()`, `signup()`
- `app/dashboard/projects/actions.ts`: `createProject()`
- `app/dashboard/post-job/actions.ts`: `createInternship()`
- `app/dashboard/applications/actions.ts`: `updateApplicationStatus()`
- `app/dashboard/profile/actions.ts`: `updateProfile()`

### Route Handlers
- `app/auth/callback/route.ts`: Email verification
- `app/auth/signout/route.ts`: User logout

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Root directory: `web`

3. **Add Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `your-app.vercel.app`

### Post-Deployment
1. Update Supabase Auth settings:
   - Go to Authentication → URL Configuration
   - Add your Vercel URL to allowed redirect URLs

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### Authentication
- [ ] Signup as Student
- [ ] Signup as Recruiter
- [ ] Email verification works
- [ ] Login with correct credentials
- [ ] Login fails with wrong password
- [ ] Logout works

#### Student Features
- [ ] Upload project with image
- [ ] View own projects in profile
- [ ] Edit profile information
- [ ] Browse projects on Explore page
- [ ] Search for projects
- [ ] Apply to internship
- [ ] View application status

#### Recruiter Features
- [ ] Post new internship
- [ ] View posted jobs
- [ ] See applications for jobs
- [ ] Update application status
- [ ] Browse student projects

#### General
- [ ] Dark mode toggle
- [ ] Responsive design on mobile
- [ ] Navigation works correctly
- [ ] Search functionality
- [ ] Public profile view

---

## 📝 Next Steps (Optional Enhancements)

### Phase 2 Features
- [ ] Real-time messaging system
- [ ] Skill verification badges
- [ ] Peer reviews for projects
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Project likes/comments
- [ ] Recruiter company profiles

### Technical Improvements
- [ ] Add unit tests (Jest/Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Implement caching (Redis)
- [ ] Add rate limiting
- [ ] SEO optimization
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Failed to fetch" errors
- **Solution**: Check if Supabase URL and keys are correct in `.env.local`

**Issue**: Image upload fails
- **Solution**: Ensure `project-assets` bucket exists and is public with correct RLS policies

**Issue**: Email verification not working
- **Solution**: Check Supabase Auth settings and email templates

**Issue**: Build fails on Vercel
- **Solution**: Ensure root directory is set to `web` in Vercel settings

---

## 📞 Support

For issues or questions:
- Check the [Supabase Docs](https://supabase.com/docs)
- Check the [Next.js Docs](https://nextjs.org/docs)
- Review the `HUNARHUB_BLUEPRINT.md` for architecture details

---

## 📄 License

This project is built for educational purposes.

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
