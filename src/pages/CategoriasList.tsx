import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Categoria } from '../types'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function CategoriasList() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategorias()
  }, [])

  async function fetchCategorias() {
    const { data } = await supabase
      .from('links_categoria')
      .select('*')
      .order('nome')
    
    if (data) setCategorias(data)
    setLoading(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return

    await supabase
      .from('links_link_categorias')
      .delete()
      .eq('categoria_id', id)

    const { error } = await supabase
      .from('links_categoria')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao excluir: ' + error.message)
    } else {
      fetchCategorias()
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-white">Categorias</h1>
        <Link 
          to="criar" 
          className="flex items-center gap-2 bg-[#3498db] text-white px-4 py-2 rounded hover:bg-[#2980b9] w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Nova Categoria
        </Link>
      </div>

      {categorias.length === 0 ? (
        <p className="text-gray-400">Nenhuma categoria encontrada.</p>
      ) : (
        <>
          <div className="hidden md:block bg-[#2d2d2d] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="text-left p-2 text-gray-400">Nome</th>
                  <th className="text-right p-2 text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria.id} className="border-t border-[#404040]">
                    <td className="p-2">{categoria.nome}</td>
                    <td className="p-2 text-right">
                      <button 
                        onClick={() => navigate(`editar/${categoria.id}`)}
                        className="text-[#3498db] hover:text-[#2980b9] mr-4"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(categoria.id)}
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
            {categorias.map((categoria) => (
              <div key={categoria.id} className="bg-[#2d2d2d] p-2 rounded-lg flex items-center justify-between">
                <span className="text-white font-medium">{categoria.nome}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`editar/${categoria.id}`)}
                    className="text-[#3498db] hover:text-[#2980b9] p-2"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(categoria.id)}
                    className="text-red-500 hover:text-red-400 p-2"
                  >
                    <Trash2 size={20} />
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