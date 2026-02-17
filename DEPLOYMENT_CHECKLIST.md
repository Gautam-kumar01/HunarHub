# 🚀 HunarHub Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Database Setup
- [ ] Supabase project created
- [ ] `schema.sql` executed in SQL Editor
- [ ] All tables created successfully
- [ ] RLS policies enabled and working
- [ ] Storage bucket `project-assets` created
- [ ] Storage bucket set to **Public**
- [ ] Storage policies applied (from `storage_policies.sql`)

### 2. Environment Variables
- [ ] `.env.local` file created in `web/` directory
- [ ] `NEXT_PUBLIC_SUPABASE_URL` added
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` added
- [ ] Variables tested locally

### 3. Local Testing
- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts successfully
- [ ] Can signup as Student
- [ ] Can signup as Recruiter
- [ ] Email verification works
- [ ] Can upload project with image
- [ ] Can post internship
- [ ] Can apply to job
- [ ] All pages load without errors

---

## 🌐 Vercel Deployment

### Step 1: Prepare Repository
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial HunarHub deployment"

# Push to GitHub
git remote add origin your-github-repo-url
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. **Important**: Set Root Directory to `web`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://jsrsjokrlfdjuejbnyoo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   ```
6. Click "Deploy"

### Step 3: Post-Deployment Configuration
1. **Update Supabase Auth URLs**:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL to:
     - Site URL: `https://your-app.vercel.app`
     - Redirect URLs: `https://your-app.vercel.app/auth/callback`

2. **Test Production**:
   - [ ] Visit your Vercel URL
   - [ ] Test signup flow
   - [ ] Test login
   - [ ] Test image upload
   - [ ] Test all major features

---

## 🔧 Post-Deployment Tasks

### Immediate
- [ ] Test all authentication flows
- [ ] Verify image uploads work
- [ ] Check all pages render correctly
- [ ] Test mobile responsiveness
- [ ] Verify email notifications

### Within 24 Hours
- [ ] Monitor error logs in Vercel
- [ ] Check Supabase usage metrics
- [ ] Test with real users
- [ ] Gather initial feedback

### Within 1 Week
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (Google Analytics, Vercel Analytics)
- [ ] Set up error tracking (Sentry)
- [ ] Create backup strategy

---

## 🐛 Common Deployment Issues

### Issue: Build Fails
**Symptoms**: Vercel build fails with errors
**Solutions**:
1. Ensure root directory is set to `web`
2. Check for TypeScript errors locally: `npm run build`
3. Verify all dependencies are in `package.json`

### Issue: Environment Variables Not Working
**Symptoms**: "Invalid Supabase URL" or auth errors
**Solutions**:
1. Ensure variables start with `NEXT_PUBLIC_`
2. Redeploy after adding variables
3. Check for typos in variable names

### Issue: Images Not Uploading
**Symptoms**: Upload fails or images don't display
**Solutions**:
1. Verify storage bucket is public
2. Check storage policies are applied
3. Ensure bucket name matches code (`project-assets`)

### Issue: Email Verification Not Working
**Symptoms**: Users don't receive verification emails
**Solutions**:
1. Check Supabase email templates
2. Verify redirect URLs in Supabase settings
3. Check spam folder
4. Ensure production URL is whitelisted

---

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Check Vercel deployment status
- [ ] Monitor error logs
- [ ] Check Supabase database size

### Weekly Checks
- [ ] Review user feedback
- [ ] Check performance metrics
- [ ] Update dependencies if needed
- [ ] Backup database

### Monthly Checks
- [ ] Review Supabase usage and costs
- [ ] Analyze user growth
- [ ] Plan feature updates
- [ ] Security audit

---

## 🔐 Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Environment variables not committed to Git
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Email verification required for signup
- [ ] Storage bucket has proper access policies
- [ ] No sensitive data in client-side code

---

## 📈 Performance Optimization

### Before Launch
- [ ] Enable Vercel Analytics
- [ ] Optimize images (use Next.js Image component)
- [ ] Enable caching where appropriate
- [ ] Minimize bundle size

### After Launch
- [ ] Monitor Core Web Vitals
- [ ] Optimize slow queries
- [ ] Add database indexes if needed
- [ ] Consider CDN for static assets

---

## 🎉 Launch Checklist

### Pre-Launch
- [ ] All features tested
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Mobile responsive
- [ ] Dark mode working
- [ ] SEO meta tags added

### Launch Day
- [ ] Deploy to production
- [ ] Announce on social media
- [ ] Monitor for issues
- [ ] Be ready for support requests

### Post-Launch
- [ ] Gather user feedback
- [ ] Fix critical bugs immediately
- [ ] Plan next iteration
- [ ] Celebrate! 🎊

---

## 📞 Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Next.js Docs**: https://nextjs.org/docs

---

## 🔄 Rollback Plan

If something goes wrong:

1. **Vercel Rollback**:
   - Go to Vercel Dashboard → Deployments
   - Find last working deployment
   - Click "Promote to Production"

2. **Database Rollback**:
   - Restore from Supabase backup
   - Or revert specific migrations

3. **Communication**:
   - Notify users of downtime
   - Provide status updates
   - Document the issue

---

**Remember**: Test everything locally before deploying! 🚀

Good luck with your deployment! 🎉
