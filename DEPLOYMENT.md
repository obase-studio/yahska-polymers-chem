# Yahska Polymers - Deployment Guide

## 🚀 Overview

This guide covers deploying the Yahska Polymers website to production environments. The application is built with Next.js 15 and includes a comprehensive admin panel, media management, and content management system.

## 📋 Prerequisites

- **Server Requirements:**
  - Node.js 18+ 
  - 2GB RAM minimum (4GB recommended)
  - 10GB storage space
  - Linux/Unix environment (Ubuntu 20.04+ recommended)

- **Domain & SSL:**
  - Registered domain name
  - SSL certificate (Let's Encrypt recommended)
  - DNS access for configuration

## 🏗️ Deployment Options

### Option 1: Traditional Server Deployment

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. Application Deployment
```bash
# Clone repository
git clone https://github.com/obasevaibhav-beep/yahska-polymers-chem.git
cd yahska-polymers-chem

# Install dependencies
npm ci --only=production

# Build application
NODE_ENV=production npm run build

# Start with PM2
pm2 start npm --name "yahska-polymers" -- start
pm2 save
pm2 startup
```

#### 3. Nginx Configuration
```bash
# Copy Nginx config
sudo cp nginx.conf /etc/nginx/sites-available/yahska-polymers
sudo ln -s /etc/nginx/sites-available/yahska-polymers /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. SSL Setup
```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Option 2: Docker Deployment

#### 1. Install Docker
```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Deploy with Docker
```bash
# Clone and deploy
git clone https://github.com/obasevaibhav-beep/yahska-polymers-chem.git
cd yahska-polymers-chem

# Set environment variables
cp env.example .env
# Edit .env with your production values

# Build and start
docker-compose up -d --build
```

### Option 3: Cloud Platform Deployment

#### Vercel (Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build locally
npm run build

# Deploy to Netlify
# Upload the .next folder to Netlify
```

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL=./admin.db

# Security
NEXTAUTH_SECRET=your-very-long-random-secret-key
NEXTAUTH_URL=https://yourdomain.com

# Production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Media
MEDIA_UPLOAD_PATH=./public/media
MAX_FILE_SIZE=10485760
```

### Generate Secure Secrets
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate random admin password
openssl rand -base64 12
```

## 🗄️ Database Setup

### SQLite (Default)
- Ensure `admin.db` file is accessible
- Set proper file permissions: `chmod 644 admin.db`
- Regular backups recommended

### External Database (Optional)
- PostgreSQL or MySQL for high-traffic sites
- Update database connection in `lib/database.ts`
- Configure connection pooling

## 🔒 Security Configuration

### Admin Panel Security
```bash
# Change default admin credentials
# Access admin panel and update password
# Or modify database directly:
sqlite3 admin.db "UPDATE admin_users SET password='new-hashed-password' WHERE username='admin';"
```

### Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Rate Limiting
- Nginx rate limiting configured in `nginx.conf`
- API endpoints: 10 requests/second
- Admin panel: 5 requests/second

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check application health
curl https://yourdomain.com/api/health

# Monitor logs
pm2 logs yahska-polymers
sudo journalctl -u nginx -f
```

### Backup Strategy
```bash
# Database backup
cp admin.db backups/admin-$(date +%Y%m%d).db

# Media backup
tar -czf backups/media-$(date +%Y%m%d).tar.gz public/media/

# Automated backup script
chmod +x scripts/backup.sh
./scripts/backup.sh
```

### Performance Monitoring
- Enable Next.js analytics
- Monitor server resources
- Set up uptime monitoring (UptimeRobot, Pingdom)

## 🚨 Troubleshooting

### Common Issues

#### Application won't start
```bash
# Check logs
pm2 logs yahska-polymers

# Check port availability
sudo netstat -tlnp | grep :3000

# Restart application
pm2 restart yahska-polymers
```

#### Database errors
```bash
# Check file permissions
ls -la admin.db

# Verify database integrity
sqlite3 admin.db "PRAGMA integrity_check;"

# Restore from backup if needed
cp backups/admin-YYYYMMDD.db admin.db
```

#### Nginx issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

## 📈 Scaling Considerations

### Vertical Scaling
- Increase server RAM and CPU
- Optimize database queries
- Enable caching (Redis)

### Horizontal Scaling
- Load balancer setup
- Multiple application instances
- Database replication

### CDN Integration
- Cloudflare for static assets
- AWS CloudFront or similar
- Media file optimization

## 🔄 Update Process

### Application Updates
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm ci --only=production

# Build application
NODE_ENV=production npm run build

# Restart application
pm2 restart yahska-polymers
```

### Database Migrations
- Backup database before updates
- Run migration scripts if available
- Test in staging environment first

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment configuration
3. Test health endpoints
4. Review security settings

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [PM2 Process Management](https://pm2.keymetrics.io/docs/)
- [Let's Encrypt SSL Setup](https://letsencrypt.org/getting-started/)
