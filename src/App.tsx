import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { User } from './types'

import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DashboardHome from './pages/DashboardHome'
import CategoriasList from './pages/CategoriasList'
import CategoriasForm from './pages/CategoriasForm'
import LinksList from './pages/LinksList'
import LinksForm from './pages/LinksForm'
import Deploy from './pages/Deploy'

function ProtectedRoute({ children, user }: { children: React.ReactNode; user: User | null }) {
  if (!user) return <Navigate to="/login" />
  return <>{children}</>
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} />}>
          <Route index element={<Home />} />
          <Route path="login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="dashboard" element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="categorias" element={<CategoriasList />} />
            <Route path="categorias/criar" element={<CategoriasForm />} />
            <Route path="categorias/editar/:id" element={<CategoriasForm />} />
            <Route path="links" element={<LinksList />} />
            <Route path="links/criar" element={<LinksForm />} />
            <Route path="links/editar/:id" element={<LinksForm />} />
            <Route path="deploy" element={<Deploy />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App