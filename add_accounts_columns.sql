-- Add missing columns to accounts table
ALTER TABLE public.accounts 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'checking',
ADD COLUMN IF NOT EXISTS balance numeric DEFAULT 0;

-- Add check constraint for account types
ALTER TABLE public.accounts 
ADD CONSTRAINT check_account_type 
CHECK (type IN ('checking', 'savings', 'credit', 'investment'));
