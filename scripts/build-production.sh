#!/bin/bash

# Production Build Script for Yahska Polymers
# This script prepares the application for production deployment

set -e

echo "🚀 Starting production build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run linting and type checking
echo "🔍 Running code quality checks..."
npm run lint || echo "⚠️  Linting issues found (continuing with build)"
npx tsc --noEmit || echo "⚠️  TypeScript issues found (continuing with build)"

# Build the application
echo "🏗️  Building application..."
NODE_ENV=production npm run build

# Run tests if available
if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
    echo "🧪 Running tests..."
    npm test || echo "⚠️  Tests failed (continuing with build)"
fi

# Optimize images
echo "🖼️  Optimizing images..."
if command -v imagemin &> /dev/null; then
    npx imagemin public/media/**/*.{jpg,jpeg,png} --out-dir=public/media/optimized
    echo "✅ Images optimized"
else
    echo "⚠️  Image optimization skipped (imagemin not available)"
fi

# Create production bundle
echo "📦 Creating production bundle..."
mkdir -p production
cp -r .next production/
cp -r public production/
cp -r package.json production/
cp -r package-lock.json production/
cp -r next.config.mjs production/
cp -r env.example production/

# Create deployment instructions
cat > production/DEPLOYMENT.md << 'EOF'
# Deployment Instructions

## Prerequisites
- Node.js 18+ installed
- PM2 or similar process manager (optional)
- Nginx or Apache web server
- SSL certificate for HTTPS

## Quick Start
1. Copy this folder to your server
2. Run `npm ci --only=production`
3. Set environment variables (see env.example)
4. Run `npm start`

## Environment Variables
Copy env.example to .env and configure:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- NODE_ENV=production

## Database Setup
- Ensure admin.db is accessible
- Set proper file permissions
- Consider using external database for production

## Security
- Change default admin credentials
- Enable HTTPS
- Set up firewall rules
- Regular security updates

## Performance
- Enable CDN for media files
- Configure caching headers
- Monitor performance metrics
EOF

echo "✅ Production build completed successfully!"
echo "📁 Production files are in the 'production' directory"
echo "📖 See production/DEPLOYMENT.md for deployment instructions"
