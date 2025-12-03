# Sagepath Backend (Supabase)

Backend API for Sagepath learning platform using Supabase.

## Setup

### 1. Create Supabase Project
- Go to https://supabase.com
- Create a new project (free tier available)
- Wait for database to initialize (~2 minutes)

### 2. Setup Database Schema
- In Supabase dashboard, go to SQL Editor
- Copy contents from `config/schema.sql`
- Run the SQL to create all tables

### 3. Get API Keys
- Go to Project Settings > API
- Copy your project URL and keys

### 4. Install Dependencies
```bash
cd backend
npm install
```

### 5. Configure Environment
```bash
copy .env.example .env
```

Edit `.env` with your Supabase credentials:
- SUPABASE_URL
- SUPABASE_ANON_KEY  
- SUPABASE_SERVICE_KEY

### 6. Start Server
```bash
npm run dev
```

Server runs on http://localhost:5000

## API Endpoints

Same as before - all routes work with Supabase now!

## Storage Setup (Optional)
For user uploads (profile images, project images):
1. Go to Storage in Supabase dashboard
2. Create buckets: `avatars`, `projects`
3. Set policies for public access
