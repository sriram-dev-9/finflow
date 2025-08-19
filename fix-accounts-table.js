const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Read environment variables from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Using key type:', envVars.SUPABASE_SERVICE_ROLE_KEY ? 'service_role' : 'anon')

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAccountsTable() {
  try {
    console.log('Testing current accounts table structure...')
    
    // First, let's see what columns exist by checking the schema
    console.log('Checking table schema...')
    const { data: schemaData, error: schemaError } = await supabase.rpc('get_table_columns', {
      table_name: 'accounts'
    }).catch(() => {
      // If RPC doesn't work, try a different approach
      return { data: null, error: null }
    })
    
    // Try a simple select to see current structure
    const { data: testData, error: testError } = await supabase
      .from('accounts')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('Error accessing accounts table:', testError)
      return
    }
    
    console.log('Current accounts table data:', testData)
    
    // Try to insert with just required fields first
    console.log('Testing basic account creation...')
    const { data: basicInsert, error: basicError } = await supabase
      .from('accounts')
      .insert({
        name: 'Test Basic Account'
      })
      .select()
    
    if (basicError) {
      console.error('Basic insert failed:', basicError.message)
      return
    }
    
    console.log('Basic account creation successful:', basicInsert)
    
    // Now test with type and balance
    console.log('Testing account creation with type and balance...')
    const { data: insertData, error: insertError } = await supabase
      .from('accounts')
      .insert({
        name: 'Test Full Account',
        type: 'checking',
        balance: 100.00
      })
      .select()
    
    if (insertError) {
      console.error('Insert failed - columns missing:', insertError.message)
      console.log('')
      console.log('==== ACCOUNTS TABLE SETUP REQUIRED ====')
      console.log('The accounts table is missing required columns.')
      console.log('Please run the SQL commands in accounts-migration.sql')
      console.log('in your Supabase dashboard SQL editor.')
      console.log('')
      console.log('Steps:')
      console.log('1. Go to your Supabase dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Copy and paste the contents of accounts-migration.sql')
      console.log('4. Run the SQL')
      console.log('')
    } else {
      console.log('Success! Account created:', insertData)
      
      // Clean up test account
      if (insertData && insertData[0]) {
        await supabase.from('accounts').delete().eq('id', insertData[0].id)
        console.log('Test account cleaned up')
      }
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

fixAccountsTable()
