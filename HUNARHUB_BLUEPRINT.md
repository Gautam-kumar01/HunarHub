# HunarHub: Startup Blueprint & Technical Architecture

**Version:** 1.0.0  
**Date:** 2026-02-16  
**Status:** Approved for Development  
**Architect:** Antigravity  

---

## 1. Core Product Structure

### 1.1 Product Vision
**HunarHub** bridges the gap between academic learning and professional employability. It is a meritocratic ecosystem where students are evaluated on *skills* and *proof of work* (projects) rather than just university prestige. We empower students to showcase "Hunar" (Talent), earn recognition, and land high-quality internships.

### 1.2 Target Audience & Personas
*   **Student (The Talent):** High school or university students looking to build a portfolio, find internships, and connect with like-minded peers.
    *   *Need:* Visibility, validation of skills, real-world opportunities.
*   **Recruiter (The Opportunity):** Early-stage startups and SMEs looking for skilled interns without sifting through hundreds of irrelevant resumes.
    *   *Need:* Verified skills, portfolio access, streamlined hiring pipeline.
*   **Administrator (The Governor):** Platform managers ensuring content quality, user safety, and dispute resolution.

### 1.3 Unique Value Proposition (UVP)
*   **Project-First Identity:** Profiles revolve around verifyable projects, not just claimed skills.
*   **Verified Skill Badges:** System-awarded badges based on project validation or peer reviews.
*   **Direct Application Integration:** Seamless "One-Click Apply" with auto-generated project portfolios.

### 1.4 Feature Breakdown
**MVP (Phase 1):**
*   User Auth (Student/Recruiter).
*   Profile Creation (Bio, Skills, Education).
*   Project Upload (Images, Description, Links).
*   Internship Posting & Application System.
*   Basic Dashboard (Application Tracking).

**Advanced (Phase 2):**
*   Skill-based Assessment Badges.
*   Real-time Messaging & Notifications.
*   "Trending" Projects Algorithm.
*   Premium Subscriptions & Verified Status.
*   Recruiter Analytics Dashboard.

---

## 2. User Roles & Permissions

| Role | Capabilities |
| :--- | :--- |
| **Student** | • Create/Edit Profile<br>• Upload Projects<br>• Browes & Apply for Internships<br>• Chat with Recruiters (if initiated)<br>• Like/Comment on Projects |
| **Recruiter** | • Create Company Profile<br>• Post Internships<br>• View Applicants<br>• Intiatiate Chat with Applicants<br>• Manage Application Status |
| **Admin** | • Global Content Moderation<br>• User Management (Ban/Suspend)<br>• Analytics Dashboard<br>• Verify Organization Status |

---

## 3. Authentication System

**Provider:** Supabase Auth  
**Strategy:** Email/Password + Social Login (Google/GitHub).

### 3.1 Role-Based Access Control (RBAC)
*   **Metadata:** User roles (`student`, `recruiter`, `admin`) are stored in `auth.users` metadata and synced to a public `profiles` table via triggers.
*   **Session:** JWTs (JSON Web Tokens) persist session state; RLS policies read the `role` claim from the JWT.

### 3.2 Flows
*   **Sign Up:** User selects role -> Email Verification -> Profile Completion Wizard.
*   **Protected Routes:** Middleware checks for valid session + required role before rendering `/dashboard`, `/upload`, etc.

---

## 4. Database Design (Supabase PostgreSQL)

### 4.1 Schema Overview

#### `users` (Managed by Supabase Auth)
*   `id`: UUID (PK)
*   `email`: String
*   `raw_user_meta_data`: JSONB (contains `role`, `full_name`)

#### `profiles`
*   `id`: UUID (PK, FK -> auth.users.id)
*   `role`: Enum ('student', 'recruiter', 'admin')
*   `full_name`: Text
*   `avatar_url`: Text
*   `headline`: Text
*   `bio`: Text
*   `skills`: Text[] (Array of strings)
*   `education`: JSONB
*   `company_details`: JSONB (For recruiters)
*   `created_at`: Timestamptz

#### `projects`
*   `id`: UUID (PK)
*   `user_id`: UUID (FK -> profiles.id)
*   `title`: Text
*   `description`: Text
*   `cover_image_url`: Text
*   `tags`: Text[]
*   `demo_link`: Text
*   `github_link`: Text
*   `likes_count`: Integer (Default 0)
*   `created_at`: Timestamptz

#### `internships`
*   `id`: UUID (PK)
*   `recruiter_id`: UUID (FK -> profiles.id)
*   `title`: Text
*   `company_name`: Text
*   `location`: Text
*   `type`: Enum ('Full-time', 'Part-time', 'Remote')
*   `salary_range`: Text
*   `requirements`: Text[]
*   `status`: Enum ('Open', 'Closed')
*   `created_at`: Timestamptz

#### `applications`
*   `id`: UUID (PK)
*   `internship_id`: UUID (FK -> internships.id)
*   `student_id`: UUID (FK -> profiles.id)
*   `cover_letter`: Text
*   `resume_url`: Text
*   `status`: Enum ('pending', 'interviewing', 'accepted', 'rejected')
*   `created_at`: Timestamptz

#### `messages`
*   `id`: UUID (PK)
*   `sender_id`: UUID (FK -> profiles.id)
*   `receiver_id`: UUID (FK -> profiles.id)
*   `content`: Text
*   `attachment_url`: Text
*   `is_read`: Boolean
*   `created_at`: Timestamptz

#### `notifications`
*   `id`: UUID (PK)
*   `user_id`: UUID (FK -> profiles.id)
*   `type`: Enum ('application_update', 'new_message', 'project_like', 'follow')
*   `reference_id`: UUID (can link to project_id or application_id)
*   `content`: Text
*   `is_read`: Boolean
*   `created_at`: Timestamptz

#### `badges` & `user_badges`
*   Standard Many-to-Many relationship customization.

#### `follows`
*   `follower_id`: UUID (FK)
*   `following_id`: UUID (FK)

---

## 5. Internship Application System

### 5.1 The "Apply" Flow
1.  **Trigger:** Student clicks "Apply via HunarHub" on an Internship card.
2.  **Modal:** Pre-filled form appears (User's Resume from storage, Cover Letter input).
3.  **Submission:**
    *   Insert record into `applications`.
    *   **Realtime:** Trigger Supabase Realtime event to Recruiter's dashboard channel.
    *   **Email:** Edge Function sends email via Resend/SendGrid to Recruiter.
4.  **Tracking:** Student sees "Applied" status on the internship card.

### 5.2 Dashboards
*   **Recruiter:** Kanban board style (Pending -> Reviewing -> Rejected/Accepted).
*   **Student:** List view of active applications with status tags.

---

## 6. Row Level Security (RLS) Policies

**Security is paramount. Default: Deny All.**

*   `profiles`:
    *   `SELECT`: Public.
    *   `UPDATE`: `auth.uid() = id`.
*   `projects`:
    *   `SELECT`: Public.
    *   `INSERT/UPDATE/DELETE`: `auth.uid() = user_id`.
*   `internships`:
    *   `SELECT`: Public.
    *   `INSERT/UPDATE`: `auth.uid() = recruiter_id` AND `profiles.role = 'recruiter'`.
*   `applications`:
    *   `INSERT`: `auth.uid() = student_id` AND `profiles.role = 'student'`.
    *   `SELECT`: `auth.uid() = student_id` (Student) OR `auth.uid() = (SELECT recruiter_id FROM internships WHERE id = internship_id)` (Recruiter).

---

## 7. Project System & Algorithm

*   **Posting:** Rich text editor for description, drag-and-drop for images.
*   **Social:**
    *   **Like:** Toggle logic updates `likes_count` (optimistic UI) and inserts into `project_likes` table.
    *   **Comment:** standard relation table.
*   **Trending Algorithm (Edge Function/Cron):**
    *   Score = `(Likes * 1) + (Comments * 2) + (Save * 3)`.
    *   Decay factor applied essentially based on `created_at`.
    *   Top scoring projects displayed on "Explore" feed.

---

## 8. Notification System

*   **Architecture:**
    *   **Database Triggers:** PostgreSQL Triggers on `insert` for tables like `likes`, `comments`, `applications`.
    *   **Supabase Realtime:** Client subscribes to `notifications:user_id` channel.
    *   **Toast UI:** Immediate visual feedback when event is received.
*   **Types:**
    *   `application_status`: "Your application for [Role] was Viewed."
    *   `social`: "[User] commented on your project."

---

## 9. Messaging System

*   **Structure:** 1-to-1 conversations.
*   **Initialization:**
    *   Recruiters can message any applicant.
    *   Students can only message Recruiters if they have an *active* application or the Recruiter messaged first (Privacy guard).
*   **Realtime:** Supabase `subscribe()` to `messages` table where `receiver_id = current_user`.

---

## 10. File Storage (Supabase Storage)

**Buckets:**
1.  `avatars`: Public read, Auth-only upload/update.
2.  `project-assets`: Public read, Auth-only upload.
3.  `resumes`: Private. Authenticated URL required. Policy: Owner can read/write; Recruiter can read if application exists.

---

## 11. Homepage & Marketing Content

**Hero Section:**
*   *Headline:* "Showcase Your Hunar. Get Hired."
*   *Subhead:* "The ultimate platform for students to build portfolios, earn badges, and connect with top recruiters."
*   *CTAs:* "Join as Student" (Primary), "Hire Talent" (Secondary).

**Trust Indicators:**
*   "Trusted by 500+ Startups"
*   Carousel of university partners.

---

## 12. UI Sitemap

**Public:**
*   `/` (Landing)
*   `/explore` (Project Feed)
*   `/internships` (Job Board)
*   `/login` / `/signup`

**Student Protected:**
*   `/dashboard` (Stats & App Status)
*   `/profile/me` (Edit Portfolio)
*   `/projects/create`
*   `/messages`

**Recruiter Protected:**
*   `/recruiter/dashboard` (Applicant Pipeline)
*   `/recruiter/post-job`
*   `/recruiter/company-profile`

---

## 13. Monetization Model

1.  **Freemium Student:** Free portfolio. Paid "Pro" tier for 'Verified Badge', 'Dark Mode Profile Themes', and 'Top of Applicant List' visibility.
2.  **Recruiter Model:**
    *   Free: 1 Active Job Post.
    *   Premium: Unlimited Posts + Advanced Filtering.
3.  **Partnerships:** B2B integration with Colleges for "Campus Placement Portals".

---

## 14. Deployment Architecture

*   **Frontend:** Vercel (Next.js App Router).
    *   Auto-deploy on Git push.
    *   Edge Network for fast static delivery.
*   **Backend:** Supabase (Managed PostgreSQL).
*   **Environment Variables:**
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `SUPABASE_SERVICE_ROLE_KEY` (Server-side only)

---

## 15. Scaling Strategy

*   **Database:**
    *   Add Indexes on foreign keys (`user_id`, `internship_id`) and frequently filtered columns (`status`, `tags`).
    *   Use JSONB for flexible schema (e.g., `education` fields) to reduce table joins.
*   **Caching:**
    *   Use strictly static generation (SSG) for Marketing pages.
    *   Implement ISR (Incremental Static Regeneration) for Project feeds.
    *   React Query / SWR for client-side state caching.
