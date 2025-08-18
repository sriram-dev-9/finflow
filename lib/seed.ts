import { supabase } from './supabase'

export async function seedSampleData() {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Sample transactions
  const sampleTransactions = [
    {
      user_id: user.id,
      amount: 5200,
      type: 'income',
      category: 'Salary',
      description: 'Monthly salary payment',
      date: '2024-08-01',
    },
    {
      user_id: user.id,
      amount: 1800,
      type: 'expense',
      category: 'Housing',
      description: 'Monthly rent payment',
      date: '2024-08-01',
    },
    {
      user_id: user.id,
      amount: 450,
      type: 'expense',
      category: 'Food',
      description: 'Grocery shopping',
      date: '2024-08-02',
    },
    {
      user_id: user.id,
      amount: 800,
      type: 'expense',
      category: 'Investment',
      description: '401k contribution',
      date: '2024-08-01',
    },
    {
      user_id: user.id,
      amount: 180,
      type: 'expense',
      category: 'Utilities',
      description: 'Electric bill',
      date: '2024-08-03',
    },
    {
      user_id: user.id,
      amount: 75,
      type: 'expense',
      category: 'Transportation',
      description: 'Gas for car',
      date: '2024-08-04',
    },
    {
      user_id: user.id,
      amount: 120,
      type: 'expense',
      category: 'Entertainment',
      description: 'Movie night',
      date: '2024-08-05',
    },
    {
      user_id: user.id,
      amount: 200,
      type: 'income',
      category: 'Freelance',
      description: 'Side project payment',
      date: '2024-08-06',
    },
    {
      user_id: user.id,
      amount: 350,
      type: 'expense',
      category: 'Food',
      description: 'Restaurant dining',
      date: '2024-08-07',
    },
    {
      user_id: user.id,
      amount: 90,
      type: 'expense',
      category: 'Health',
      description: 'Pharmacy prescription',
      date: '2024-08-08',
    },
  ]

  // Sample account
  const sampleAccount = {
    user_id: user.id,
    name: 'Primary Checking Account',
  }

  try {
    // Insert account
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .insert(sampleAccount)
      .select()
      .single()

    if (accountError) {
      console.error('Error creating account:', accountError)
    }

    // Insert transactions
    const { data: transactions, error: transactionError } = await supabase
      .from('transactions')
      .insert(sampleTransactions)
      .select()

    if (transactionError) {
      console.error('Error creating transactions:', transactionError)
      throw transactionError
    }

    console.log('Sample data seeded successfully!')
    return { account, transactions }
  } catch (error) {
    console.error('Error seeding data:', error)
    throw error
  }
}

export async function clearAllData() {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  try {
    // Delete transactions first (due to foreign key constraints)
    await supabase
      .from('transactions')
      .delete()
      .eq('user_id', user.id)

    // Delete accounts
    await supabase
      .from('accounts')
      .delete()
      .eq('user_id', user.id)

    console.log('All user data cleared successfully!')
  } catch (error) {
    console.error('Error clearing data:', error)
    throw error
  }
}
