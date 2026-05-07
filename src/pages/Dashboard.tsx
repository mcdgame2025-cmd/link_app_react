import { Link, Outlet } from 'react-router-dom'
import { Folder, Link as LinkIcon, LayoutDashboard, Menu, X, Github } from 'lucide-react'
import { useState } from 'react'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: 'categorias', icon: Folder, label: 'Categorias' },
    { to: 'links', icon: LinkIcon, label: 'Links' },
    { to: 'deploy', icon: Github, label: 'Deploy' },
  ]

  return (
    <div className="flex min-h-screen">
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-[#2d2d2d] p-2 rounded text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#1a1a1a] border-r border-[#404040] transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 border-b border-[#404040] pt-16 md:pt-4">
          <h1 className="text-xl font-bold text-white">Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link 
                  to={item.to}
                  className="flex items-center gap-3 px-4 py-2 rounded text-[#e0e0e0] hover:bg-[#2d2d2d]"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">
        <Outlet />
      </main>
    </div>
  )
}