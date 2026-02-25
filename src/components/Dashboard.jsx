import React, { useMemo } from 'react'
import { useApp } from '../store/AppContext'
import StatusBadge from './StatusBadge'
import {
    Building2,
    PhoneCall,
    TrendingUp,
    CalendarClock,
    ArrowRight,
    Leaf,
} from 'lucide-react'

function KpiCard({ icon: Icon, label, value, sub, color }) {
    return (
        <div className="card p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
                {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    )
}

export default function Dashboard({ setActiveView, onOpenOng }) {
    const { ongs } = useApp()

    const stats = useMemo(() => {
        const total = ongs.length
        const activas = ongs.filter(o => o.estado === 'Activa').length
        const contactadas = ongs.filter(o => o.estado !== 'Pendiente').length
        const conversion = total > 0 ? Math.round((activas / total) * 100) : 0

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const weekAhead = new Date(today)
        weekAhead.setDate(weekAhead.getDate() + 7)

        const upcoming = ongs
            .filter(o => {
                if (!o.proximaAccion) return false
                const d = new Date(o.proximaAccion)
                return d >= today && d <= weekAhead
            })
            .sort((a, b) => new Date(a.proximaAccion) - new Date(b.proximaAccion))

        return { total, activas, contactadas, conversion, upcoming }
    }, [ongs])

    const fmt = (iso) => {
        if (!iso) return '—'
        return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Resumen general de tu pipeline de ONGs cannábicas
                </p>
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard
                    icon={Building2}
                    label="Total ONGs"
                    value={stats.total}
                    sub="En base de datos"
                    color="bg-brand-600"
                />
                <KpiCard
                    icon={PhoneCall}
                    label="Contactadas"
                    value={stats.contactadas}
                    sub="Estado ≠ Pendiente"
                    color="bg-blue-500"
                />
                <KpiCard
                    icon={Leaf}
                    label="Activas"
                    value={stats.activas}
                    sub="Clientes cerrados"
                    color="bg-emerald-500"
                />
                <KpiCard
                    icon={TrendingUp}
                    label="Conversión"
                    value={`${stats.conversion}%`}
                    sub="Activas / Total"
                    color="bg-violet-500"
                />
            </div>

            {/* Upcoming tasks */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-brand-600" />
                        <h3 className="font-semibold text-slate-900 dark:text-white">Próximas Acciones</h3>
                        <span className="text-xs text-slate-400 ml-1">— próximos 7 días</span>
                    </div>
                    <button
                        onClick={() => setActiveView('Pendiente')}
                        className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                        Ver todo <ArrowRight className="w-3 h-3" />
                    </button>
                </div>

                {stats.upcoming.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">No hay acciones programadas para esta semana. 🌿</p>
                ) : (
                    <div className="space-y-3">
                        {stats.upcoming.map(ong => (
                            <div
                                key={ong.id}
                                onClick={() => onOpenOng(ong)}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
                                    <Leaf className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">{ong.nombre}</p>
                                    <p className="text-xs text-slate-400">{ong.provincia} · {ong.personaContacto || 'Sin contacto'}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StatusBadge estado={ong.estado} />
                                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{fmt(ong.proximaAccion)}</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick state overview */}
            <div className="card p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Estado del Pipeline</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {[
                        { label: 'Pendiente', color: 'bg-amber-500', count: ongs.filter(o => o.estado === 'Pendiente').length },
                        { label: 'En Seguimiento', color: 'bg-blue-500', count: ongs.filter(o => o.estado === 'En Seguimiento').length },
                        { label: 'Activa', color: 'bg-emerald-500', count: ongs.filter(o => o.estado === 'Activa').length },
                        { label: 'Rechazada', color: 'bg-red-500', count: ongs.filter(o => o.estado === 'Rechazada').length },
                    ].map(item => (
                        <div key={item.label} className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shadow-sm`}>
                                <span className="text-white font-bold text-lg">{item.count}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
