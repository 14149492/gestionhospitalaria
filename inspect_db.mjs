import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://iktkkawjidzwxkpnlcen.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrdGtrYXdqaWR6d3hrcG5sY2VuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzkzMTk5NCwiZXhwIjoyMDkzNTA3OTk0fQ.URIdUj0TZqkMuTl-321yLQf1aQVpV_L71Duh3DLxpAQ'
)

async function inspectSchema() {
  const { data, error } = await supabase.rpc('get_tables_info') // Try to find tables if rpc exists, otherwise raw query
  
  // Since we don't know if RPC exists, let's just try to query information_schema if possible
  // Or just try to list common tables
  const tables = ['usuarios_perfil', 'pacientes', 'doctores', 'citas', 'especialidades', 'materias', 'estudiantes', 'docentes']
  
  console.log('--- Inspecting Tables ---')
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(0)
    if (!error) {
      console.log(`Table found: ${table}`)
    }
  }
}

inspectSchema()
