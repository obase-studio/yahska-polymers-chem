# Yahska Polymers - Simple Deployment Guide

## 🚀 Quick Deploy (5 minutes)

### Option 1: Vercel (Recommended - Fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (one command)
vercel --prod
```

### Option 2: Netlify
```bash
# Build locally
npm run build

# Upload the 'out' folder to Netlify
# Or connect your GitHub repo for auto-deploy
```

### Option 3: Any Static Hosting
```bash
# Build
npm run build

# Upload the 'out' folder to any web hosting service
```

## 🏗️ What Happens When You Build

1. **Build Command**: `npm run build`
2. **Output**: Creates `out/` folder with static files
3. **Deploy**: Upload `out/` folder anywhere

## 📁 What Gets Built

- ✅ Static HTML pages
- ✅ CSS and JavaScript bundles  
- ✅ Images and media files
- ✅ Database (SQLite file)
- ✅ Admin panel (static)

## 🔧 Simple Configuration

### Environment Variables (Optional)
```bash
# Only if you need to customize
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Database
- SQLite file (`admin.db`) gets included in build
- No external database setup needed
- Admin login: `admin/admin`

## 🚀 Deploy Steps

1. **Build**: `npm run build`
2. **Upload**: Copy `out/` folder to your hosting
3. **Done**: Website is live!

## 🌐 Hosting Options

- **Vercel**: Best for Next.js, automatic deployments
- **Netlify**: Great for static sites, easy setup
- **GitHub Pages**: Free, simple
- **Any web hosting**: Upload files to public_html folder

## 📱 After Deployment

1. **Test**: Visit your website
2. **Admin**: Go to `/admin` and login
3. **Content**: Update content through admin panel
4. **Media**: Upload images and files

## 🔄 Updates

1. **Make changes** to your code
2. **Build again**: `npm run build`
3. **Upload new files** to hosting
4. **Done** in minutes!

## 💡 Keep It Simple

- No Docker complexity
- No server configuration
- No complex security setup
- Just build and upload!

Your website is now ready for simple, fast deployment! 🎉
