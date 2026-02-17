# 🔧 Signup Error Fix

## Issue: "Could not create user"

This error typically occurs due to one of these reasons:

### 1. **Email Confirmation Required** (Most Common)
Supabase requires email confirmation by default. 

**Solution**: Disable email confirmation for testing:
1. Go to Supabase Dashboard → Authentication → Providers → Email
2. Toggle **"Confirm email"** to OFF
3. Click Save
4. Try signing up again

### 2. **User Already Exists**
If you've tried signing up with the same email before.

**Solution**: Use a different email address or delete the existing user from Supabase Dashboard → Authentication → Users

### 3. **Trigger Function Error**
The profile creation trigger might be failing.

**Solution**: Check Supabase logs:
1. Go to Supabase Dashboard → Logs → Postgres Logs
2. Look for errors related to `handle_new_user` function
3. Check if the `profiles` table exists

### 4. **Password Too Weak**
Supabase requires passwords to be at least 6 characters.

**Solution**: Use a password with at least 6 characters

---

## Quick Fix (Recommended for Development)

**Disable Email Confirmation**:
1. Supabase Dashboard → Authentication → Email Auth
2. **Uncheck** "Confirm email"
3. Save
4. Try signup again

This will allow immediate signup without email verification during development.

---

## Check Server Logs

After trying to signup again, check the terminal where `npm run dev` is running. You should now see a detailed error message like:

```
Signup error: { message: "actual error message here" }
```

Share that error message if the issue persists!

---

## Alternative: Manual User Creation

If signup still fails, you can manually create a user:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter email and password
4. The trigger will automatically create the profile

Then you can login with those credentials.
