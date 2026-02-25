import React from 'react'

const CONFIG = {
    Activa: { label: 'Activa', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    'En Seguimiento': { label: 'En Seguimiento', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    Pendiente: { label: 'Pendiente', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    Rechazada: { label: 'Rechazada', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

export default function StatusBadge({ estado }) {
    const cfg = CONFIG[estado] ?? { label: estado, cls: 'bg-slate-100 text-slate-600' }
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.cls}`}>
            {cfg.label}
        </span>
    )
}

export { CONFIG as STATUS_CONFIG }
