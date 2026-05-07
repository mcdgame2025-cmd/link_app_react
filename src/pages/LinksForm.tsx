import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { uploadToCloudinary } from '../lib/cloudinary'
import type { Categoria } from '../types'

export default function LinksForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [url, setUrl] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagem, setImagem] = useState('')
  const [imagemFile, setImagemFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
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
      .eq('id', parseInt(id || ''))
      .single()

    if (data) {
      setNome(data.nome)
      setUrl(data.url)
      setDescricao(data.descricao || '')
      setImagem(data.imagem || '')
    }

    const { data: relData } = await supabase
      .from('links_link_categorias')
      .select('categoria_id')
      .eq('link_id', parseInt(id || ''))

    if (relData) {
      setCategoriasSelecionadas(relData.map(r => r.categoria_id))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    let imagemUrl = imagem

    if (imagemFile) {
      setUploading(true)
      try {
        imagemUrl = await uploadToCloudinary(imagemFile)
      } catch (err) {
        alert('Erro ao fazer upload da imagem: ' + (err as Error).message)
        setLoading(false)
        setUploading(false)
        return
      }
      setUploading(false)
    }

    const linkData = {
      nome,
      url,
      descricao: descricao || null,
      imagem: imagemUrl || null,
    }

    let linkId: number | undefined
    let error: any

    if (isEditing && id) {
      const linkIdNum = parseInt(id)
      const result = await supabase
        .from('links_link')
        .update(linkData)
        .eq('id', linkIdNum)
      error = result.error
      linkId = linkIdNum
    } else {
      const { data: insertedLink, error: insertError } = await supabase
        .from('links_link')
        .insert(linkData)
        .select()
        .single()
      
      error = insertError
      
      if (insertedLink) {
        linkId = insertedLink.id
      } else {
        const { data: existingLink } = await supabase
          .from('links_link')
          .select('id')
          .eq('nome', nome)
          .eq('url', url)
          .single()
        if (existingLink) {
          linkId = existingLink.id
        }
      }
    }

    if (error || !linkId) {
      alert('Erro ao salvar')
      setLoading(false)
      return
    }

    await supabase
      .from('links_link_categorias')
      .delete()
      .eq('link_id', linkId)

    if (categoriasSelecionadas.length > 0) {
      const categoriasData = categoriasSelecionadas.map(catId => ({
        link_id: linkId,
        categoria_id: catId
      }))
      const { error: catError } = await supabase
        .from('links_link_categorias')
        .insert(categoriasData)
      if (catError) {
        console.error('Erro ao salvar categorias:', catError)
        alert('Erro ao salvar categorias: ' + catError.message)
      }
    }

    setLoading(false)
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
          <label className="block text-sm mb-2">Imagem</label>
          <div className="flex gap-2 items-center">
            {imagem ? (
              <div className="relative inline-block">
                <img src={imagem} alt="Preview" className="w-16 h-16 rounded object-cover border border-[#404040]" />
                <button
                  type="button"
                  onClick={() => { setImagem(''); setImagemFile(null) }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="cursor-pointer bg-[#3498db] hover:bg-[#2980b9] text-white px-3 py-2 rounded text-sm">
                <span>Escolher Imagem</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setImagemFile(file)
                      const reader = new FileReader()
                      reader.onload = () => {
                        setImagem(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
            )}
          </div>
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
            disabled={loading || uploading}
            className="flex-1 bg-[#3498db] text-white py-2 rounded hover:bg-[#2980b9] disabled:opacity-50"
          >
            {loading || uploading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/links')}
            className="flex-1 bg-[#404040] text-white py-2 rounded hover:bg-[#505050]"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}