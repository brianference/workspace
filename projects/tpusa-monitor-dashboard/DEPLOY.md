# Deployment guide

## Prerequisites

- Node.js 18+
- A Supabase account
- A Cloudflare account

## 1. Set up Supabase

1. Create a new project at supabase.com
2. Open the SQL editor in the Supabase dashboard
3. Run `supabase/schema.sql` to create the tables
4. Run `supabase/seed.sql` to insert test data
5. Go to Project Settings > API and copy the **Project URL** and **anon public key**

## 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
```

Without these values the app runs in mock data mode.

## 3. Local development

```bash
npm install
npm run dev
```

## 4. Deploy to Cloudflare Pages

1. Push the repo to GitHub
2. Go to Cloudflare Dashboard > Pages > Create a project
3. Connect your GitHub repository
4. Set build configuration:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Add environment variables in Cloudflare Pages settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy

The `public/_redirects` file handles SPA routing so all paths serve `index.html`.

## 5. Verify

After deployment, confirm:
- The feed page loads with sweep data
- Navigation between Feed, History, and Settings works
- The theme toggle switches between dark and light mode
- No console errors in the browser
