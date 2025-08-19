-- Create the accounts table
CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text DEFAULT 'checking' CHECK (type IN ('checking', 'savings', 'credit', 'investment')),
  balance numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security for accounts
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Policy for accounts: Allow users to read their own accounts
CREATE POLICY "Users can view their own accounts."
ON public.accounts FOR SELECT
USING (auth.uid() = user_id);

-- Policy for accounts: Allow users to insert their own accounts
CREATE POLICY "Users can create their own accounts."
ON public.accounts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for accounts: Allow users to update their own accounts
CREATE POLICY "Users can update their own accounts."
ON public.accounts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for accounts: Allow users to delete their own accounts
CREATE POLICY "Users can delete their own accounts."
ON public.accounts FOR DELETE
USING (auth.uid() = user_id);

-- Create the transactions table
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL, -- e.g., 'income', 'expense'
  category text NOT NULL,
  description text,
  date date NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL, -- Optional: can be null if no account is linked
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy for transactions: Allow users to read their own transactions
CREATE POLICY "Users can view their own transactions."
ON public.transactions FOR SELECT
USING (auth.uid() = user_id);

-- Policy for transactions: Allow users to insert their own transactions
CREATE POLICY "Users can create their own transactions."
ON public.transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for transactions: Allow users to update their own transactions
CREATE POLICY "Users can update their own transactions."
ON public.transactions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for transactions: Allow users to delete their own transactions
CREATE POLICY "Users can delete their own transactions."
ON public.transactions FOR DELETE
USING (auth.uid() = user_id);
