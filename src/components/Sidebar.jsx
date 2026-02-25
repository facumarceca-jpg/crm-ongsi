import React from 'react'
import {
    LayoutDashboard,
    Building2,
    CheckCircle2,
    Clock,
    Activity,
    XCircle,
    Leaf,
    Sun,
    Moon,
    Map,
} from 'lucide-react'

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mapa', label: 'Mapa', icon: Map },
    { id: 'all', label: 'ONGs', icon: Building2 },
    { id: 'Activa', label: 'Activas', icon: CheckCircle2 },
    { id: 'Pendiente', label: 'Pendientes', icon: Clock },
    { id: 'En Seguimiento', label: 'En Seguimiento', icon: Activity },
    { id: 'Rechazada', label: 'Rechazadas', icon: XCircle },
]

export default function Sidebar({ activeView, setActiveView, dark, toggleDark, counts }) {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col z-30">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-none">CannaCRM</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Trazabilidad Genética</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon
                    const count = item.id !== 'dashboard' && item.id !== 'all' && item.id !== 'mapa'
                        ? counts[item.id] ?? 0
                        : item.id === 'all'
                            ? counts.total
                            : null
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`sidebar-link w-full ${activeView === item.id ? 'active' : ''}`}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1 text-left">{item.label}</span>
                            {count !== null && count > 0 && (
                                <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-semibold">
                                    {count}
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Bottom: scraper note + dark mode */}
            <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <div className="px-3 py-2 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                    <p className="text-xs text-brand-700 dark:text-brand-400 font-medium">Fuente de datos</p>
                    <a
                        href="https://marimba.com.ar/categoria/asociaciones-ong-cannabis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-600 dark:text-brand-500 hover:underline break-all"
                    >
                        marimba.com.ar
                    </a>
                </div>
                <button
                    onClick={toggleDark}
                    className="btn-ghost w-full flex items-center gap-2 text-sm"
                >
                    {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {dark ? 'Modo Claro' : 'Modo Oscuro'}
                </button>
            </div>
        </aside>
    )
}
