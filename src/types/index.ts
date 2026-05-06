export interface Categoria {
  id: number
  nome: string
  created_at: string
}

export interface Link {
  id: number
  nome: string
  url: string
  descricao: string | null
  imagem: string | null
  created_at: string
  categorias?: Categoria[]
  categoriaIds?: number[]
}

export interface User {
  id: string
  email: string
}