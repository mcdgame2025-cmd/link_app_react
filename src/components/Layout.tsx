import { Outlet, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '../types'


interface LayoutProps {
  user: User | null
}

export default function Layout({ user }: LayoutProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <>
      <header className="bg-[#2d2d2d] px-5 py-5 shadow-md relative z-50">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <h1>
            <Link to="/" className="text-white no-underline text-xl">Meus Links</Link>
          </h1>
          <nav className="flex gap-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="no-underline text-[#e0e0e0] px-3 py-2 rounded-md hover:bg-[#404040]"
                >
                  Painel
                </Link>
                
                <Link to="/dashboard/categorias" className="no-underline text-[#e0e0e0] px-3 py-2 rounded-md hover:bg-[#404040]">Categorias</Link>
                <Link to="/dashboard/links" className="no-underline text-[#e0e0e0] px-3 py-2 rounded-md hover:bg-[#404040]">Links</Link>
                <button 
                  onClick={handleLogout}
                  className="no-underline text-[#e0e0e0] px-3 py-2 rounded-md hover:bg-[#404040] bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="no-underline text-white bg-[#3498db] px-4 py-2 rounded-md hover:bg-[#2980b9]">Entrar</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto p-5">
        <Outlet />
      </main>
    </>
  )
}