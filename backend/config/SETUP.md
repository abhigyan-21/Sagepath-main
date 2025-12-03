# Supabase Setup Guide

## Step 1: Create Tables

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the content from `schema.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Wait for "Success" message

## Step 2: Create Profile Trigger

1. In SQL Editor, create another **New Query**
2. Copy and paste the content from `profile-trigger.sql`
3. Click **Run**
4. This will auto-create profiles when users sign up

## Step 3: Seed Course Data

1. In SQL Editor, create another **New Query**
2. Copy and paste the content from `seed-courses.sql`
3. Click **Run**
4. This adds the 3 main courses (Full-Stack, DSA, AI/ML)

## Step 4: Disable Email Confirmation (Optional - for testing)

1. Go to **Authentication** → **Providers** → **Email**
2. Scroll to "Confirm email"
3. Toggle **OFF** "Enable email confirmations"
4. Click **Save**

Note: For production, keep email confirmation ON!

## Step 5: Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:5173` (for development)
3. Add **Redirect URLs**: `http://localhost:5173/**`
4. Click **Save**

## Verification

Run this query to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- comments
- completed_topics
- courses
- doubts
- friendships
- likes
- luros
- posts
- profiles
- progress
- topics
- trophies

## Troubleshooting

**Error: "relation does not exist"**
- Make sure you ran schema.sql first

**Error: "foreign key constraint"**
- Run profile-trigger.sql to auto-create profiles

**Error: "permission denied"**
- Check RLS policies in schema.sql are applied
