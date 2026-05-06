import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Debug() {
  const [tables, setTables] = useState<string[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function checkTables() {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
      
      if (error) {
        setError(error.message)
      } else {
        setTables(data?.map(t => t.table_name) || [])
      }
    }
    checkTables()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Debug - Tabelas</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {tables.map(t => <li key={t}>{t}</li>)}
      </ul>
    </div>
  )
}