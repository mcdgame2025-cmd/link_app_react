import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Categoria } from '../types'

export default function CategoriasForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const isEditing = !!id

  useEffect(() => {
    if (id) {
      fetchCategoria()
    }
  }, [id])

  async function fetchCategoria() {
    const { data } = await supabase
      .from('links_categoria')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setNome(data.nome)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    if (isEditing) {
      await supabase
        .from('links_categoria')
        .update({ nome })
        .eq('id', id)
    } else {
      await supabase
        .from('links_categoria')
        .insert({ nome })
    }

    navigate('/dashboard/categorias')
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-white">
        {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-[#2d2d2d] p-6 rounded-lg">
        <div className="mb-6">
          <label className="block text-sm mb-2">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 rounded bg-[#1a1a1a] border border-[#404040] text-white"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#3498db] text-white py-2 rounded hover:bg-[#2980b9] disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/categorias')}
            className="flex-1 bg-[#404040] text-white py-2 rounded hover:bg-[#505050]"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}