-- Migration to add missing columns to accounts table
-- Run this in your Supabase SQL Editor

-- Add type column with default value
ALTER TABLE public.accounts 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'checking';

-- Add balance column with default value
ALTER TABLE public.accounts 
ADD COLUMN IF NOT EXISTS balance numeric DEFAULT 0;

-- Add constraint to ensure valid account types
ALTER TABLE public.accounts 
ADD CONSTRAINT IF NOT EXISTS check_account_type 
CHECK (type IN ('checking', 'savings', 'credit', 'investment'));

-- Update any existing accounts to have the default type if null
UPDATE public.accounts 
SET type = 'checking' 
WHERE type IS NULL;

-- Update any existing accounts to have 0 balance if null
UPDATE public.accounts 
SET balance = 0 
WHERE balance IS NULL;
