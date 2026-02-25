import React, { useState, useMemo } from 'react'
import { useApp } from '../store/AppContext'
import StatusBadge from './StatusBadge'
import { Search, Filter, ChevronRight, Building2, MapPin, Plus } from 'lucide-react'
import { PROVINCIAS } from '../data/mockData'

const ALL_ESTADOS = ['Todos', 'Pendiente', 'En Seguimiento', 'Activa', 'Rechazada']

// Remove accents/diacritics so "bahia" matches "Bahía", "cordoba" matches "Córdoba", etc.
const norm = (str) =>
    str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() ?? ''

export default function NgoTable({ filterEstado, onOpenOng, onAddOng }) {
    const { ongs } = useApp()
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState(filterEstado || 'Todos')
    const [provFilter, setProvFilter] = useState('Todas')
    const [cityFilter, setCityFilter] = useState('Todas')

    // Sync external filter (from sidebar nav)
    React.useEffect(() => {
        setStatusFilter(filterEstado || 'Todos')
    }, [filterEstado])

    // Reset city filter when province changes
    const handleProvChange = (e) => {
        setProvFilter(e.target.value)
        setCityFilter('Todas')
    }

    // Build dynamic city list based on selected province
    const availableCities = useMemo(() => {
        const source = provFilter === 'Todas'
            ? ongs
            : ongs.filter(o => o.provincia === provFilter)
        const cities = [...new Set(source.map(o => o.ciudad).filter(Boolean))].sort()
        return cities
    }, [ongs, provFilter])

    const filtered = useMemo(() => {
        const q = norm(search)
        return ongs.filter(o => {
            const matchSearch = !q ||
                norm(o.nombre).includes(q) ||
                norm(o.ciudad).includes(q) ||
                norm(o.provincia).includes(q)
            const matchStatus = statusFilter === 'Todos' || o.estado === statusFilter
            const matchProv = provFilter === 'Todas' || o.provincia === provFilter
            const matchCity = cityFilter === 'Todas' || o.ciudad === cityFilter
            return matchSearch && matchStatus && matchProv && matchCity
        })
    }, [ongs, search, statusFilter, provFilter, cityFilter])

    const fmt = (iso) => {
        if (!iso) return <span className="text-slate-300 dark:text-slate-600">—</span>
        return new Date(iso + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {statusFilter !== 'Todos' ? statusFilter : 'Directorio de ONGs'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        {filtered.length} registro{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                    </p>
                </div>
                {onAddOng && (
                    <button
                        onClick={onAddOng}
                        className="btn-primary flex items-center gap-2 flex-shrink-0 mt-1"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva ONG
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col gap-3">
                    {/* Row 1: search + status */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o ciudad..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="input pl-9"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="select"
                            >
                                {ALL_ESTADOS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Row 2: province + city */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center gap-2 flex-1">
                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <select
                                value={provFilter}
                                onChange={handleProvChange}
                                className="select flex-1"
                            >
                                <option value="Todas">Todas las provincias</option>
                                {PROVINCIAS.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 opacity-50" />
                            <select
                                value={cityFilter}
                                onChange={e => setCityFilter(e.target.value)}
                                className="select flex-1"
                                disabled={availableCities.length === 0}
                            >
                                <option value="Todas">
                                    {provFilter === 'Todas'
                                        ? 'Todas las localidades'
                                        : `Todas (${availableCities.length} localidades)`}
                                </option>
                                {availableCities.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active filter chips */}
                    {(provFilter !== 'Todas' || cityFilter !== 'Todas' || statusFilter !== 'Todos' || search) && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {search && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                                    🔍 "{search}"
                                    <button onClick={() => setSearch('')} className="hover:text-brand-900 ml-0.5 font-bold">×</button>
                                </span>
                            )}
                            {statusFilter !== 'Todos' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    Estado: {statusFilter}
                                    <button onClick={() => setStatusFilter('Todos')} className="hover:text-blue-900 ml-0.5 font-bold">×</button>
                                </span>
                            )}
                            {provFilter !== 'Todas' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                    📍 {provFilter}
                                    <button onClick={() => { setProvFilter('Todas'); setCityFilter('Todas') }} className="hover:text-emerald-900 ml-0.5 font-bold">×</button>
                                </span>
                            )}
                            {cityFilter !== 'Todas' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                                    🏘️ {cityFilter}
                                    <button onClick={() => setCityFilter('Todas')} className="hover:text-violet-900 ml-0.5 font-bold">×</button>
                                </span>
                            )}
                            <button
                                onClick={() => { setSearch(''); setStatusFilter('Todos'); setProvFilter('Todas'); setCityFilter('Todas') }}
                                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                            >
                                Limpiar todo
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center py-16 text-slate-400">
                        <Building2 className="w-10 h-10 mb-3 opacity-30" />
                        <p className="font-medium">No se encontraron ONGs</p>
                        <p className="text-sm">Ajustá los filtros para ver resultados</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Nombre</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estado</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden md:table-cell">Ubicación</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden lg:table-cell">Próximo Contacto</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filtered.map(ong => (
                                    <tr
                                        key={ong.id}
                                        onClick={() => onOpenOng(ong)}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
                                                    <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{ong.nombre}</p>
                                                    <p className="text-xs text-slate-400">{ong.personaContacto || 'Sin contacto'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge estado={ong.estado} />
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <p className="text-slate-700 dark:text-slate-300">{ong.ciudad}</p>
                                            <p className="text-xs text-slate-400">{ong.provincia}</p>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell text-slate-600 dark:text-slate-400">
                                            {fmt(ong.proximaAccion)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 transition-colors inline-block" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
