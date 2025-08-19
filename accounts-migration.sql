-- Fix accounts table by adding missing columns
-- Run this SQL in your Supabase dashboard SQL editor

-- Add type column if it doesn't exist
ALTER TABLE public.accounts 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'checking';

-- Add balance column if it doesn't exist  
ALTER TABLE public.accounts 
ADD COLUMN IF NOT EXISTS balance numeric DEFAULT 0;

-- Add check constraint for account types (this might fail if already exists, that's ok)
ALTER TABLE public.accounts 
ADD CONSTRAINT check_account_type 
CHECK (type IN ('checking', 'savings', 'credit', 'investment'));
