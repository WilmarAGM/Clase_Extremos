import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceDot, ResponsiveContainer } from 'recharts'
import { Search, Info, Radar } from 'lucide-react'
import clsx from 'clsx'

type FuncType = 'suave' | 'pico'

export default function Modulo1() {
  const [funcType, setFuncType] = useState<FuncType>('suave')
  const [currentX, setCurrentX] = useState<number>(1)
  const [radarActive, setRadarActive] = useState(false)

  // Math Functions
  const fSuave = (x: number) => Math.pow(x, 3) - 3 * Math.pow(x, 2)
  const dfSuave = (x: number) => 3 * Math.pow(x, 2) - 6 * x

  const fPico = (x: number) => -Math.abs(x - 2) + 4
  const dfPico = (x: number) => (x < 2 ? 1 : x > 2 ? -1 : NaN)

  const f = funcType === 'suave' ? fSuave : fPico
  const df = funcType === 'suave' ? dfSuave : dfPico

  // Chart Data Generation
  const data = useMemo(() => {
    const points = []
    const start = funcType === 'suave' ? -1.5 : -1
    const end = funcType === 'suave' ? 3.5 : 5
    const step = 0.1
    for (let x = start; x <= end + 0.01; x += step) {
      points.push({ x: Number(x.toFixed(2)), y: f(x) })
    }
    return points
  }, [funcType, f])

  const globalExtrema = useMemo(() => {
    let max = -Infinity
    let min = Infinity
    data.forEach(d => {
      if (d.y > max) max = d.y
      if (d.y < min) min = d.y
    })
    const mins = data.filter(d => Math.abs(d.y - min) < 0.01)
    const maxs = data.filter(d => Math.abs(d.y - max) < 0.01)
    return { mins, maxs }
  }, [data])

  // Tangent Line Generation
  const tangentData = useMemo(() => {
    let m = df(currentX)
    const y0 = f(currentX)
    
    if (Number.isNaN(m)) return null // No tangent at sharp peak
    
    // Prevent exactly horizontal/vertical segments which bug out Recharts ReferenceLine
    if (Math.abs(m) < 0.0001) m = 0.0001

    const x1 = currentX - 1.5
    const y1 = m * (x1 - currentX) + y0
    const x2 = currentX + 1.5
    const y2 = m * (x2 - currentX) + y0

    return [{ x: x1, y: y1 }, { x: x2, y: y2 }] as const
  }, [currentX, f, df])

  const m = df(currentX)
  let tangentColor = '#808080' // Gray/Black for critical
  if (!Number.isNaN(m)) {
    if (m > 0.1) tangentColor = '#39ff14' // Green increasing
    else if (m < -0.1) tangentColor = '#ff5e00' // Orange/Red decreasing
  }

  // Critical Points for Radar
  const criticalPoints = funcType === 'suave' 
    ? [{ x: 0, y: 0, type: 'f\'=0' }, { x: 2, y: -4, type: 'f\'=0' }]
    : [{ x: 2, y: 4, type: 'f\' no existe' }]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-neon-cyan/10 rounded-xl border border-neon-cyan/30">
          <Search className="w-8 h-8 text-neon-cyan" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Zona de Sospechosos Críticos</h2>
          <p className="text-slate-400 mt-1">Identifica dónde la inclinación es nula o indefinida.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Controls & Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-panel p-6 rounded-2xl border border-white/5 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex gap-2 p-1 bg-dark-bg rounded-lg border border-white/5 w-full sm:w-auto">
                <button
                  onClick={() => { setFuncType('suave'); setCurrentX(1); setRadarActive(false) }}
                  className={clsx(
                    "flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-semibold transition-all",
                    funcType === 'suave' ? "bg-neon-cyan/20 text-neon-cyan" : "text-slate-400 hover:text-white"
                  )}
                >
                  Función Suave
                </button>
                <button
                  onClick={() => { setFuncType('pico'); setCurrentX(1); setRadarActive(false) }}
                  className={clsx(
                    "flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-semibold transition-all",
                    funcType === 'pico' ? "bg-neon-orange/20 text-neon-orange" : "text-slate-400 hover:text-white"
                  )}
                >
                  Pico Peligroso
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRadarActive(!radarActive)}
                className={clsx(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all w-full sm:w-auto justify-center shadow-lg",
                  radarActive 
                    ? "bg-neon-purple text-white shadow-neon-purple/50" 
                    : "bg-dark-bg border border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10"
                )}
              >
                <Radar className={clsx("w-5 h-5", radarActive && "animate-spin-slow")} />
                {radarActive ? 'Radar Activado' : 'Activar Radar Detectivesco'}
              </motion.button>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                  <XAxis dataKey="x" stroke="#888" type="number" domain={['dataMin', 'dataMax']} />
                  <YAxis stroke="#888" domain={['auto', 'auto']} />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke={funcType === 'suave' ? 'var(--color-neon-cyan)' : 'var(--color-neon-orange)'} 
                    strokeWidth={4} 
                    dot={false}
                    isAnimationActive={false}
                  />
                  
                  {/* Tangent Line */}
                  {tangentData && (
                    <ReferenceLine 
                      segment={tangentData} 
                      stroke={tangentColor} 
                      strokeWidth={3} 
                      strokeDasharray="5 5"
                    />
                  )}
                  
                  {/* Extremos Globales Markers */}
                  {globalExtrema.maxs.map((pt, i) => (
                    <ReferenceDot key={`max-${i}`} x={pt.x} y={pt.y} r={8} fill="#ffd700" stroke="white" strokeWidth={2} label={{ position: 'top', value: 'Máx Global', fill: '#ffd700', fontSize: 12, fontWeight: 'bold' }} />
                  ))}
                  {globalExtrema.mins.map((pt, i) => (
                    <ReferenceDot key={`min-${i}`} x={pt.x} y={pt.y} r={8} fill="#00ffff" stroke="white" strokeWidth={2} label={{ position: 'bottom', value: 'Mín Global', fill: '#00ffff', fontSize: 12, fontWeight: 'bold' }} />
                  ))}

                  {/* Current Point */}
                  <ReferenceDot 
                    x={currentX} 
                    y={f(currentX)} 
                    r={6} 
                    fill="white" 
                    stroke={tangentColor} 
                    strokeWidth={3}
                  />

                  {/* Radar Critical Points */}
                  {radarActive && criticalPoints.map((cp, idx) => (
                    <ReferenceDot
                      key={`cp-${idx}`}
                      x={cp.x}
                      y={cp.y}
                      r={14}
                      fill="var(--color-neon-purple)"
                      stroke="white"
                      strokeWidth={2}
                      label={{ 
                        position: 'top', 
                        value: cp.type,
                        fill: 'var(--color-neon-purple)',
                        fontSize: 14,
                        fontWeight: 'bold'
                      }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Slider Control */}
            <div className="mt-6 px-4">
              <div className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                <span>Posición del vagón (x): {currentX.toFixed(2)}</span>
                <span>Pendiente (f'): {Number.isNaN(m) ? 'No existe' : m.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={funcType === 'suave' ? -1 : 0}
                max={funcType === 'suave' ? 3 : 4}
                step={0.01}
                value={currentX}
                onChange={(e) => setCurrentX(parseFloat(e.target.value))}
                className="w-full accent-neon-cyan cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Information & Clues */}
        <div className="space-y-6">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-gradient-to-br from-[#1a1b26] to-dark-bg p-6 rounded-2xl border border-neon-purple/20 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Info className="w-24 h-24" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 relative z-10">Panel de Pistas</h3>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-dark-panel p-4 rounded-xl border border-white/5">
                <h4 className="text-neon-cyan font-bold mb-2 flex items-center gap-2">
                  <span className="bg-neon-cyan/20 w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
                  El Número Crítico
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Es cualquier valor de <em>x</em> donde la inclinación (f') es <strong>CERO</strong> (terreno plano) <strong>O</strong> donde la pista se <strong>ROMPE</strong> (esquina afilada). Solo aquí pueden existir picos o valles.
                </p>
              </div>

              <div className="bg-dark-panel p-4 rounded-xl border border-white/5">
                <h4 className="text-neon-green font-bold mb-2 flex items-center gap-2">
                  <span className="bg-neon-green/20 w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
                  Teorema de Fermat
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Si encontramos un pico suave, obligatoriamente su inclinación es cero. Intenta mover el vagón a la cima o al valle de la curva suave.
                </p>
              </div>

              <div className="bg-dark-panel p-4 rounded-xl border border-white/5">
                <h4 className="text-neon-purple font-bold mb-2 flex items-center gap-2">
                  <span className="bg-neon-purple/20 w-6 h-6 flex items-center justify-center rounded-full text-xs">3</span>
                  Teorema del Valor Extremo
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Si la vía no tiene cortes (continua) en un terreno cerrado, SIEMPRE tendrá un máximo y mínimo global. Para descubrirlos, solo debes investigar los <strong>Números Críticos</strong> (Fermat/esquinas) y los <strong>extremos</strong> del terreno.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
