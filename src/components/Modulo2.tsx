import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceArea, ReferenceDot, ReferenceLine } from 'recharts'
import { Activity, Plus, Minus, ArrowUp, ArrowDown, Smile, Frown, Info, Target } from 'lucide-react'
import clsx from 'clsx'

type KitTab = 'kit1' | 'kit2'

const AnimatedSymbol = (props: any) => {
  const { viewBox, x, y, symbolText, fill } = props;
  const cx = viewBox ? viewBox.x : x;
  const cy = viewBox ? viewBox.y : y;
  return (
    <text x={cx} y={cy} dy={-15} textAnchor="middle" fill={fill} fontSize="35" fontWeight="bold" className="animate-bounce">
      {symbolText}
    </text>
  );
};

export default function Modulo2() {
  const [activeKit, setActiveKit] = useState<KitTab>('kit1')

  // Kit 1 State
  const [signs1, setSigns1] = useState<Record<string, '+' | '-' | null>>({
    left: null,
    middle: null,
    right: null
  })
  
  // Kit 2 State
  const [signs2, setSigns2] = useState<Record<string, '+' | '-' | null>>({
    left: null,
    right: null
  })

  // Math Setup: f(x) = x^3/3 - x
  const f = (x: number) => Math.pow(x, 3) / 3 - x
  const df = (x: number) => Math.pow(x, 2) - 1
  const ddf = (x: number) => 2 * x

  const data = useMemo(() => {
    const pts = []
    for (let x = -2.5; x <= 2.5; x += 0.1) {
      pts.push({
        x: Number(x.toFixed(2)),
        fx: f(x),
        dfx: df(x),
        ddfx: ddf(x)
      })
    }
    return pts
  }, [])

  const kit1Solved = signs1.left === '+' && signs1.middle === '-' && signs1.right === '+'
  const kit2Solved = signs2.left === '-' && signs2.right === '+'

  const handleSign1Click = (region: 'left' | 'middle' | 'right', sign: '+' | '-') => {
    setSigns1(prev => ({ ...prev, [region]: sign }))
  }

  const handleSign2Click = (region: 'left' | 'right', sign: '+' | '-') => {
    setSigns2(prev => ({ ...prev, [region]: sign }))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-neon-purple/10 rounded-xl border border-neon-purple/30">
            <Activity className="w-8 h-8 text-neon-purple" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">El Kit del Detective</h2>
            <p className="text-slate-400 mt-1">Herramientas avanzadas para clasificar puntos clave.</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-dark-panel p-1.5 rounded-xl border border-white/5 shadow-xl">
          <button
            onClick={() => setActiveKit('kit1')}
            className={clsx(
              "px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2",
              activeKit === 'kit1' ? "bg-neon-cyan text-dark-bg shadow-[0_0_15px_rgba(0,255,255,0.4)]" : "text-slate-400 hover:text-white"
            )}
          >
            Kit 1: Primera Derivada
          </button>
          <button
            onClick={() => setActiveKit('kit2')}
            className={clsx(
              "px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2",
              activeKit === 'kit2' ? "bg-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "text-slate-400 hover:text-white"
            )}
          >
            Kit 2: Segunda Derivada
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        
        {/* ======================= KIT 1 ======================= */}
        {activeKit === 'kit1' && (
          <motion.div 
            key="kit1"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gráficas Kit 1 */}
              <div className="bg-dark-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-neon-cyan flex items-center gap-2 mb-2">
                  <Activity size={20} /> Gráficas de f(x) y f'(x)
                </h3>
                
                {/* f(x) */}
                <div className="h-[220px] w-full relative">
                  <span className="absolute top-2 left-2 text-xs font-bold text-neon-cyan bg-dark-bg/80 px-2 py-1 rounded z-10">Ubicación f(x)</span>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                      <XAxis dataKey="x" type="number" domain={[-2.5, 2.5]} hide />
                      <YAxis stroke="#888" width={30} tick={{fontSize: 10}} />
                      <Line type="monotone" dataKey="fx" stroke="var(--color-neon-cyan)" strokeWidth={3} dot={false} isAnimationActive={false} />
                      
                      {/* Líneas verticales conectando con f' */}
                      <ReferenceLine x={-1} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                      <ReferenceLine x={1} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />

                      {/* Flechas de subida/bajada interactivas con movimiento */}
                      {signs1.left === '+' && <ReferenceDot x={-1.75} y={f(-1.75)} r={1} fillOpacity={0} strokeOpacity={0} label={(p) => <AnimatedSymbol {...p} symbolText="↗" fill="#39ff14" />} />}
                      {signs1.left === '-' && <ReferenceDot x={-1.75} y={f(-1.75)} r={1} fillOpacity={0} strokeOpacity={0} label={(p) => <AnimatedSymbol {...p} symbolText="↘" fill="#ff4500" />} />}
                      {signs1.middle === '+' && <ReferenceDot x={0} y={f(0)} r={1} fillOpacity={0} strokeOpacity={0} label={(p) => <AnimatedSymbol {...p} symbolText="↗" fill="#39ff14" />} />}
                      {signs1.middle === '-' && <ReferenceDot x={0} y={f(0)} r={1} fillOpacity={0} strokeOpacity={0} label={(p) => <AnimatedSymbol {...p} symbolText="↘" fill="#ff4500" />} />}
                      {signs1.right === '+' && <ReferenceDot x={1.75} y={f(1.75)} r={1} fillOpacity={0} strokeOpacity={0} label={(p) => <AnimatedSymbol {...p} symbolText="↗" fill="#39ff14" />} />}
                      {signs1.right === '-' && <ReferenceDot x={1.75} y={f(1.75)} r={1} fillOpacity={0} strokeOpacity={0} label={(p) => <AnimatedSymbol {...p} symbolText="↘" fill="#ff4500" />} />}

                      {/* Transición en x = -1 (solo si es correcto) */}
                      {signs1.left === '+' && signs1.middle === '-' && (
                        <ReferenceDot x={-1} y={f(-1)} r={6} fill="#ffd700" stroke="white" strokeWidth={2} label={{ position: 'top', value: 'Máx Relativo', fill: '#ffd700', fontSize: 12, fontWeight: 'bold' }} />
                      )}

                      {/* Transición en x = 1 (solo si es correcto) */}
                      {signs1.middle === '-' && signs1.right === '+' && (
                        <ReferenceDot x={1} y={f(1)} r={6} fill="#00ffff" stroke="white" strokeWidth={2} label={{ position: 'bottom', value: 'Mín Relativo', fill: '#00ffff', fontSize: 12, fontWeight: 'bold' }} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* f'(x) */}
                <div className="h-[150px] w-full relative">
                  <span className="absolute top-2 left-2 text-xs font-bold text-neon-green bg-dark-bg/80 px-2 py-1 rounded z-10">Inclinación f'(x)</span>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                      <XAxis dataKey="x" type="number" domain={[-2.5, 2.5]} stroke="#888" tick={{fontSize: 10}} />
                      <YAxis stroke="#888" width={30} tick={{fontSize: 10}} />
                      {/* Líneas verticales conectando con f */}
                      <ReferenceLine x={-1} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                      <ReferenceLine x={1} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />

                      {/* Franjas horizontales estáticas: Mitad superior Verde, Mitad inferior Naranja */}
                      <ReferenceArea y2={0} ifOverflow="extendDomain" fill="#39ff14" fillOpacity={0.2} />
                      <ReferenceArea y1={0} ifOverflow="extendDomain" fill="#ff4500" fillOpacity={0.2} />

                      <Line type="monotone" dataKey="dfx" stroke="var(--color-neon-green)" strokeWidth={2} dot={false} isAnimationActive={false} />

                      {/* Marcando dónde f' se hace cero */}
                      <ReferenceDot x={-1} y={0} r={5} fill="var(--color-neon-cyan)" stroke="white" strokeWidth={2} label={{ position: 'bottom', value: "f'=0", fill: '#00ffff', fontSize: 10 }} />
                      <ReferenceDot x={1} y={0} r={5} fill="var(--color-neon-cyan)" stroke="white" strokeWidth={2} label={{ position: 'bottom', value: "f'=0", fill: '#00ffff', fontSize: 10 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Interactividad Kit 1 */}
              <div className="space-y-6">
                <div className="bg-dark-panel p-6 rounded-2xl border border-white/5 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-2">Prueba de la Primera Derivada</h3>
                  <p className="text-sm text-slate-400 mb-6">Investiga el signo de f' en cada zona separada por los números críticos (-1 y 1).</p>
                  
                  <div className="relative h-24 flex items-center mb-4">
                    <div className="absolute inset-x-0 h-1 bg-slate-700 rounded-full"></div>
                    
                    <div className="absolute left-1/3 w-3 h-8 -mt-3.5 bg-neon-cyan rounded-full flex flex-col items-center shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                      <span className="absolute -bottom-6 text-xs font-bold text-neon-cyan">-1</span>
                    </div>
                    <div className="absolute left-2/3 w-3 h-8 -mt-3.5 bg-neon-cyan rounded-full flex flex-col items-center shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                      <span className="absolute -bottom-6 text-xs font-bold text-neon-cyan">1</span>
                    </div>

                    <div className="absolute left-0 w-1/3 flex justify-center -mt-16">
                      <div className="flex gap-2 bg-dark-bg p-1 rounded-lg border border-white/10">
                        <button onClick={() => handleSign1Click('left', '+')} className={clsx("p-1.5 rounded transition", signs1.left === '+' ? "bg-neon-green text-dark-bg" : "text-neon-green hover:bg-white/5")}><Plus size={16} /></button>
                        <button onClick={() => handleSign1Click('left', '-')} className={clsx("p-1.5 rounded transition", signs1.left === '-' ? "bg-neon-orange text-dark-bg" : "text-neon-orange hover:bg-white/5")}><Minus size={16} /></button>
                      </div>
                    </div>
                    <div className="absolute left-1/3 w-1/3 flex justify-center -mt-16">
                      <div className="flex gap-2 bg-dark-bg p-1 rounded-lg border border-white/10">
                        <button onClick={() => handleSign1Click('middle', '+')} className={clsx("p-1.5 rounded transition", signs1.middle === '+' ? "bg-neon-green text-dark-bg" : "text-neon-green hover:bg-white/5")}><Plus size={16} /></button>
                        <button onClick={() => handleSign1Click('middle', '-')} className={clsx("p-1.5 rounded transition", signs1.middle === '-' ? "bg-neon-orange text-dark-bg" : "text-neon-orange hover:bg-white/5")}><Minus size={16} /></button>
                      </div>
                    </div>
                    <div className="absolute left-2/3 w-1/3 flex justify-center -mt-16">
                      <div className="flex gap-2 bg-dark-bg p-1 rounded-lg border border-white/10">
                        <button onClick={() => handleSign1Click('right', '+')} className={clsx("p-1.5 rounded transition", signs1.right === '+' ? "bg-neon-green text-dark-bg" : "text-neon-green hover:bg-white/5")}><Plus size={16} /></button>
                        <button onClick={() => handleSign1Click('right', '-')} className={clsx("p-1.5 rounded transition", signs1.right === '-' ? "bg-neon-orange text-dark-bg" : "text-neon-orange hover:bg-white/5")}><Minus size={16} /></button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Feedback */}
                  <div className="bg-dark-bg p-4 rounded-xl border border-white/5 mt-4 min-h-[60px] flex items-center justify-center text-sm font-medium text-center">
                    {(signs1.left && signs1.middle && signs1.right) ? (
                      kit1Solved ? (
                        <span className="text-neon-green">¡Excelente! El punto -1 es un MÁXIMO RELATIVO (pasa de + a -) y el 1 es un MÍNIMO RELATIVO (pasa de - a +). Los he marcado en tu gráfica.</span>
                      ) : (
                        <span className="text-neon-orange">Esos signos no coinciden con la gráfica de f'(x). Inténtalo de nuevo analizando si f' está por encima o por debajo del cero.</span>
                      )
                    ) : (
                      <span className="text-slate-500">Coloca los signos para revelar los extremos relativos en la gráfica.</span>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {kit1Solved && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gradient-to-br from-[#1a1b26] to-dark-bg p-6 rounded-2xl border border-neon-cyan/30 shadow-[0_0_20px_rgba(0,255,255,0.1)] relative overflow-hidden"
                    >
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Target className="text-neon-cyan w-5 h-5" /> Búsqueda de Extremos Globales
                      </h3>
                      <p className="text-sm text-slate-300 mb-4">Para hallar el campeón global en el terreno [-2.5, 2.5], comparamos la altura de los sospechosos (críticos) vs los bordes:</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm font-mono text-slate-300">
                        <div className="bg-dark-panel p-2 rounded">Borde Izq: f(-2.5) = <span className="text-neon-orange">-2.71</span></div>
                        <div className="bg-dark-panel p-2 rounded border border-neon-cyan/50 shadow-[0_0_10px_rgba(0,255,255,0.2)]">Máx Rel: f(-1) = <span className="text-neon-cyan">0.67</span></div>
                        <div className="bg-dark-panel p-2 rounded">Mín Rel: f(1) = <span className="text-neon-orange">-0.67</span></div>
                        <div className="bg-dark-panel p-2 rounded border border-neon-green/50 shadow-[0_0_10px_rgba(57,255,20,0.2)]">Borde Der: f(2.5) = <span className="text-neon-green">2.71</span></div>
                      </div>
                      
                      <div className="mt-4 text-xs font-semibold text-neon-green bg-neon-green/10 p-3 rounded-lg border border-neon-green/20">
                        Conclusión: El Máximo Global ocurre en el borde x=2.5 y el Mínimo Global en el borde x=-2.5. ¡Los extremos locales no siempre ganan la competencia global!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Teoría Kit 1 */}
            <div className="bg-dark-panel p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan"></div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Info className="w-6 h-6 text-neon-cyan" />
                Criterio de la Primera Derivada
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm md:text-base">
                Esta regla nos permite clasificar un número crítico como máximo o mínimo local observando el cambio de signos de f'.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-bg p-5 rounded-2xl border border-white/5 flex gap-3">
                  <ArrowUp className="w-5 h-5 text-neon-green shrink-0" />
                  <div>
                    <strong className="text-white block mb-1">Máximo Local:</strong>
                    f' pasa de <span className="text-neon-green font-bold">+</span> a <span className="text-neon-orange font-bold">-</span>.
                  </div>
                </div>
                <div className="bg-dark-bg p-5 rounded-2xl border border-white/5 flex gap-3">
                  <ArrowDown className="w-5 h-5 text-neon-orange shrink-0" />
                  <div>
                    <strong className="text-white block mb-1">Mínimo Local:</strong>
                    f' pasa de <span className="text-neon-orange font-bold">-</span> a <span className="text-neon-green font-bold">+</span>.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= KIT 2 ======================= */}
        {activeKit === 'kit2' && (
          <motion.div 
            key="kit2"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gráficas Kit 2 */}
              <div className="bg-dark-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-neon-purple flex items-center gap-2 mb-2">
                  <Activity size={20} /> Gráficas de f(x) y f''(x)
                </h3>
                
                {/* f(x) */}
                <div className="h-[220px] w-full relative">
                  <span className="absolute top-2 left-2 text-xs font-bold text-neon-cyan bg-dark-bg/80 px-2 py-1 rounded z-10">Ubicación f(x)</span>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                      <XAxis dataKey="x" type="number" domain={[-2.5, 2.5]} hide />
                      <YAxis stroke="#888" width={30} tick={{fontSize: 10}} />
                      <Line type="monotone" dataKey="fx" stroke="var(--color-neon-cyan)" strokeWidth={3} dot={false} isAnimationActive={false} />
                      
                      {/* Línea vertical conectando con f'' */}
                      <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />

                      {/* Curvatura interactiva con caritas felices y tristes con movimiento */}
                      {signs2.left === '+' && <ReferenceDot x={-1.25} y={f(-1.25)} r={1} fillOpacity={0} strokeOpacity={0} label={(p) => <AnimatedSymbol {...p} symbolText="🙂" fill="#39ff14" />} />}
                      {signs2.left === '-' && <ReferenceDot x={-1.25} y={f(-1.25)} r={1} fillOpacity={0} strokeOpacity={0} label={(p) => <AnimatedSymbol {...p} symbolText="🙁" fill="#ff4500" />} />}
                      {signs2.right === '+' && <ReferenceDot x={1.25} y={f(1.25)} r={1} fillOpacity={0} strokeOpacity={0} label={(p) => <AnimatedSymbol {...p} symbolText="🙂" fill="#39ff14" />} />}
                      {signs2.right === '-' && <ReferenceDot x={1.25} y={f(1.25)} r={1} fillOpacity={0} strokeOpacity={0} label={(p) => <AnimatedSymbol {...p} symbolText="🙁" fill="#ff4500" />} />}

                      {/* Transición de Concavidad (solo si es correcto) */}
                      {signs2.left === '-' && signs2.right === '+' && (
                        <ReferenceDot x={0} y={f(0)} r={6} fill="#a855f7" stroke="white" strokeWidth={2} label={{ position: 'top', value: 'Punto Inflexión', fill: '#a855f7', fontSize: 12, fontWeight: 'bold' }} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* f''(x) */}
                <div className="h-[150px] w-full relative">
                  <span className="absolute top-2 left-2 text-xs font-bold text-neon-purple bg-dark-bg/80 px-2 py-1 rounded z-10">Concavidad f''(x)</span>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                      <XAxis dataKey="x" type="number" domain={[-2.5, 2.5]} stroke="#888" tick={{fontSize: 10}} />
                      <YAxis stroke="#888" width={30} tick={{fontSize: 10}} />
                      {/* Línea vertical conectando con f */}
                      <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />

                      {/* Franjas horizontales estáticas: Mitad superior Verde, Mitad inferior Naranja */}
                      <ReferenceArea y2={0} ifOverflow="extendDomain" fill="#39ff14" fillOpacity={0.2} />
                      <ReferenceArea y1={0} ifOverflow="extendDomain" fill="#ff4500" fillOpacity={0.2} />

                      <Line type="monotone" dataKey="ddfx" stroke="var(--color-neon-purple)" strokeWidth={2} dot={false} isAnimationActive={false} />

                      {/* Marcando dónde f'' se hace cero */}
                      <ReferenceDot x={0} y={0} r={5} fill="var(--color-neon-purple)" stroke="white" strokeWidth={2} label={{ position: 'bottom', value: "f''=0", fill: '#a855f7', fontSize: 10 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Interactividad Kit 2 */}
              <div className="space-y-6">
                <div className="bg-dark-panel p-6 rounded-2xl border border-white/5 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-2">Análisis de Concavidad</h3>
                  <p className="text-sm text-slate-400 mb-6">Investiga el signo de f'' a la izquierda y derecha de x=0 para descubrir la curvatura.</p>
                  
                  <div className="relative h-24 flex items-center mb-4">
                    <div className="absolute inset-x-0 h-1 bg-slate-700 rounded-full"></div>
                    
                    <div className="absolute left-1/2 w-3 h-8 -mt-3.5 bg-neon-purple rounded-full flex flex-col items-center shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                      <span className="absolute -bottom-6 text-xs font-bold text-neon-purple">0</span>
                    </div>

                    <div className="absolute left-0 w-1/2 flex justify-center -mt-16 pr-8">
                      <div className="flex gap-2 bg-dark-bg p-1 rounded-lg border border-white/10">
                        <button onClick={() => handleSign2Click('left', '+')} className={clsx("p-1.5 rounded transition", signs2.left === '+' ? "bg-neon-green text-dark-bg" : "text-neon-green hover:bg-white/5")}><Plus size={16} /></button>
                        <button onClick={() => handleSign2Click('left', '-')} className={clsx("p-1.5 rounded transition", signs2.left === '-' ? "bg-neon-orange text-dark-bg" : "text-neon-orange hover:bg-white/5")}><Minus size={16} /></button>
                      </div>
                    </div>
                    <div className="absolute left-1/2 w-1/2 flex justify-center -mt-16 pl-8">
                      <div className="flex gap-2 bg-dark-bg p-1 rounded-lg border border-white/10">
                        <button onClick={() => handleSign2Click('right', '+')} className={clsx("p-1.5 rounded transition", signs2.right === '+' ? "bg-neon-green text-dark-bg" : "text-neon-green hover:bg-white/5")}><Plus size={16} /></button>
                        <button onClick={() => handleSign2Click('right', '-')} className={clsx("p-1.5 rounded transition", signs2.right === '-' ? "bg-neon-orange text-dark-bg" : "text-neon-orange hover:bg-white/5")}><Minus size={16} /></button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Feedback */}
                  <div className="bg-dark-bg p-4 rounded-xl border border-white/5 mt-4 min-h-[60px] flex items-center justify-center text-sm font-medium text-center">
                    {(signs2.left && signs2.right) ? (
                      kit2Solved ? (
                        <span className="text-neon-purple">¡Magnífico! Hubo un cambio de concavidad de - (triste) a + (feliz). Por lo tanto, x=0 es un PUNTO DE INFLEXIÓN auténtico.</span>
                      ) : (
                        <span className="text-neon-orange">Revisa la gráfica de f''(x). ¿La línea morada está arriba o abajo del eje en esas zonas?</span>
                      )
                    ) : (
                      <span className="text-slate-500">Coloca los signos para analizar la torsión de la vía.</span>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1b26] to-dark-bg p-6 rounded-2xl border border-neon-purple/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                  <h3 className="text-lg font-bold text-white mb-4">Criterio de la Segunda Derivada</h3>
                  <p className="text-sm text-slate-300 mb-4">Clasifiquemos los números críticos del Kit 1 (x=-1 y x=1) usando su concavidad actual sin revisar vecinos:</p>
                  
                  <div className="space-y-3">
                    <div className="bg-dark-panel p-3 rounded-xl border border-white/5 flex items-center gap-4">
                      <div className="font-mono font-bold w-12 text-center text-slate-300">x = -1</div>
                      <div className="flex-1 text-sm text-slate-400">f''(-1) = -2 (Negativo)</div>
                      <Frown className="text-neon-orange w-6 h-6" />
                      <div className="text-neon-orange font-bold text-sm">Máximo Local</div>
                    </div>
                    <div className="bg-dark-panel p-3 rounded-xl border border-white/5 flex items-center gap-4">
                      <div className="font-mono font-bold w-12 text-center text-slate-300">x = 1</div>
                      <div className="flex-1 text-sm text-slate-400">f''(1) = 2 (Positivo)</div>
                      <Smile className="text-neon-green w-6 h-6" />
                      <div className="text-neon-green font-bold text-sm">Mínimo Local</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teoría Kit 2 */}
            <div className="bg-dark-panel p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-neon-purple"></div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Info className="w-6 h-6 text-neon-purple" />
                Concavidad y Punto de Inflexión
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm md:text-base">
                La segunda derivada f''(x) revela hacia dónde se curva la función. El <strong>Punto de Inflexión</strong> NO es simplemente donde f''=0, sino donde ocurre un verdadero cambio estructural de concavidad (la f'' cambia de signo).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-bg p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-2">
                  <Frown className="w-8 h-8 text-neon-orange" />
                  <strong className="text-white">Cóncava Abajo (f'' &lt; 0)</strong>
                  <span className="text-slate-400 text-xs">Forma de campana. Los críticos aquí son máximos.</span>
                </div>
                <div className="bg-dark-bg p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-2">
                  <Smile className="w-8 h-8 text-neon-green" />
                  <strong className="text-white">Cóncava Arriba (f'' &gt; 0)</strong>
                  <span className="text-slate-400 text-xs">Forma de copa. Los críticos aquí son mínimos.</span>
                </div>
                <div className="bg-dark-bg p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-2">
                  <Activity className="w-8 h-8 text-neon-purple" />
                  <strong className="text-white">Punto de Inflexión</strong>
                  <span className="text-slate-400 text-xs">Transición donde f'' cambia de signo. Curva cambia de forma.</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
