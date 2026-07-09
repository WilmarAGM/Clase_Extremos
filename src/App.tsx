import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Search, Hammer, Activity } from 'lucide-react'
import Inicio from './components/Inicio'
import Modulo1 from './components/Modulo1'
import Modulo2 from './components/Modulo2'
import Modulo3 from './components/Modulo3'

type Tab = 'inicio' | 'modulo1' | 'modulo2' | 'modulo3'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inicio')

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'modulo1', label: 'Sospechosos Críticos', icon: Search },
    { id: 'modulo2', label: 'Kit del Detective', icon: Activity },
    { id: 'modulo3', label: 'Buscando Extremos Globales', icon: Hammer },
  ] as const

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-dark-bg text-dark-text font-sans">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 shrink-0 bg-dark-panel flex flex-col border-b md:border-b-0 md:border-r border-white/5 relative z-20 shadow-2xl">
        <div className="p-4 md:p-6 flex flex-col md:block">
          <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-cyan leading-tight mb-1 md:mb-2 text-center md:text-left">
            Laboratorio de la Montaña Rusa
          </h1>
          <p className="text-xs text-slate-400 font-medium hidden md:block">Cálculo Diferencial SPA</p>
        </div>
        
        <div className="flex-none md:flex-1 px-2 md:px-4 flex md:flex-col overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-2 pb-2 md:pb-0 md:mt-4 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 bg-neon-purple/20 border border-neon-purple/50 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={18} className={`relative z-10 transition-colors ${isActive ? 'text-neon-cyan' : 'group-hover:text-neon-cyan'}`} />
                <span className="relative z-10 text-xs md:text-sm font-medium whitespace-nowrap">{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="hidden md:block p-4 m-4 rounded-xl bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <span className="text-xs font-semibold text-neon-green uppercase tracking-wider">Sistema Activo</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Todas las funciones y herramientas detectivescas están operativas.
          </p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-purple/5 via-dark-bg to-dark-bg -z-10 pointer-events-none"></div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-8 md:p-12 min-h-full"
          >
            {activeTab === 'inicio' && <Inicio onNextModule={() => setActiveTab('modulo1')} />}
            {activeTab === 'modulo1' && <Modulo1 />}
            {activeTab === 'modulo2' && <Modulo2 />}
            {activeTab === 'modulo3' && <Modulo3 />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
