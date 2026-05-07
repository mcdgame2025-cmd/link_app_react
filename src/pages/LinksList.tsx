import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Link as LinkType, Categoria } from '../types'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface LinkWithCategorias extends LinkType {
  categorias?: Categoria[]
}

export default function LinksList() {
  const [links, setLinks] = useState<LinkWithCategorias[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchLinks()
  }, [])

  async function fetchLinks() {
    const { data: linksData } = await supabase
      .from('links_link')
      .select('*')
      .order('nome')

    const { data: relData } = await supabase
      .from('links_link_categorias')
      .select('*')

    const { data: catsData } = await supabase
      .from('links_categoria')
      .select('*')

    if (linksData && relData && catsData) {
      const linksComCats = linksData.map(link => ({
        ...link,
        categorias: relData
          .filter(r => r.link_id === link.id)
          .map(r => catsData.find(c => c.id === r.categoria_id))
          .filter(Boolean) as Categoria[]
      }))
      setLinks(linksComCats as LinkWithCategorias[])
    }
    setLoading(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este link?')) return

    await supabase
      .from('links_link_categorias')
      .delete()
      .eq('link_id', id)

    const { error } = await supabase
      .from('links_link')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao excluir: ' + error.message)
    } else {
      fetchLinks()
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-white">Links</h1>
        <Link 
          to="criar" 
          className="flex items-center gap-2 bg-[#3498db] text-white px-4 py-2 rounded hover:bg-[#2980b9] w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Novo Link
        </Link>
      </div>

      {links.length === 0 ? (
        <p className="text-gray-400">Nenhum link encontrado.</p>
      ) : (
        <>
          <div className="hidden md:block bg-[#2d2d2d] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="text-left p-2 text-gray-400">Imagem</th>
                  <th className="text-left p-2 text-gray-400">Nome</th>
                  <th className="text-left p-2 text-gray-400">URL</th>
                  <th className="text-left p-2 text-gray-400">Categorias</th>
                  <th className="text-right p-2 text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} className="border-t border-[#404040]">
                    <td className="p-2">
                      {link.imagem && (
                        <img src={link.imagem} alt="" className="w-8 h-8 rounded object-cover" />
                      )}
                    </td>
                    <td className="p-2 text-white">{link.nome}</td>
                    <td className="p-2 text-gray-400 truncate max-w-xs">{link.url}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {link.categorias?.map((cat) => (
                          <span key={cat.id} className="text-xs bg-[#3498db]/20 text-[#3498db] px-1 py-0.5 rounded">
                            {cat.nome}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      <button 
                        onClick={() => navigate(`editar/${link.id}`)}
                        className="text-[#3498db] hover:text-[#2980b9] mr-4"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(link.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-2">
            {links.map((link) => (
              <div key={link.id} className="bg-[#2d2d2d] p-2 rounded-lg">
                <div className="flex items-start gap-2">
                  {link.imagem && (
                    <img src={link.imagem} alt="" className="w-10 h-10 rounded object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">{link.nome}</h3>
                    <p className="text-sm text-gray-400 truncate">{link.url}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {link.categorias?.map((cat) => (
                    <span key={cat.id} className="text-xs bg-[#3498db]/20 text-[#3498db] px-1 py-0.5 rounded">
                      {cat.nome}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2 pt-2 border-t border-[#404040]">
                  <button 
                    onClick={() => navigate(`editar/${link.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 text-[#3498db] hover:text-[#2980b9] py-2"
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(link.id)}
                    className="flex-1 flex items-center justify-center gap-2 text-red-500 hover:text-red-400 py-2"
                  >
                    <Trash2 size={18} />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}