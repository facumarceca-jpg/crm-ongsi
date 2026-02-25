import React, { useState, useMemo } from 'react'
import { useApp } from '../store/AppContext'
import { PROVINCIAS } from '../data/mockData'
import {
    X, MapPin, Navigation, Search, Building2,
    ChevronDown, Clock, Route, CheckCircle2,
} from 'lucide-react'

const norm = (s) => s?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() ?? ''

export default function RecorridoModal({ onClose, initialOng }) {
    const { ongs, dispatch } = useApp()
    const [mode, setMode] = useState(initialOng ? 'ong' : 'zona') // 'ong' | 'zona'
    const [origen, setOrigen] = useState(() => localStorage.getItem('crm_origen') || '')
    const [search, setSearch] = useState(initialOng ? initialOng.nombre : '')
    const [selectedOng, setSelectedOng] = useState(initialOng || null)
    const [selectedProv, setSelectedProv] = useState('')
    const [selectedZonaOngs, setSelectedZonaOngs] = useState([])
    const [started, setStarted] = useState(false)

    // ── ONG search ──────────────────────────────────────────────────────────
    const ongResults = useMemo(() => {
        if (mode !== 'ong' || !search.trim()) return []
        const q = norm(search)
        return ongs
            .filter(o => norm(o.nombre).includes(q) || norm(o.ciudad).includes(q))
            .slice(0, 8)
    }, [ongs, search, mode])

    // ── Zone ONG list ────────────────────────────────────────────────────────
    const zonaOngs = useMemo(() => {
        if (!selectedProv) return []
        return ongs.filter(o => o.provincia === selectedProv && o.estado === 'Pendiente')
    }, [ongs, selectedProv])

    const toggleZonaOng = (ong) => {
        setSelectedZonaOngs(prev =>
            prev.find(o => o.id === ong.id)
                ? prev.filter(o => o.id !== ong.id)
                : [...prev, ong]
        )
    }

    // ── Build Google Maps URL ─────────────────────────────────────────────────
    const buildMapsUrl = () => {
        const targets = mode === 'ong'
            ? (selectedOng ? [selectedOng] : [])
            : selectedZonaOngs

        if (targets.length === 0) return null

        const encode = (o) => {
            const addr = o.direccion || `${o.ciudad}, ${o.provincia}, Argentina`
            return encodeURIComponent(addr)
        }

        if (targets.length === 1) {
            const dest = encode(targets[0])
            const base = `https://www.google.com/maps/dir/`
            return origen
                ? `${base}${encodeURIComponent(origen)}/${dest}`
                : `${base}/${dest}`
        }

        // Multi-stop: usar waypoints
        const [first, ...rest] = targets
        const waypoints = rest.map(o => encode(o)).join('/')
        const base = origen
            ? `https://www.google.com/maps/dir/${encodeURIComponent(origen)}`
            : `https://www.google.com/maps/dir`
        return `${base}/${encode(first)}/${waypoints}`
    }

    const canStart = mode === 'ong' ? !!selectedOng : selectedZonaOngs.length > 0
    const mapsUrl = buildMapsUrl()

    const handleStart = () => {
        if (!canStart) return

        // Guardar origen para la próxima vez
        if (origen) localStorage.setItem('crm_origen', origen)

        // Actualizar estado de ONG(s) a "En Seguimiento"
        const toUpdate = mode === 'ong' ? [selectedOng] : selectedZonaOngs
        toUpdate.forEach(o => {
            if (o.estado === 'Pendiente') {
                dispatch({ type: 'UPDATE_ONG', payload: { ...o, estado: 'En Seguimiento' } })
            }
        })

        // Abrir Google Maps
        if (mapsUrl) window.open(mapsUrl, '_blank')
        setStarted(true)
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                                <Route className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white text-lg">Iniciar Recorrido</h2>
                                <p className="text-xs text-slate-400">Planificá tu visita y actualizá el estado</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="btn-ghost p-2">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {started ? (
                            /* ── SUCCESS STATE ── */
                            <div className="text-center py-8 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">¡Recorrido iniciado!</h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Google Maps se abrió con tu ruta.
                                        {(mode === 'ong' ? [selectedOng] : selectedZonaOngs).filter(o => o.estado === 'Pendiente').length > 0 && (
                                            <> Las ONGs seleccionadas pasaron a <strong>En Seguimiento</strong>.</>
                                        )}
                                    </p>
                                </div>
                                <button onClick={onClose} className="btn-primary mx-auto">Cerrar</button>
                            </div>
                        ) : (
                            <>
                                {/* ── MODE TOGGLE ── */}
                                <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                    {[
                                        { id: 'ong', label: '📍 ONG puntual' },
                                        { id: 'zona', label: '🗺️ Zona / Provincia' },
                                    ].map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => { setMode(m.id); setSelectedOng(null); setSearch(''); setSelectedZonaOngs([]) }}
                                            className={`flex-1 py-2.5 text-sm font-semibold transition-all ${mode === m.id
                                                ? 'bg-brand-600 text-white'
                                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>

                                {/* ── ORIGEN ── */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <Navigation className="w-3.5 h-3.5" /> Desde (dirección de salida)
                                    </label>
                                    <input
                                        type="text"
                                        value={origen}
                                        onChange={e => setOrigen(e.target.value)}
                                        placeholder="Tu dirección o punto de partida..."
                                        className="input"
                                    />
                                    <p className="text-xs text-slate-400">Se guarda para la próxima vez</p>
                                </div>

                                {/* ── ONG PUNTUAL ── */}
                                {mode === 'ong' && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                            <Search className="w-3.5 h-3.5" /> Buscar ONG destino
                                        </label>
                                        {selectedOng ? (
                                            <div className="flex items-center gap-3 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-200 dark:border-brand-800">
                                                <Building2 className="w-5 h-5 text-brand-600 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{selectedOng.nombre}</p>
                                                    <p className="text-xs text-slate-400">{selectedOng.ciudad}, {selectedOng.provincia}</p>
                                                    {selectedOng.direccion && (
                                                        <p className="text-xs text-slate-500 mt-0.5 truncate">📍 {selectedOng.direccion}</p>
                                                    )}
                                                </div>
                                                <button onClick={() => { setSelectedOng(null); setSearch('') }} className="text-slate-400 hover:text-red-400">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        value={search}
                                                        onChange={e => setSearch(e.target.value)}
                                                        placeholder="Nombre o ciudad..."
                                                        className="input pl-9"
                                                        autoFocus
                                                    />
                                                </div>
                                                {ongResults.length > 0 && (
                                                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
                                                        {ongResults.map(o => (
                                                            <button
                                                                key={o.id}
                                                                onClick={() => { setSelectedOng(o); setSearch(o.nombre) }}
                                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
                                                            >
                                                                <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{o.nombre}</p>
                                                                    <p className="text-xs text-slate-400">{o.ciudad}, {o.provincia} · {o.estado}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* ── ZONA / PROVINCIA ── */}
                                {mode === 'zona' && (
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" /> Elegí la provincia a trabajar
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedProv}
                                                onChange={e => { setSelectedProv(e.target.value); setSelectedZonaOngs([]) }}
                                                className="select w-full appearance-none pr-8"
                                            >
                                                <option value="">— Seleccionar provincia —</option>
                                                {PROVINCIAS.map(p => <option key={p}>{p}</option>)}
                                            </select>
                                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>

                                        {selectedProv && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-slate-500">
                                                        {zonaOngs.length} ONGs <strong>pendientes</strong> en {selectedProv}
                                                    </p>
                                                    {zonaOngs.length > 0 && (
                                                        <button
                                                            onClick={() => setSelectedZonaOngs(selectedZonaOngs.length === zonaOngs.length ? [] : [...zonaOngs])}
                                                            className="text-xs text-brand-600 hover:underline"
                                                        >
                                                            {selectedZonaOngs.length === zonaOngs.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700 max-h-48 overflow-y-auto">
                                                    {zonaOngs.length === 0 ? (
                                                        <p className="text-center text-sm text-slate-400 py-6">No hay ONGs pendientes en esta provincia 🎉</p>
                                                    ) : zonaOngs.map(o => {
                                                        const sel = selectedZonaOngs.find(s => s.id === o.id)
                                                        return (
                                                            <button
                                                                key={o.id}
                                                                onClick={() => toggleZonaOng(o)}
                                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${sel ? 'bg-brand-50 dark:bg-brand-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                                            >
                                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${sel ? 'bg-brand-600 border-brand-600' : 'border-slate-300 dark:border-slate-600'}`}>
                                                                    {sel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{o.nombre}</p>
                                                                    <p className="text-xs text-slate-400">{o.ciudad} {o.direccion ? `· ${o.direccion}` : ''}</p>
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                                {selectedZonaOngs.length > 1 && (
                                                    <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2">
                                                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                                        Google Maps abrirá con {selectedZonaOngs.length} paradas en tu ruta
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {!started && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={handleStart}
                                disabled={!canStart}
                                className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Navigation className="w-5 h-5" />
                                Iniciar Ruta en Google Maps
                            </button>
                            {canStart && (
                                <p className="text-xs text-center text-slate-400 mt-2">
                                    Las ONGs pendientes pasarán automáticamente a "En Seguimiento"
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
