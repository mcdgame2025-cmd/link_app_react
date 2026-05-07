import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '../types'
import { Menu, X } from 'lucide-react'
import { LogOut } from 'lucide-react'


interface LayoutProps {
  user: User | null
}

function GitHubIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}


interface LayoutProps {
  user: User | null
}

export default function Layout({ user }: LayoutProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <>
      <header className="bg-[#2d2d2d] px-4 py-4 shadow-md relative z-50">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <Link to="/" className="text-white no-underline text-xl">Meus Links</Link>
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className={`md:flex gap-2 lg:gap-4 absolute md:relative top-full left-0 right-0 bg-[#2d2d2d] md:bg-transparent flex-col md:flex-row p-4 md:p-0 ${menuOpen ? 'flex' : 'hidden'}`}>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="no-underline text-[#e0e0e0] px-3 py-2 rounded-md hover:bg-[#404040] block"
                  onClick={() => setMenuOpen(false)}
                >
                  Painel
                </Link>
                <Link 
                  to="/dashboard/categorias" 
                  className="no-underline text-[#e0e0e0] px-3 py-2 rounded-md hover:bg-[#404040] block"
                  onClick={() => setMenuOpen(false)}
                >
                  Categorias
                </Link>
                <Link 
                  to="/dashboard/links" 
                  className="no-underline text-[#e0e0e0] px-3 py-2 rounded-md hover:bg-[#404040] block"
                  onClick={() => setMenuOpen(false)}
                >
                  Links
                </Link>
                <Link 
                  to="/dashboard/deploy" 
                  className="no-underline text-[#e0e0e0] p-2 rounded-md hover:bg-[#404040] block"
                  onClick={() => setMenuOpen(false)}
                  title="Deploy"
                >
                  <GitHubIcon size={20} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="no-underline text-[#e0e0e0] p-2 rounded-md hover:bg-[#404040] bg-transparent border-none cursor-pointer block"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="no-underline text-white bg-[#3498db] px-4 py-2 rounded-md hover:bg-[#2980b9] inline-block text-center"
                onClick={() => setMenuOpen(false)}
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto p-4 md:p-5">
        <Outlet />
      </main>
    </>
  )
}