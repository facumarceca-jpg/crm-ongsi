import React, { useState, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useApp } from '../store/AppContext'
import { getCoords, PROVINCE_CAPITALS } from '../data/cityCoords'
import RecorridoModal from './RecorridoModal'
import StatusBadge from './StatusBadge'
import {
    Route, Building2, TrendingUp, Target, Star,
    MapPin, CheckCircle2, Clock, Activity, XCircle, Eye
} from 'lucide-react'

// Marker colours by status
const STATUS_COLOR = {
    'Pendiente': { fill: '#f59e0b', stroke: '#d97706' },
    'En Seguimiento': { fill: '#3b82f6', stroke: '#2563eb' },
    'Activa': { fill: '#10b981', stroke: '#059669' },
    'Rechazada': { fill: '#ef4444', stroke: '#dc2626' },
}

const STATUS_FILTERS = [
    { id: 'Pendiente', label: 'Pendiente', icon: Clock, color: 'bg-amber-400' },
    { id: 'En Seguimiento', label: 'En Seguimiento', icon: Activity, color: 'bg-blue-500' },
    { id: 'Activa', label: 'Activa', icon: CheckCircle2, color: 'bg-emerald-500' },
    { id: 'Rechazada', label: 'Rechazada', icon: XCircle, color: 'bg-red-500' },
]

function ProgressBar({ value, max, color = 'bg-brand-500' }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0
    return (
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
                className={`h-2 rounded-full transition-all duration-700 ${color}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    )
}

function StatPill({ label, value, color }) {
    return (
        <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${color}`}>
            <span className="text-xs font-medium">{label}</span>
            <span className="text-sm font-bold">{value}</span>
        </div>
    )
}

export default function MapView({ onOpenOng }) {
    const { ongs } = useApp()
    const [activeStatuses, setActiveStatuses] = useState(new Set(['Pendiente', 'En Seguimiento', 'Activa', 'Rechazada']))
    const [showRecorrido, setShowRecorrido] = useState(false)
    const [recorridoOng, setRecorridoOng] = useState(null)

    const toggleStatus = (s) => {
        setActiveStatuses(prev => {
            const n = new Set(prev)
            n.has(s) ? n.delete(s) : n.add(s)
            return n
        })
    }

    // ── Stats ────────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const total = ongs.length
        const contactadas = ongs.filter(o => o.estado !== 'Pendiente').length
        const activas = ongs.filter(o => o.estado === 'Activa').length
        const pct = total > 0 ? Math.round((contactadas / total) * 100) : 0

        // By province
        const byProv = {}
        ongs.forEach(o => {
            if (!byProv[o.provincia]) byProv[o.provincia] = { total: 0, contactadas: 0, pendientes: 0 }
            byProv[o.provincia].total++
            if (o.estado !== 'Pendiente') byProv[o.provincia].contactadas++
            if (o.estado === 'Pendiente') byProv[o.provincia].pendientes++
        })

        // Top provinces by total ONGs (sorted)
        const topProvs = Object.entries(byProv)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 6)

        // Level calculation (gamification)
        let level = 1, title = 'Semillero'
        if (pct >= 80) { level = 5; title = 'Maestro Cannábico 🌟' }
        else if (pct >= 60) { level = 4; title = 'Cultivador Avanzado 🌿' }
        else if (pct >= 40) { level = 3; title = 'Activista 🔥' }
        else if (pct >= 20) { level = 2; title = 'Contactando 🌱' }

        return { total, contactadas, activas, pct, byProv, topProvs, level, title }
    }, [ongs])

    // ── Filtered markers ─────────────────────────────────────────────────────
    const markers = useMemo(() => {
        return ongs
            .filter(o => activeStatuses.has(o.estado))
            .map(o => ({ ...o, coords: getCoords(o.ciudad, o.provincia) }))
            .filter(o => o.coords)
    }, [ongs, activeStatuses])

    const handleRecorridoOng = (ong) => {
        setRecorridoOng(ong)
        setShowRecorrido(true)
    }

    return (
        <div className="space-y-5 h-full">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mapa de ONGs</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        {markers.length} organizaciones visibles · Argentina
                    </p>
                </div>
                <button
                    onClick={() => { setRecorridoOng(null); setShowRecorrido(true) }}
                    className="btn-primary flex items-center gap-2 flex-shrink-0"
                >
                    <Route className="w-4 h-4" />
                    + Iniciar Recorrido
                </button>
            </div>

            <div className="flex gap-5" style={{ minHeight: '75vh' }}>
                {/* ── LEFT PANEL: Gamification ─────────────────────────────── */}
                <div className="w-72 flex-shrink-0 space-y-4 overflow-y-auto">

                    {/* Level card */}
                    <div className="card p-5 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-300" />
                            <span className="text-xs font-semibold text-brand-100">Nivel {stats.level}</span>
                        </div>
                        <p className="font-bold text-lg leading-tight">{stats.title}</p>
                        <p className="text-brand-100 text-xs mt-1 mb-3">
                            {stats.contactadas} de {stats.total} contactadas
                        </p>
                        <ProgressBar value={stats.contactadas} max={stats.total} color="bg-white/80" />
                        <p className="text-right text-xs text-brand-100 mt-1">{stats.pct}% completado</p>
                    </div>

                    {/* Quick stats */}
                    <div className="card p-4 space-y-2">
                        <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Resumen</h4>
                        <StatPill label="🟡 Pendientes" value={ongs.filter(o => o.estado === 'Pendiente').length} color="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200" />
                        <StatPill label="🔵 En Seguimiento" value={ongs.filter(o => o.estado === 'En Seguimiento').length} color="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200" />
                        <StatPill label="🟢 Activas" value={stats.activas} color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200" />
                        <StatPill label="🔴 Rechazadas" value={ongs.filter(o => o.estado === 'Rechazada').length} color="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200" />
                    </div>

                    {/* Province ranking */}
                    <div className="card p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-brand-600" />
                            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Provincias — oportunidades</h4>
                        </div>
                        <div className="space-y-3">
                            {stats.topProvs.map(([prov, data], idx) => {
                                const pct = data.total > 0 ? Math.round((data.contactadas / data.total) * 100) : 0
                                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`
                                return (
                                    <div key={prov}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                <span>{medal}</span>
                                                <span className="truncate max-w-[120px]">{prov}</span>
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-slate-400">{pct}%</span>
                                                <span className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-1.5 rounded-full font-semibold">
                                                    {data.pendientes} pend.
                                                </span>
                                            </div>
                                        </div>
                                        <ProgressBar
                                            value={data.contactadas}
                                            max={data.total}
                                            color={pct >= 60 ? 'bg-emerald-500' : pct >= 30 ? 'bg-blue-500' : 'bg-amber-400'}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Filter by status */}
                    <div className="card p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-brand-600" />
                            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Filtrar mapa</h4>
                        </div>
                        <div className="space-y-2">
                            {STATUS_FILTERS.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => toggleStatus(f.id)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${activeStatuses.has(f.id)
                                        ? 'border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-400 opacity-50'
                                        }`}
                                >
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${f.color}`} />
                                    {f.label}
                                    <span className="ml-auto text-slate-400">
                                        {ongs.filter(o => o.estado === f.id).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="card p-4">
                        <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Leyenda</h4>
                        <p className="text-xs text-slate-400">Hacé click en cualquier marcador del mapa para ver el detalle de la ONG y acceder a opciones rápidas.</p>
                    </div>
                </div>

                {/* ── MAP ──────────────────────────────────────────────────── */}
                <div className="flex-1 card overflow-hidden" style={{ minHeight: '70vh' }}>
                    <MapContainer
                        center={[-38.4161, -63.6167]}
                        zoom={5}
                        style={{ height: '100%', width: '100%', minHeight: '70vh' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {markers.map(ong => {
                            const col = STATUS_COLOR[ong.estado] || STATUS_COLOR['Pendiente']
                            return (
                                <CircleMarker
                                    key={ong.id}
                                    center={[ong.coords.lat, ong.coords.lng]}
                                    radius={7}
                                    fillColor={col.fill}
                                    color={col.stroke}
                                    weight={2}
                                    opacity={1}
                                    fillOpacity={0.85}
                                >
                                    <Popup minWidth={220}>
                                        <div className="space-y-2 py-1">
                                            <div className="flex items-start gap-2">
                                                <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm leading-tight">{ong.nombre}</p>
                                                    <p className="text-xs text-slate-500">{ong.ciudad}, {ong.provincia}</p>
                                                </div>
                                            </div>
                                            <StatusBadge estado={ong.estado} />
                                            {ong.direccion && (
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {ong.direccion}
                                                </p>
                                            )}
                                            {ong.telefono && (
                                                <a href={`tel:${ong.telefono}`} className="text-xs text-brand-600 hover:underline block">
                                                    📞 {ong.telefono}
                                                </a>
                                            )}
                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    onClick={() => onOpenOng(ong)}
                                                    className="flex-1 flex items-center justify-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1.5 rounded-lg font-medium transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> Ver detalle
                                                </button>
                                                <button
                                                    onClick={() => handleRecorridoOng(ong)}
                                                    className="flex-1 flex items-center justify-center gap-1 text-xs bg-brand-600 hover:bg-brand-700 text-white px-2 py-1.5 rounded-lg font-medium transition-colors"
                                                >
                                                    <Route className="w-3.5 h-3.5" /> Ir aquí
                                                </button>
                                            </div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            )
                        })}
                    </MapContainer>
                </div>
            </div>

            {/* Recorrido Modal */}
            {showRecorrido && (
                <RecorridoModal
                    onClose={() => { setShowRecorrido(false); setRecorridoOng(null) }}
                    initialOng={recorridoOng}
                />
            )}
        </div>
    )
}
