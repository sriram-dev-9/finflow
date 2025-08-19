# Database Setup for FinFlow

## Accounts Table Migration

The accounts functionality requires additional columns that may not be present in your current database schema.

### Quick Setup

1. **Run the test script:**
   ```bash
   node fix-accounts-table.js
   ```

2. **If the script shows that columns are missing, follow these steps:**

   a. Go to your [Supabase Dashboard](https://app.supabase.com)
   
   b. Navigate to **SQL Editor**
   
   c. Copy and paste the contents of `accounts-migration.sql`:
   ```sql
   -- Add type column if it doesn't exist
   ALTER TABLE public.accounts 
   ADD COLUMN IF NOT EXISTS type text DEFAULT 'checking';

   -- Add balance column if it doesn't exist  
   ALTER TABLE public.accounts 
   ADD COLUMN IF NOT EXISTS balance numeric DEFAULT 0;

   -- Add check constraint for account types
   ALTER TABLE public.accounts 
   ADD CONSTRAINT check_account_type 
   CHECK (type IN ('checking', 'savings', 'credit', 'investment'));
   ```
   
   d. Click **Run** to execute the SQL

3. **Test the accounts page:**
   - Start your development server: `npm run dev`
   - Navigate to `/accounts`
   - Try creating a new account

### Manual Verification

You can verify the accounts table structure by running this query in Supabase SQL Editor:
```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'accounts' 
ORDER BY ordinal_position;
```

Expected columns:
- `id` (uuid)
- `user_id` (uuid) 
- `name` (text)
- `type` (text, default: 'checking')
- `balance` (numeric, default: 0)
- `created_at` (timestamp)

## Currency Settings

The app now supports multiple currencies. You can change your preferred currency in the Settings page, and all amounts throughout the app will be formatted accordingly.

Supported currencies:
- USD ($)
- EUR (€)
- GBP (£)
- CAD (C$)
- AUD (A$)
- JPY (¥)
- INR (₹)

### Troubleshooting:

If you see errors about missing columns when using the accounts page:
1. Make sure you've run the migration script
2. Check that the columns exist in your accounts table
3. Refresh the page after running the migration

### Currency Support:

The application now supports multiple currencies. You can change your preferred currency in the Settings page, and all amounts will be displayed in your selected currency throughout the application.
