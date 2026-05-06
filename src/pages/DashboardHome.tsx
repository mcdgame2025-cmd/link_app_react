import { Link } from 'react-router-dom'
import { Folder, Link as LinkIcon } from 'lucide-react'

export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-white">Painel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/categorias" 
          className="bg-[#2d2d2d] p-6 rounded-lg hover:bg-[#353535] transition-colors flex items-center gap-4"
        >
          <Folder size={40} className="text-[#3498db]" />
          <div>
            <h2 className="text-lg font-semibold text-white">Categorias</h2>
            <p className="text-gray-400 text-sm">Gerenciar categorias de links</p>
          </div>
        </Link>

        <Link 
          to="/links" 
          className="bg-[#2d2d2d] p-6 rounded-lg hover:bg-[#353535] transition-colors flex items-center gap-4"
        >
          <LinkIcon size={40} className="text-[#3498db]" />
          <div>
            <h2 className="text-lg font-semibold text-white">Links</h2>
            <p className="text-gray-400 text-sm">Gerenciar seus links</p>
          </div>
        </Link>
      </div>
    </div>
  )
}