import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Categoria } from '../types'

export default function LinksForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [url, setUrl] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagem, setImagem] = useState('')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const isEditing = !!id

  useEffect(() => {
    fetchCategorias()
    if (id) {
      fetchLink()
    }
  }, [id])

  async function fetchCategorias() {
    const { data } = await supabase
      .from('links_categoria')
      .select('*')
      .order('nome')
    
    if (data) setCategorias(data)
  }

  async function fetchLink() {
    const { data } = await supabase
      .from('links_link')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setNome(data.nome)
      setUrl(data.url)
      setDescricao(data.descricao || '')
      setImagem(data.imagem || '')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const linkData = {
      nome,
      url,
      descricao: descricao || null,
      imagem: imagem || null,
    }

    if (isEditing) {
      await supabase
        .from('links_link')
        .update(linkData)
        .eq('id', id)
    } else {
      await supabase
        .from('links_link')
        .insert(linkData)
    }

navigate('/dashboard/links')
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-white">
        {isEditing ? 'Editar Link' : 'Novo Link'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-[#2d2d2d] p-6 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm mb-2">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 rounded bg-[#1a1a1a] border border-[#404040] text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 rounded bg-[#1a1a1a] border border-[#404040] text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-4 py-2 rounded bg-[#1a1a1a] border border-[#404040] text-white"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">URL da Imagem</label>
          <input
            type="url"
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
            className="w-full px-4 py-2 rounded bg-[#1a1a1a] border border-[#404040] text-white"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2">Categorias</label>
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <label 
                key={cat.id} 
                className={`px-3 py-1 rounded cursor-pointer ${
                  categoriasSelecionadas.includes(cat.id) 
                    ? 'bg-[#3498db] text-white' 
                    : 'bg-[#404040] text-[#e0e0e0]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCategoriasSelecionadas([...categoriasSelecionadas, cat.id])
                    } else {
                      setCategoriasSelecionadas(categoriasSelecionadas.filter(c => c !== cat.id))
                    }
                  }}
                  className="hidden"
                />
                {cat.nome}
              </label>
            ))}
          </div>
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
            onClick={() => navigate('/links')}
            className="flex-1 bg-[#404040] text-white py-2 rounded hover:bg-[#505050]"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}