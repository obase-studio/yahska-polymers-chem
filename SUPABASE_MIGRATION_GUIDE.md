# Supabase Migration Guide

This guide will help you migrate your SQLite database to Supabase PostgreSQL.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js Dependencies**: Install required packages
3. **Backup**: Create a backup of your current SQLite database

## Step-by-Step Migration Process

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details:
   - Name: `yahska-polymers`
   - Database Password: Choose a strong password
   - Region: Select closest to your users
4. Wait for project creation (2-3 minutes)

### Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon/public key**: For client-side operations
   - **service_role key**: For admin operations (keep secret!)

### Step 3: Install Dependencies

```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```

### Step 4: Set Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.supabase.example .env.local
   ```

2. Fill in your actual Supabase credentials in `.env.local`:
   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key
   ```

### Step 5: Create Database Schema

1. Open Supabase Dashboard → **SQL Editor**
2. Copy the entire contents of `scripts/supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to create all tables, indexes, and policies

### Step 6: Backup Current Database

```bash
# Create backup of current SQLite database
cp admin.db backups/admin-$(date +%Y-%m-%d_%H-%M-%S).db
```

### Step 7: Run Data Migration

1. Set environment variables for the migration script:
   ```bash
   export SUPABASE_URL="https://your-project-ref.supabase.co"
   export SUPABASE_SERVICE_KEY="your-service-key"
   ```

2. Run the migration script:
   ```bash
   node scripts/migrate-to-supabase.js
   ```

3. The script will:
   - Connect to both SQLite and Supabase
   - Migrate data table by table
   - Handle data type conversions
   - Show progress and summary

### Step 8: Update Application Code

1. Replace your existing database imports:
   ```typescript
   // Old SQLite import
   import { dbHelpers } from '@/lib/database'
   
   // New Supabase import
   import { supabase } from '@/lib/supabase'
   ```

2. Update database queries to use Supabase syntax:
   ```typescript
   // Old SQLite
   const products = dbHelpers.getAllProducts()
   
   // New Supabase
   const { data: products } = await supabase
     .from('products')
     .select('*, product_categories(name)')
     .eq('is_active', true)
   ```

### Step 9: Test Migration

1. **Verify Data**: Check Supabase dashboard → **Table Editor** to confirm all data migrated
2. **Test Queries**: Run some test queries to ensure everything works
3. **Check Counts**: Compare record counts between SQLite and Supabase

```bash
# Check SQLite record counts
sqlite3 admin.db "SELECT 'products', COUNT(*) FROM products UNION SELECT 'categories', COUNT(*) FROM product_categories;"

# Check Supabase in dashboard or via API
```

### Step 10: Configure Row Level Security (RLS)

The schema includes basic RLS policies, but you may want to customize them:

1. Go to **Authentication** → **Policies** in Supabase Dashboard
2. Review and modify policies as needed for your security requirements
3. Test with different user roles

## Important Considerations

### Data Type Changes
- **JSON Fields**: SQLite TEXT → PostgreSQL JSONB
- **Boolean Fields**: SQLite INTEGER (0/1) → PostgreSQL BOOLEAN
- **Timestamps**: SQLite TEXT → PostgreSQL TIMESTAMP
- **Auto Increment**: SQLite AUTOINCREMENT → PostgreSQL SERIAL

### Performance Optimizations
- **Indexes**: Created on frequently queried columns
- **JSONB**: Better performance than JSON for complex queries
- **Foreign Keys**: Proper relationships with cascade options

### Security Features
- **Row Level Security**: Enabled on all tables
- **Policies**: Public read access for website content
- **Admin Protection**: Admin-only access for sensitive data

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check Supabase URL and service key
   - Ensure project is active and not paused

2. **Foreign Key Errors**
   - Migration script runs in dependency order
   - Check if category data exists before products

3. **JSON Parsing Errors**
   - Script includes safe JSON parsing with fallbacks
   - Check console for warnings about malformed JSON

4. **Permission Errors**
   - Use service_role key for migration (not anon key)
   - Check RLS policies if queries fail

### Migration Verification Queries

```sql
-- Check total records in each table
SELECT 
  schemaname,
  tablename,
  n_tup_ins as "rows inserted"
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check JSON fields are properly formatted
SELECT id, name, applications, features 
FROM products 
WHERE jsonb_typeof(applications) != 'array'
   OR jsonb_typeof(features) != 'array';
```

## Rollback Plan

If you need to rollback:

1. **Keep SQLite**: Don't delete `admin.db` until fully tested
2. **Environment Variables**: Switch back to SQLite configuration
3. **Code Changes**: Revert application code to use SQLite helpers

## Post-Migration Tasks

1. **Update Deployment**: Update production environment variables
2. **Monitor Performance**: Watch query performance and optimize as needed
3. **Backup Strategy**: Set up regular Supabase backups
4. **Team Access**: Add team members to Supabase project if needed

## Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Community**: [Discord](https://discord.supabase.com/)
- **GitHub Issues**: Report migration script issues

---

**⚠️ Important**: Always test the migration on a development environment first before running on production data!