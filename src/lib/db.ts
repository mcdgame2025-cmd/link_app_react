import { supabase } from './supabase'

export async function setupDatabase() {
  const errors: string[] = []

  const { data: catData, error: catError } = await supabase
.from('links_categoria')
    .select('id')
    .limit(1)
    .maybeSingle()

  if (catError) {
    errors.push(`Categoria: ${catError.message}`)
  }

  const { data: linkData, error: linkError } = await supabase
.from('links_link')
    .select('id')
    .limit(1)
    .maybeSingle()

  if (linkError) {
    errors.push(`Link: ${linkError.message}`)
  }

  return { categoriaExists: !!catData, linkExists: !!linkData, errors }
}

export async function checkTables() {
  try {
    const results = await Promise.allSettled([
      supabase.from('links_categoria').select('count').limit(1),
      supabase.from('links_link').select('count').limit(1),
      supabase.from('links_link_categorias').select('count').limit(1),
    ])
    
    return results.map((r, i) => ({
      table: ['categoria', 'link', 'link_categoria'][i],
      status: r.status === 'fulfilled' ? 'ok' : 'error',
      error: r.status === 'rejected' ? (r.reason as any).message : null
    }))
  } catch (e) {
    return [{ table: 'all', status: 'error', error: String(e) }]
  }
}