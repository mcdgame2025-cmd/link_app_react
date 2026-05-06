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

    const { error } = await supabase
      .from('links_categoria')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchCategorias()
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Categorias</h1>
        <Link 
          to="/categorias/criar" 
          className="flex items-center gap-2 bg-[#3498db] text-white px-4 py-2 rounded hover:bg-[#2980b9]"
        >
          <Plus size={20} />
          Nova Categoria
        </Link>
      </div>

      {categorias.length === 0 ? (
        <p className="text-gray-400">Nenhuma categoria encontrada.</p>
      ) : (
        <div className="bg-[#2d2d2d] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#1a1a1a]">
              <tr>
                <th className="text-left p-4 text-gray-400">Nome</th>
                <th className="text-right p-4 text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="border-t border-[#404040]">
                  <td className="p-4">{categoria.nome}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => navigate(`/categorias/editar/${categoria.id}`)}
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
      )}
    </div>
  )
}