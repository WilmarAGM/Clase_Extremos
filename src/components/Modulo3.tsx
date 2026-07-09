import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceDot, ReferenceArea, ReferenceLine } from 'recharts'
import { Hammer, Info, Lock, Trophy, AlertTriangle } from 'lucide-react'
import katex from 'katex'
import clsx from 'clsx'

export default function Modulo3() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({
    '-2.5': false,
    '-1': false,
    '1': false,
    '2.5': false
  })

  // Taller Analítico State
  const [tallerAnswers, setTallerAnswers] = useState({
    criticos: '',
    inflexion: '',
    max: '',
    min: ''
  })
  const [tallerStatus, setTallerStatus] = useState<null | 'success' | 'error'>(null)

  const handleVerifyTaller = () => {
    const norm = (str: string) => str.replace(/\s/g, '').split(',').filter(Boolean).sort().join(',')
    const c = norm(tallerAnswers.criticos)
    const i = norm(tallerAnswers.inflexion)
    
    if (
      c === '0,3' && 
      i === '0,2' && 
      tallerAnswers.max.trim() === '15' && 
      tallerAnswers.min.trim() === '-17'
    ) {
      setTallerStatus('success')
    } else {
      setTallerStatus('error')
    }
  }

  // Taller Final State
  const [taller2Answers, setTaller2Answers] = useState({
    criticos: '',
    inflexion: '',
    max: '',
    min: ''
  })
  const [taller2Status, setTaller2Status] = useState<null | 'success' | 'error'>(null)

  const handleVerifyTaller2 = () => {
    const norm = (str: string) => str.replace(/\s/g, '').split(',').filter(Boolean).sort().join(',')
    const c = norm(taller2Answers.criticos)
    const i = norm(taller2Answers.inflexion)
    
    if (
      c === '-1,1' && 
      i === '0' && 
      taller2Answers.max.trim() === '1' && 
      taller2Answers.min.trim() === '-1'
    ) {
      setTaller2Status('success')
    } else {
      setTaller2Status('error')
    }
  }

  // Math Setup: f(x) = x^3/3 - x
  const f = (x: number) => Math.pow(x, 3) / 3 - x

  const data = useMemo(() => {
    const pts = []
    // Extra data outside domain to show the "cut" visually
    for (let x = -3; x <= 3; x += 0.1) {
      pts.push({
        x: Number(x.toFixed(2)),
        fx: f(x),
        isInside: x >= -2.5 && x <= 2.5
      })
    }
    return pts
  }, [])

  // Math Setup Taller 2: h(x) = x * sqrt(2 - x^2)
  const data2 = useMemo(() => {
    const pts = []
    const limit = Math.sqrt(2) // ~1.414
    for (let x = -limit; x <= limit + 0.01; x += 0.05) {
      let xVal = x;
      if (x > limit) xVal = limit;
      
      const val2 = 2 - xVal * xVal;
      if (val2 < 0) continue;

      const hx = xVal * Math.sqrt(val2)
      let dhx = null
      let ddhx = null
      
      if (val2 > 0.05) { // avoid division by zero near boundaries for derivatives
        dhx = (2 * (1 - xVal * xVal)) / Math.sqrt(val2)
        ddhx = (-4 * xVal) / Math.pow(val2, 1.5)
        
        // Cap extreme derivative values for charting
        if (dhx > 15) dhx = 15;
        if (dhx < -15) dhx = -15;
        if (ddhx > 30) ddhx = 30;
        if (ddhx < -30) ddhx = -30;
      }
      
      pts.push({ x: Number(xVal.toFixed(2)), hx, dhx, ddhx })
    }
    return pts
  }, [])

  const suspects = [
    { id: '-2.5', label: 'Borde Izquierdo (a)', type: 'Borde', x: -2.5, color: 'text-neon-orange', border: 'border-neon-orange' },
    { id: '-1', label: 'Número Crítico', type: 'Crítico (Máx Rel)', x: -1, color: 'text-neon-cyan', border: 'border-neon-cyan' },
    { id: '1', label: 'Número Crítico', type: 'Crítico (Mín Rel)', x: 1, color: 'text-neon-cyan', border: 'border-neon-cyan' },
    { id: '2.5', label: 'Borde Derecho (b)', type: 'Borde', x: 2.5, color: 'text-neon-green', border: 'border-neon-green' }
  ]

  const allRevealed = Object.values(revealed).every(Boolean)

  const handleReveal = (id: string) => {
    setRevealed(prev => ({ ...prev, [id]: true }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 pb-20"
    >
      <header className="flex items-center gap-4">
        <div className="p-3 bg-neon-purple/10 rounded-xl border border-neon-purple/30">
          <Hammer className="w-8 h-8 text-neon-purple" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Extremos Globales</h2>
          <p className="text-slate-400 mt-1">El Teorema del Valor Extremo (TVE)</p>
        </div>
      </header>

      {/* Header and TVE Theory */}
      <div className="bg-gradient-to-br from-[#1a1b26] to-dark-bg p-8 rounded-3xl border border-neon-cyan/30 shadow-[0_0_20px_rgba(0,255,255,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-neon-cyan"></div>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 bg-neon-cyan/20 rounded-2xl shrink-0">
            <Info className="w-10 h-10 text-neon-cyan" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">¿Por qué usar el TVE?</h2>
            <p className="text-slate-300 leading-relaxed text-lg mb-5">
              Si una función <span className="text-neon-cyan font-bold">f es continua</span> en un <span className="text-neon-purple font-bold">intervalo cerrado [a, b]</span>, el TVE nos garantiza que la función alcanzará obligatoriamente un <strong>Máximo Absoluto</strong> (el punto más alto) y un <strong>Mínimo Absoluto</strong> (el punto más bajo) dentro de ese intervalo.
            </p>
            <div className="bg-dark-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-4">
              <AlertTriangle className="text-neon-orange w-8 h-8 shrink-0" />
              <p className="text-sm text-slate-400">
                <strong>¿Dónde se esconden los extremos globales?</strong><br/>
                Solo pueden estar en dos lugares: en los <span className="text-neon-cyan font-bold">números críticos dentro de [a, b]</span> o en los <span className="text-neon-orange font-bold">bordes del intervalo (a y b)</span>. ¡Estos forman nuestra lista oficial de sospechosos!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Area */}
        <div className="bg-dark-panel p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Hammer className="text-neon-cyan w-5 h-5" /> Análisis Visual en [-2.5, 2.5]
          </h3>
          <div className="flex-1 min-h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                <XAxis dataKey="x" type="number" domain={[-3, 3]} stroke="#888" tick={{fontSize: 10}} />
                <YAxis stroke="#888" width={30} tick={{fontSize: 10}} />
                
                {/* Sombrear las áreas fuera del dominio para dar efecto de "corte" */}
                <ReferenceArea x1={-3} x2={-2.5} fill="#000" fillOpacity={0.8} />
                <ReferenceArea x1={2.5} x2={3} fill="#000" fillOpacity={0.8} />
                
                {/* Bordes del intervalo */}
                <ReferenceLine x={-2.5} stroke="var(--color-neon-orange)" strokeWidth={2} strokeDasharray="5 5" label={{ position: 'top', value: 'a = -2.5', fill: '#ff4500', fontSize: 12, fontWeight: 'bold' }} />
                <ReferenceLine x={2.5} stroke="var(--color-neon-green)" strokeWidth={2} strokeDasharray="5 5" label={{ position: 'top', value: 'b = 2.5', fill: '#39ff14', fontSize: 12, fontWeight: 'bold' }} />

                <Line type="monotone" dataKey="fx" stroke="var(--color-neon-cyan)" strokeWidth={4} dot={false} isAnimationActive={false} />
                
                {/* Plot Suspects as dots if revealed */}
                {suspects.map(s => revealed[s.id] && (
                  <ReferenceDot 
                    key={s.id} 
                    x={s.x} 
                    y={f(s.x)} 
                    r={8} 
                    fill="#1a1b26" 
                    stroke={(s.x === -2.5 || s.x === 2.5) ? (s.x === -2.5 ? '#ff4500' : '#39ff14') : '#00ffff'} 
                    strokeWidth={3} 
                    label={{ position: s.x < 0 ? 'bottom' : 'top', value: `f(${s.x}) = ${f(s.x).toFixed(2)}`, fill: 'white', fontSize: 12, fontWeight: 'bold' }} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tablero de Sospechosos */}
        <div className="bg-dark-panel p-6 rounded-3xl border border-white/5 shadow-xl space-y-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">Tablero de Sospechosos</h3>
          <p className="text-sm text-slate-400 mb-4">Evalúa f(x) en cada sospechoso para encontrar su altura exacta. El mayor valor será el Máximo Global y el menor el Mínimo Global.</p>
          
          <div className="grid grid-cols-1 gap-4 flex-1">
            {suspects.map(s => {
              const isRevealed = revealed[s.id];
              const val = f(s.x);
              return (
                <div key={s.id} className={clsx("p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between transition-all duration-300 gap-4", isRevealed ? `bg-dark-bg ${s.border}` : "bg-dark-bg/50 border-white/10 hover:border-white/30")}>
                  <div>
                    <div className={clsx("text-xs font-bold mb-1 uppercase tracking-wider", s.color)}>{s.type}</div>
                    <div className="text-xl font-mono text-white">x = {s.x}</div>
                  </div>
                  
                  {isRevealed ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl">
                      <span className="text-slate-400 font-mono text-sm">f({s.x}) =</span>
                      <span className={clsx("text-3xl font-bold font-mono", s.color)}>{val.toFixed(2)}</span>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={() => handleReveal(s.id)}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock size={18} /> Revelar Altura
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Resultados (Solo visible cuando todos están revelados) */}
      <AnimatePresence>
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            className="bg-gradient-to-r from-neon-green/20 via-neon-cyan/20 to-neon-purple/20 p-8 md:p-12 rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] text-center relative overflow-hidden mt-8"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple"></div>
            <Trophy className="w-20 h-20 mx-auto mb-6 text-yellow-400 drop-shadow-[0_0_20px_rgba(253,224,71,0.6)] animate-pulse" />
            <h3 className="text-3xl font-bold text-white mb-3">¡Veredicto Final!</h3>
            <p className="text-slate-200 text-lg mb-8 max-w-2xl mx-auto">Al comparar a todos los sospechosos de la lista, hemos encontrado a los ganadores globales absolutos de la función en el intervalo cerrado.</p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <div className="bg-dark-bg/90 backdrop-blur px-8 py-8 rounded-2xl border-2 border-neon-green/50 shadow-[0_0_30px_rgba(57,255,20,0.2)] transform hover:scale-105 transition-transform flex-1 max-w-sm">
                <div className="text-sm text-neon-green font-bold uppercase tracking-widest mb-3">Máximo Global</div>
                <div className="text-5xl font-bold text-white mb-2">2.71 <span className="text-2xl text-slate-400 font-normal">m</span></div>
                <div className="text-slate-400 text-sm">Ocurre en el borde <span className="text-neon-green font-bold text-base">x = 2.5</span></div>
              </div>
              
              <div className="bg-dark-bg/90 backdrop-blur px-8 py-8 rounded-2xl border-2 border-neon-orange/50 shadow-[0_0_30px_rgba(255,69,0,0.2)] transform hover:scale-105 transition-transform flex-1 max-w-sm">
                <div className="text-sm text-neon-orange font-bold uppercase tracking-widest mb-3">Mínimo Global</div>
                <div className="text-5xl font-bold text-white mb-2">-2.71 <span className="text-2xl text-slate-400 font-normal">m</span></div>
                <div className="text-slate-400 text-sm">Ocurre en el borde <span className="text-neon-orange font-bold text-base">x = -2.5</span></div>
              </div>
            </div>
            
            <div className="mt-10 p-6 bg-black/40 rounded-2xl text-sm md:text-base text-slate-300 max-w-4xl mx-auto border border-white/5 leading-relaxed text-left">
              <strong className="text-neon-cyan text-lg block mb-2">Lección del Detective Analítico:</strong> 
              Como puedes observar, aunque <span className="font-mono text-neon-cyan">x = -1</span> y <span className="font-mono text-neon-cyan">x = 1</span> eran las "cimas" y "valles" locales, la función creció y bajó tanto en los extremos del intervalo que los <strong>bordes superaron a los puntos críticos</strong>. 
              <br/><br/>
              ¡Por eso el <strong>Teorema del Valor Extremo</strong> nos exige incluir siempre los bordes del intervalo en nuestra investigación! Un extremo local no siempre es el ganador global de la competencia.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taller Analítico Avanzado */}
      <div className="bg-dark-panel p-8 md:p-10 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden mt-16">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-orange"></div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Hammer className="text-neon-orange w-6 h-6" /> Taller Analítico Avanzado
        </h3>
        
        <div className="bg-dark-bg p-6 rounded-2xl border border-white/5 mb-8">
          <p className="text-slate-300 mb-4">Dada la siguiente función y sus derivadas (pre-calculadas para ti), analiza el intervalo cerrado <strong className="text-neon-cyan">[-1, 4]</strong>:</p>
          <div className="space-y-3 bg-black/40 p-5 rounded-xl border border-white/10 text-white overflow-x-auto overflow-y-hidden">
            <div dangerouslySetInnerHTML={{ __html: katex.renderToString(String.raw`g(x) = x^4 - 4x^3 + 10`, { displayMode: true, throwOnError: false }) }} />
            <div className="text-neon-green" dangerouslySetInnerHTML={{ __html: katex.renderToString(String.raw`g'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)`, { displayMode: true, throwOnError: false }) }} />
            <div className="text-neon-purple" dangerouslySetInnerHTML={{ __html: katex.renderToString(String.raw`g''(x) = 12x^2 - 24x = 12x(x - 2)`, { displayMode: true, throwOnError: false }) }} />
          </div>
          <p className="text-sm text-slate-400 mt-4 italic">Pista: Evalúa el signo de las derivadas para confirmar si un número donde la derivada es cero realmente representa un extremo o un punto de inflexión. ¡No te dejes engañar!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">1. Puntos Críticos (separados por coma)</label>
            <input 
              type="text" 
              placeholder="Ej: -2, 5"
              value={tallerAnswers.criticos}
              onChange={e => {setTallerAnswers({...tallerAnswers, criticos: e.target.value}); setTallerStatus(null)}}
              className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">2. Puntos de Inflexión (separados por coma)</label>
            <input 
              type="text" 
              placeholder="Ej: -2, 5"
              value={tallerAnswers.inflexion}
              onChange={e => {setTallerAnswers({...tallerAnswers, inflexion: e.target.value}); setTallerStatus(null)}}
              className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">3. Valor del Máximo Global</label>
            <input 
              type="text" 
              placeholder="Ej: 100"
              value={tallerAnswers.max}
              onChange={e => {setTallerAnswers({...tallerAnswers, max: e.target.value}); setTallerStatus(null)}}
              className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">4. Valor del Mínimo Global</label>
            <input 
              type="text" 
              placeholder="Ej: -50"
              value={tallerAnswers.min}
              onChange={e => {setTallerAnswers({...tallerAnswers, min: e.target.value}); setTallerStatus(null)}}
              className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
            />
          </div>
        </div>

        <button 
          onClick={handleVerifyTaller}
          className="w-full py-4 bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/50 text-neon-cyan font-bold rounded-xl transition-colors"
        >
          Verificar Análisis
        </button>

        {tallerStatus === 'error' && (
          <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="mt-4 p-4 bg-neon-orange/20 border border-neon-orange/50 text-neon-orange rounded-xl text-center font-medium">
            Algunos valores no son correctos o te faltó algún punto. Revisa tus cálculos. (Recuerda evaluar la función g(x) en los sospechosos y bordes).
          </motion.div>
        )}

        {tallerStatus === 'success' && (
          <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="mt-4 p-6 bg-neon-green/20 border border-neon-green/50 text-neon-green rounded-xl text-center">
            <h4 className="text-xl font-bold mb-2">¡Misión Cumplida, Detective!</h4>
            <p className="text-sm text-slate-300 text-left">
              Efectivamente:<br/><br/>
              - <strong>Críticos:</strong> x = 0 y x = 3.<br/>
              - <strong>Inflexión:</strong> x = 0 y x = 2. Nota que en x=0, la derivada g'(0)=0, pero g'(x) no cambia de signo (es negativo antes y después), por lo que x=0 <strong>es un punto de inflexión con tangente horizontal</strong>, ¡no un extremo local!<br/>
              - <strong>Máximo Global:</strong> Es 15, y ocurre en el borde x = -1.<br/>
              - <strong>Mínimo Global:</strong> Es -17, y ocurre en el crítico x = 3.
            </p>
          </motion.div>
        )}
      </div>

      {/* Taller Final: La Prueba Máxima */}
      <div className="bg-dark-panel p-8 md:p-10 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden mt-16">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-neon-cyan"></div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Trophy className="text-neon-green w-6 h-6" /> El Reto Final: La Función Restringida
        </h3>
        
        <div className="bg-dark-bg p-6 rounded-2xl border border-white/5 mb-8">
          <p className="text-slate-300 mb-4">Dada la siguiente función y sus derivadas, analiza su dominio y encuentra los extremos:</p>
          <div className="space-y-3 bg-black/40 p-5 rounded-xl border border-white/10 text-white overflow-x-auto overflow-y-hidden">
            <div dangerouslySetInnerHTML={{ __html: katex.renderToString(String.raw`h(x) = x\sqrt{2 - x^2}`, { displayMode: true, throwOnError: false }) }} />
            <div className="text-neon-green" dangerouslySetInnerHTML={{ __html: katex.renderToString(String.raw`h'(x) = \frac{2(1 - x^2)}{\sqrt{2 - x^2}}`, { displayMode: true, throwOnError: false }) }} />
            <div className="text-neon-purple" dangerouslySetInnerHTML={{ __html: katex.renderToString(String.raw`h''(x) = \frac{-4x}{(2 - x^2)^{3/2}}`, { displayMode: true, throwOnError: false }) }} />
          </div>
          <p className="text-sm text-slate-400 mt-4 italic">Pista: El dominio natural es donde (2 - x²) ≥ 0, es decir [-√2, √2]. Los bordes son sospechosos. Ingresa solo las respuestas enteras (-1, 0, 1) y obvia los bordes irracionales en la lista de críticos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">1. Puntos Críticos Internos (enteros)</label>
            <input 
              type="text" 
              placeholder="Ej: -5, 5"
              value={taller2Answers.criticos}
              onChange={e => {setTaller2Answers({...taller2Answers, criticos: e.target.value}); setTaller2Status(null)}}
              className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">2. Puntos de Inflexión</label>
            <input 
              type="text" 
              placeholder="Ej: 0"
              value={taller2Answers.inflexion}
              onChange={e => {setTaller2Answers({...taller2Answers, inflexion: e.target.value}); setTaller2Status(null)}}
              className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">3. Máximo Global</label>
            <input 
              type="text" 
              placeholder="Ej: 10"
              value={taller2Answers.max}
              onChange={e => {setTaller2Answers({...taller2Answers, max: e.target.value}); setTaller2Status(null)}}
              className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">4. Mínimo Global</label>
            <input 
              type="text" 
              placeholder="Ej: -10"
              value={taller2Answers.min}
              onChange={e => {setTaller2Answers({...taller2Answers, min: e.target.value}); setTaller2Status(null)}}
              className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
        </div>

        <button 
          onClick={handleVerifyTaller2}
          className="w-full py-4 bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green/50 text-neon-green font-bold rounded-xl transition-colors"
        >
          Desbloquear Panel de Control Visual
        </button>

        {taller2Status === 'error' && (
          <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="mt-4 p-4 bg-neon-orange/20 border border-neon-orange/50 text-neon-orange rounded-xl text-center font-medium">
            Análisis incorrecto. Revisa las raíces de h'(x) y h''(x) y evalúa h(x) para encontrar los extremos.
          </motion.div>
        )}

        {/* Panel de Control Visual Revelado */}
        <AnimatePresence>
          {taller2Status === 'success' && (
            <motion.div 
              initial={{opacity: 0, height: 0, y: 20}} 
              animate={{opacity: 1, height: 'auto', y: 0}} 
              className="mt-12 space-y-6"
            >
              <div className="text-center mb-8">
                <h4 className="text-3xl font-bold text-neon-green mb-2">¡Desbloqueo Maestro!</h4>
                <p className="text-slate-300">Aquí tienes el análisis visual completo de h(x) y sus derivadas, generado a partir de tus cálculos correctos.</p>
              </div>

              {/* h(x) */}
              <div className="bg-dark-bg p-6 rounded-2xl border border-white/10 h-[300px] relative">
                <span className="absolute top-4 left-4 text-xs font-bold text-neon-cyan bg-black/50 px-2 py-1 rounded z-10">Ubicación h(x)</span>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data2} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                    <XAxis dataKey="x" type="number" domain={[-1.5, 1.5]} hide />
                    <YAxis stroke="#888" width={30} tick={{fontSize: 10}} domain={[-1.5, 1.5]} />
                    
                    <Line type="monotone" dataKey="hx" stroke="var(--color-neon-cyan)" strokeWidth={4} dot={false} animationDuration={2000} />
                    
                    <ReferenceDot x={-1} y={-1} r={6} fill="var(--color-neon-orange)" stroke="white" strokeWidth={2} label={{ position: 'bottom', value: 'Min Global (-1, -1)', fill: '#fff', fontSize: 12 }} />
                    <ReferenceDot x={1} y={1} r={6} fill="var(--color-neon-green)" stroke="white" strokeWidth={2} label={{ position: 'top', value: 'Max Global (1, 1)', fill: '#fff', fontSize: 12 }} />
                    <ReferenceDot x={0} y={0} r={6} fill="var(--color-neon-purple)" stroke="white" strokeWidth={2} label={{ position: 'bottom', value: 'Inflexión (0, 0)', fill: '#fff', fontSize: 12 }} />
                    
                    <ReferenceLine x={-1} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                    <ReferenceLine x={1} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                    <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* h'(x) */}
                <div className="bg-dark-bg p-6 rounded-2xl border border-white/10 h-[250px] relative">
                  <span className="absolute top-4 left-4 text-xs font-bold text-neon-green bg-black/50 px-2 py-1 rounded z-10">Inclinación h'(x)</span>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data2} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                      <XAxis dataKey="x" type="number" domain={[-1.5, 1.5]} stroke="#888" tick={{fontSize: 10}} />
                      <YAxis stroke="#888" width={30} tick={{fontSize: 10}} domain={[-4, 4]} />
                      
                      <ReferenceArea y1={0} y2={4} ifOverflow="hidden" fill="#39ff14" fillOpacity={0.15} />
                      <ReferenceArea y1={-4} y2={0} ifOverflow="hidden" fill="#ff4500" fillOpacity={0.15} />
                      
                      <ReferenceLine x={-1} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                      <ReferenceLine x={1} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />

                      <Line type="monotone" dataKey="dhx" stroke="var(--color-neon-green)" strokeWidth={2} dot={false} animationDuration={2000} />
                      <ReferenceDot x={-1} y={0} r={6} fill="var(--color-neon-orange)" stroke="white" strokeWidth={2} label={{ position: 'bottom', value: "h'(-1) = 0", fill: '#fff', fontSize: 12, fontWeight: 'bold' }} />
                      <ReferenceDot x={1} y={0} r={6} fill="var(--color-neon-green)" stroke="white" strokeWidth={2} label={{ position: 'top', value: "h'(1) = 0", fill: '#fff', fontSize: 12, fontWeight: 'bold' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* h''(x) */}
                <div className="bg-dark-bg p-6 rounded-2xl border border-white/10 h-[250px] relative">
                  <span className="absolute top-4 left-4 text-xs font-bold text-neon-purple bg-black/50 px-2 py-1 rounded z-10">Concavidad h''(x)</span>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data2} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                      <XAxis dataKey="x" type="number" domain={[-1.5, 1.5]} stroke="#888" tick={{fontSize: 10}} />
                      <YAxis stroke="#888" width={30} tick={{fontSize: 10}} domain={[-10, 10]} />
                      
                      <ReferenceArea y1={0} y2={10} ifOverflow="hidden" fill="#39ff14" fillOpacity={0.15} />
                      <ReferenceArea y1={-10} y2={0} ifOverflow="hidden" fill="#ff4500" fillOpacity={0.15} />
                      
                      <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />

                      <Line type="monotone" dataKey="ddhx" stroke="var(--color-neon-purple)" strokeWidth={2} dot={false} animationDuration={2000} />
                      <ReferenceDot x={0} y={0} r={6} fill="var(--color-neon-purple)" stroke="white" strokeWidth={2} label={{ position: 'bottom', value: "h''(0) = 0", fill: '#fff', fontSize: 12, fontWeight: 'bold' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
