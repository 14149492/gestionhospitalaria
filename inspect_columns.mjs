import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://iktkkawjidzwxkpnlcen.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrdGtrYXdqaWR6d3hrcG5sY2VuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzkzMTk5NCwiZXhwIjoyMDkzNTA3OTk0fQ.URIdUj0TZqkMuTl-321yLQf1aQVpV_L71Duh3DLxpAQ'
)

async function inspectColumns() {
  const { data, error } = await supabase.from('usuarios_perfil').select('*').limit(1)
  if (error) {
    console.error('Error fetching columns:', error)
  } else {
    console.log('Sample data / columns:', data[0] || 'Table is empty, but exists')
  }
}

inspectColumns()
