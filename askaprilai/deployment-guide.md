# Vercel Automatic Deployment Setup

## Current Status
- ✅ Code is ready and committed to `fresh-start` branch
- ✅ Contact form with Supabase integration is working
- ✅ SEO optimization completed
- ✅ All legal pages created
- ⚠️  Vercel deployment needs configuration

## Steps to Enable Automatic Deployment

### 1. Vercel Dashboard Configuration
1. Go to https://vercel.com/dashboard
2. Navigate to your project: `ask-april-ai-website`
3. Go to **Settings** → **Git**
4. Set **Production Branch** to `fresh-start`
5. Ensure **Automatic Deployments** is enabled

### 2. Alternative: Merge to Main Branch
If you prefer to keep `main` as production branch:
```bash
git checkout main
git merge fresh-start --allow-unrelated-histories
git push origin main
```

### 3. Environment Variables (if needed)
Set these in Vercel Dashboard → Settings → Environment Variables:
- `SUPABASE_URL`: https://gqoykhfrsrfkqpijzmgr.supabase.co
- `SUPABASE_ANON_KEY`: [your-anon-key]

### 4. Domain Configuration
Once deployment is working:
1. Go to **Settings** → **Domains**
2. Add your custom domain: `askapril.ai`
3. Update DNS at GoDaddy to point to Vercel

## What's Ready
- ✅ Working contact form with dual submission (Supabase + Web3Forms)
- ✅ Upload functionality in member workspace
- ✅ Professional legal pages
- ✅ SEO optimization for retail/hospitality
- ✅ Coming soon overlay for premium features
- ✅ Mobile responsive design

## Next Steps After Deployment
1. Test contact form on live site
2. Set up Supabase database tables (run supabase-schema.sql)
3. Test all functionality
4. Point askapril.ai domain to Vercel
5. Launch!