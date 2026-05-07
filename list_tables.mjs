import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://iktkkawjidzwxkpnlcen.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrdGtrYXdqaWR6d3hrcG5sY2VuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzkzMTk5NCwiZXhwIjoyMDkzNTA3OTk0fQ.URIdUj0TZqkMuTl-321yLQf1aQVpV_L71Duh3DLxpAQ'
)

async function listAllTables() {
  // Use a raw query to check the public schema tables
  const { data, error } = await supabase.from('pg_tables').select('tablename').eq('schemaname', 'public')
  // Note: pg_tables might not be accessible via PostgREST easily depending on permissions
  
  if (error) {
    console.log('PostgREST error (expected if pg_tables is protected):', error.message)
    // Alternative: try to query a known system table or just ask the user
  } else {
    console.log('Tables found in public schema:', data)
  }
}

listAllTables()
