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

    const { error } = await supabase
      .from('links_link')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchLinks()
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Links</h1>
        <Link 
          to="criar" 
          className="flex items-center gap-2 bg-[#3498db] text-white px-4 py-2 rounded hover:bg-[#2980b9]"
        >
          <Plus size={20} />
          Novo Link
        </Link>
      </div>

      {links.length === 0 ? (
        <p className="text-gray-400">Nenhum link encontrado.</p>
      ) : (
        <div className="bg-[#2d2d2d] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#1a1a1a]">
              <tr>
                <th className="text-left p-4 text-gray-400">Imagem</th>
                <th className="text-left p-4 text-gray-400">Nome</th>
                <th className="text-left p-4 text-gray-400">URL</th>
                <th className="text-left p-4 text-gray-400">Categorias</th>
                <th className="text-right p-4 text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id} className="border-t border-[#404040]">
                  <td className="p-4">
                    {link.imagem && (
                      <img src={link.imagem} alt="" className="w-10 h-10 rounded object-cover" />
                    )}
                  </td>
                  <td className="p-4 text-white">{link.nome}</td>
                  <td className="p-4 text-gray-400 truncate max-w-xs">{link.url}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {link.categorias?.map((cat) => (
                        <span key={cat.id} className="text-xs bg-[#3498db]/20 text-[#3498db] px-2 py-1 rounded">
                          {cat.nome}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
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
      )}
    </div>
  )
}