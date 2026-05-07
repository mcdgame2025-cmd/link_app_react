import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Categoria } from '../types'

export default function Home() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [allLinks, setAllLinks] = useState<any[]>([])
  const [linksFiltrados, setLinksFiltrados] = useState<any[]>([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      const { data: categoriasData, error: catError } = await supabase
        .from('links_categoria')
        .select('*')
        .order('nome')

      if (catError) {
        setError(catError.message)
      }

      const { data: linksData, error: linkError } = await supabase
        .from('links_link')
        .select('*')

      const { data: relData } = await supabase
        .from('links_link_categorias')
        .select('*')

      if (linkError) {
        setError(linkError.message)
      }

      if (categoriasData) {
        setCategorias(categoriasData)
      }
      if (linksData && relData) {
        const linksComCategorias = linksData.map(link => ({
          ...link,
          categoriaIds: relData.filter(r => r.link_id === link.id).map(r => r.categoria_id)
        }))
        setAllLinks(linksComCategorias)
        setLinksFiltrados(linksComCategorias)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (categoriaSelecionada === null) {
      setLinksFiltrados(allLinks)
    } else {
      setLinksFiltrados(allLinks.filter((l: any) => l.categoriaIds?.includes(categoriaSelecionada)))
    }
  }, [categoriaSelecionada, allLinks])

  if (loading) return <div>Carregando...</div>

  if (error) return (
    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded">
      Erro ao carregar dados: {error}
    </div>
  )

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      <div className="w-full md:w-48 lg:w-56 flex-shrink-0">
        <div className="bg-[#2d2d2d] p-2 md:p-3 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-white border-b border-[#404040] pb-2">
            Categorias
          </h2>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setCategoriaSelecionada(null)}
              className={`text-left px-2 py-1 md:px-3 md:py-2 rounded transition-colors ${
                categoriaSelecionada === null 
                  ? 'bg-[#3498db] text-white' 
                  : 'text-[#e0e0e0] hover:bg-[#404040]'
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSelecionada(cat.id)}
                className={`text-left px-2 py-1 md:px-3 rounded transition-colors ${
                  categoriaSelecionada === cat.id 
                    ? 'bg-[#3498db] text-white' 
                    : 'text-[#e0e0e0] hover:bg-[#404040]'
                }`}
              >
                {cat.nome}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {linksFiltrados.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">Nenhum link encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {linksFiltrados.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2d2d2d] p-2 md:p-3 rounded-lg hover:bg-[#363636] transition-colors"
              >
                <div className="flex items-start gap-2">
                  {link.imagem && (
                    <img src={link.imagem} alt="" className="w-8 h-8 md:w-10 md:h-10 rounded object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{link.nome}</h3>
                    <p className="text-sm text-gray-400 truncate">{link.url}</p>
                    {link.descricao && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{link.descricao}</p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}