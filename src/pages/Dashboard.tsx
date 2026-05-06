import { Link, Outlet } from 'react-router-dom'
import { Folder, Link as LinkIcon, LayoutDashboard } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[#1a1a1a] border-r border-[#404040] flex-shrink-0">
        <div className="p-4 border-b border-[#404040]">
          <h1 className="text-xl font-bold text-white">Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 px-4 py-2 rounded text-[#e0e0e0] hover:bg-[#2d2d2d]"
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="categorias" 
                className="flex items-center gap-3 px-4 py-2 rounded text-[#e0e0e0] hover:bg-[#2d2d2d]"
              >
                <Folder size={20} />
                Categorias
              </Link>
            </li>
            <li>
              <Link 
                to="links" 
                className="flex items-center gap-3 px-4 py-2 rounded text-[#e0e0e0] hover:bg-[#2d2d2d]"
              >
                <LinkIcon size={20} />
                Links
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}