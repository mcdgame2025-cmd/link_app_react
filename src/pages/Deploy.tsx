import { useState } from 'react'
import { Github, Play, Terminal, Copy, Check } from 'lucide-react'

export default function Deploy() {
  const [message, setMessage] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const runDeploy = () => {
    if (!message.trim()) {
      setOutput('Erro: Digite uma mensagem para o commit!')
      return
    }

    const escapedMsg = message.replace(/"/g, '\\"')
    setOutput(`
git add .
git commit -m "${escapedMsg}"
git push
`)
  }

  const copyCommands = () => {
    const text = output.trim()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Deploy GitHub</h1>
      
      <div className="bg-[#2d2d2d] p-4 md:p-6 rounded-lg space-y-4">
        <div className="flex items-center gap-3">
          <Github size={24} className="text-white" />
          <span className="text-white">mcdgame2025-cmd/link_app_react</span>
        </div>
        
        <div>
          <label className="block text-gray-400 mb-2">Mensagem do commit:</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Atualizações..."
            className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded border border-[#404040] focus:border-[#3498db] outline-none"
          />
        </div>

        <button
          onClick={runDeploy}
          className="flex items-center gap-2 bg-[#3498db] text-white px-4 py-2 rounded hover:bg-[#2980b9] w-full sm:w-auto justify-center"
        >
          <Play size={20} />
          Gerar Comandos
        </button>
      </div>

      {output && (
        <div className="mt-6 bg-[#1a1a1a] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-gray-400" />
              <span className="text-gray-400">Comandos:</span>
            </div>
            <button
              onClick={copyCommands}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  )
}