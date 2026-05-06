import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <form onSubmit={handleSubmit} className="bg-[#2d2d2d] p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-white text-center">Entrar</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-[#1a1a1a] border border-[#404040] text-white"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-[#1a1a1a] border border-[#404040] text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3498db] text-white py-2 rounded hover:bg-[#2980b9] disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}