import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrainTrack, Activity, ArrowRight, ArrowLeft } from 'lucide-react'

const storySteps = [
  {
    title: "El Ascenso (Función Creciente)",
    text: "Imagina que estás en el primer vagón de la montaña rusa más extrema del mundo. El tren empieza a subir lentamente, la adrenalina aumenta; en lenguaje matemático, la función 'crece'.",
    cart: { x: 156.25, y: 125, rotate: -40.6 },
    tangent: { show: true, rotate: -40.6, color: 'var(--color-neon-cyan)', animate: false },
    showExtrema: false
  },
  {
    title: "La Cima (Número Crítico Suave)",
    text: "De repente, llegas a la cima, el punto más alto. Por un microsegundo absoluto, el vagón se queda plano, suspendido en el aire, justo antes del terror de la caída. Ese instante de suspensión, donde el piso debajo de ti es perfectamente horizontal y la inclinación es nula, es nuestro 'Número Crítico suave'.",
    cart: { x: 300, y: 50, rotate: 0 },
    tangent: { show: true, rotate: 0, color: 'var(--color-neon-green)', animate: false },
    showExtrema: false
  },
  {
    title: "La Caída (Función Decreciente)",
    text: "Luego, la caída libre: la montaña rusa baja a toda velocidad (la función 'decrece').",
    cart: { x: 443.75, y: 100, rotate: 29.7 },
    tangent: { show: true, rotate: 29.7, color: 'var(--color-neon-orange)', animate: false },
    showExtrema: false
  },
  {
    title: "El Error del Ingeniero",
    text: "Pero, ¡cuidado! El ingeniero jefe cometió un error y diseñó un tramo violento: en lugar de una curva suave, creó una esquina afilada como un pico de pirámide.",
    cart: { x: 533.55, y: 147.2, rotate: 16.8 },
    tangent: { show: false, rotate: 0, color: 'transparent', animate: false },
    showExtrema: false
  },
  {
    title: "El Choque (Derivada No Existe)",
    text: "El vagón choca con esa esquina y cambia de dirección instantáneamente. Si intentas poner una recta plana (tangente) ahí, se tambalea caóticamente. Esa esquina brutal es un 'Número Crítico donde la derivada no existe'.",
    cart: { x: 550, y: 150, rotate: -15 }, 
    tangent: { show: true, rotate: [0, 45, -60, 90, -30, 15, -45], color: 'var(--color-neon-purple)', animate: true },
    showExtrema: false
  },
  {
    title: "El Panorama (Extremos Globales)",
    text: "Si nos alejamos y observamos todo el terreno del parque, notamos algo crucial: El punto más alto de TODA la atracción (nuestra cima inicial) es el 'Máximo Global'. Y el punto más bajo (nuestro inicio a nivel del suelo) es el 'Mínimo Global'. ¡No hay montañas más altas ni valles más profundos en este recorrido cerrado!",
    cart: { x: 750, y: 80, rotate: -19.3 }, // Final point on line (550,150) -> (750,80). dx=200, dy=-70. angle=-19.3 deg
    tangent: { show: true, rotate: -19.3, color: 'var(--color-neon-cyan)', animate: false },
    showExtrema: true
  }
]

interface InicioProps {
  onNextModule?: () => void
}

export default function Inicio({ onNextModule }: InicioProps) {
  const [step, setStep] = useState(0)
  
  const current = storySteps[step]

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-block p-4 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-6"
        >
          <Activity className="w-12 h-12 text-neon-purple" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green"
        >
          Bienvenida al Parque de Atracciones de las Derivadas
        </motion.h1>
      </header>

      {/* Simulación Interactiva */}
      <div className="space-y-6">
        
        {/* Gráfico y Montaña Rusa */}
        <motion.div 
          className="relative w-full h-48 md:h-64 bg-dark-panel rounded-2xl border border-white/5 overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          {/* El viewBox controla las coordenadas. Todo lo dibujado adentro usa esta escala matemáticamente perfecta */}
          <svg viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet" className="absolute w-full h-full px-4 overflow-visible">
            
            {/* Extremos Globales Markers */}
            <AnimatePresence>
              {current.showExtrema && (
                <>
                  {/* Máximo Global en (300, 50) */}
                  <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
                    <circle cx="300" cy="50" r="15" fill="none" stroke="var(--color-neon-green)" strokeWidth="3" strokeDasharray="4 2" className="animate-spin-slow" />
                    <text x="300" y="25" fill="var(--color-neon-green)" fontSize="14" fontWeight="bold" textAnchor="middle">Máximo Absoluto</text>
                  </motion.g>

                  {/* Mínimo Global en (50, 200) */}
                  <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
                    <circle cx="50" cy="200" r="15" fill="none" stroke="var(--color-neon-cyan)" strokeWidth="3" strokeDasharray="4 2" className="animate-spin-slow" />
                    <text x="50" y="225" fill="var(--color-neon-cyan)" fontSize="14" fontWeight="bold" textAnchor="middle">Mínimo Absoluto</text>
                  </motion.g>
                </>
              )}
            </AnimatePresence>

            {/* Path de la Montaña Rusa */}
            <motion.path
              d="M 50 200 C 100 200, 200 50, 300 50 C 400 50, 500 150, 550 150 L 750 80"
              fill="transparent"
              stroke="url(#neon-gradient)"
              strokeWidth="6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            <defs>
              <linearGradient id="neon-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-neon-purple)" />
                <stop offset="50%" stopColor="var(--color-neon-cyan)" />
                <stop offset="100%" stopColor="var(--color-neon-green)" />
              </linearGradient>
            </defs>

            {/* Marcador de Esquina Afilada */}
            {step === 4 && (
              <circle cx="550" cy="150" r="12" fill="none" stroke="var(--color-neon-orange)" strokeWidth="3" className="animate-ping" />
            )}

            {/* Vagón animado sincronizado dentro del SVG */}
            <motion.g
              initial={storySteps[0].cart}
              animate={{
                x: current.cart.x,
                y: current.cart.y,
                rotate: current.cart.rotate
              }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
            >
              {/* Línea Tangente Dinámica Atrás */}
              <AnimatePresence>
                {current.tangent.show && (
                  <motion.line
                    x1="-50" y1="0" x2="50" y2="0"
                    stroke={current.tangent.color}
                    strokeWidth="4"
                    strokeDasharray="6 4"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1, 
                      rotate: current.tangent.rotate 
                    }}
                    exit={{ opacity: 0 }}
                    transition={current.tangent.animate ? {
                      rotate: { duration: 0.5, repeat: Infinity, repeatType: "mirror" }
                    } : { type: "spring" }}
                  />
                )}
              </AnimatePresence>

              {/* Cuerpo del Vagón */}
              <rect x="-12" y="-12" width="24" height="24" fill="white" rx="6" />
              <rect x="-6" y="-6" width="12" height="12" fill="var(--color-neon-purple)" rx="3" />
            </motion.g>
          </svg>
        </motion.div>

        {/* Panel de Texto del Cuentazo Interactivo */}
        <div className="bg-gradient-to-br from-[#1a1b26] to-dark-bg p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-purple to-neon-cyan"></div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <TrainTrack className="text-neon-cyan" />
              {current.title}
            </h2>
            <div className="text-slate-500 font-mono text-sm">
              Paso {step + 1} / {storySteps.length}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[120px]"
            >
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                {current.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Conclusión Final */}
          {step === storySteps.length - 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-neon-green/10 border border-neon-green/30 rounded-2xl text-center space-y-6 mt-6"
            >
              <p className="text-lg font-semibold text-neon-green">
                Nuestra misión hoy es ser detectives matemáticos y encontrar todos estos puntos clave de emoción pura usando las mejores herramientas: la ubicación (f), la inclinación (f'), y la fuerza de la curva (f'').
              </p>
              {onNextModule && (
                <button
                  onClick={onNextModule}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-neon-green text-dark-bg rounded-xl font-extrabold hover:bg-neon-green/80 shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all"
                >
                  Comenzar Misión: Sospechosos Críticos
                  <ArrowRight size={20} />
                </button>
              )}
            </motion.div>
          )}

          {/* Controles */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all font-bold"
            >
              <ArrowLeft size={20} />
              Anterior
            </button>
            <button
              onClick={() => setStep(Math.min(storySteps.length - 1, step + 1))}
              disabled={step === storySteps.length - 1}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neon-purple text-white hover:bg-neon-purple/80 shadow-lg shadow-neon-purple/20 disabled:opacity-30 disabled:shadow-none transition-all font-bold"
            >
              Siguiente
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
