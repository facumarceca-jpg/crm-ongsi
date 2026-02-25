import React, { useState, useMemo, useRef } from 'react'
import {
    CreditCard, Users, Plus, Pencil, Trash2, Search,
    CheckCircle2, Clock, XCircle, ChevronUp, ChevronDown,
    Phone, Mail, Banknote, Calendar
} from 'lucide-react'

// ─── Constantes ───────────────────────────────────────────────────
const ESTADOS = ['Activo', 'Pendiente', 'Vencido', 'Cancelado']
const TIPOS_PLAN_INDIVIDUAL = ['Básico', 'Pro', 'Premium']
const TIPOS_PLAN_EQUIPO = ['Starter', 'Business', 'Enterprise']

const ESTADO_COLOR = {
    Activo: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Pendiente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Vencido: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Cancelado: 'bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400',
}

const ESTADO_ICON = {
    Activo: CheckCircle2,
    Pendiente: Clock,
    Vencido: XCircle,
    Cancelado: XCircle,
}

const LS_KEY_IND = 'crm_planes_individual'
const LS_KEY_EQ = 'crm_planes_equipo'

function loadFromLS(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function saveToLS(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}

// ─── Modal para agregar / editar ──────────────────────────────────
function PlanModal({ tipo, plan, onSave, onClose }) {
    const tiposPlan = tipo === 'individual' ? TIPOS_PLAN_INDIVIDUAL : TIPOS_PLAN_EQUIPO
    const [form, setForm] = useState(plan ?? {
        nombre: '', contacto: '', email: '', telefono: '',
        plan: tiposPlan[0], monto: '', estado: 'Activo',
        fechaInicio: new Date().toISOString().slice(0, 10),
        fechaVencimiento: '', notas: '',
        ...(tipo === 'equipo' ? { organizacion: '', cantPersonas: '' } : {}),
    })

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({ ...form, id: plan?.id || crypto.randomUUID() })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {plan ? 'Editar' : 'Nuevo'} Plan {tipo === 'individual' ? 'Individual' : 'Equipo'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {tipo === 'equipo' && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Organización *</label>
                            <input value={form.organizacion ?? ''} onChange={e => set('organizacion', e.target.value)}
                                className="input w-full" placeholder="Nombre de la organización" required />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nombre del Contacto *</label>
                        <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                            className="input w-full" placeholder="Nombre completo" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Email</label>
                            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                                className="input w-full" placeholder="email@ejemplo.com" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Teléfono</label>
                            <input value={form.telefono} onChange={e => set('telefono', e.target.value)}
                                className="input w-full" placeholder="+54 11..." />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Plan *</label>
                            <select value={form.plan} onChange={e => set('plan', e.target.value)} className="input w-full" required>
                                {tiposPlan.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Monto (ARS)</label>
                            <input type="number" value={form.monto} onChange={e => set('monto', e.target.value)}
                                className="input w-full" placeholder="0" min="0" />
                        </div>
                    </div>
                    {tipo === 'equipo' && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Cantidad de Personas</label>
                            <input type="number" value={form.cantPersonas ?? ''} onChange={e => set('cantPersonas', e.target.value)}
                                className="input w-full" placeholder="Nro de usuarios" min="1" />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Fecha Inicio</label>
                            <input type="date" value={form.fechaInicio} onChange={e => set('fechaInicio', e.target.value)} className="input w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Vencimiento</label>
                            <input type="date" value={form.fechaVencimiento} onChange={e => set('fechaVencimiento', e.target.value)} className="input w-full" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Estado</label>
                        <select value={form.estado} onChange={e => set('estado', e.target.value)} className="input w-full">
                            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Notas</label>
                        <textarea value={form.notas} onChange={e => set('notas', e.target.value)}
                            className="input w-full resize-none" rows={2} placeholder="Observaciones..." />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
                        <button type="submit" className="btn-primary flex-1">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Tabla de planes ──────────────────────────────────────────────
function PlanesTable({ tipo, planes, setPlanes }) {
    const [search, setSearch] = useState('')
    const [filterEstado, setFilterEstado] = useState('Todos')
    const [sortKey, setSortKey] = useState('nombre')
    const [sortDir, setSortDir] = useState('asc')
    const [editing, setEditing] = useState(null)
    const [adding, setAdding] = useState(false)

    const lsKey = tipo === 'individual' ? LS_KEY_IND : LS_KEY_EQ

    const handleSave = (plan) => {
        const updated = editing
            ? planes.map(p => p.id === plan.id ? plan : p)
            : [...planes, plan]
        setPlanes(updated)
        saveToLS(lsKey, updated)
        setEditing(null)
        setAdding(false)
    }

    const handleDelete = (id) => {
        if (!window.confirm('¿Eliminar este plan?')) return
        const updated = planes.filter(p => p.id !== id)
        setPlanes(updated)
        saveToLS(lsKey, updated)
    }

    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortKey(key); setSortDir('asc') }
    }

    const filtered = useMemo(() => {
        return planes
            .filter(p => {
                const q = search.toLowerCase()
                const matchSearch = !q || [p.nombre, p.email, p.telefono, p.organizacion, p.plan]
                    .some(v => v?.toLowerCase().includes(q))
                const matchEstado = filterEstado === 'Todos' || p.estado === filterEstado
                return matchSearch && matchEstado
            })
            .sort((a, b) => {
                const v1 = (a[sortKey] ?? '').toString().toLowerCase()
                const v2 = (b[sortKey] ?? '').toString().toLowerCase()
                return sortDir === 'asc' ? v1.localeCompare(v2) : v2.localeCompare(v1)
            })
    }, [planes, search, filterEstado, sortKey, sortDir])

    const SortIcon = ({ k }) => {
        if (sortKey !== k) return null
        return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
    }

    const stats = useMemo(() => ({
        total: planes.length,
        activos: planes.filter(p => p.estado === 'Activo').length,
        pendientes: planes.filter(p => p.estado === 'Pendiente').length,
        mrr: planes.filter(p => p.estado === 'Activo').reduce((s, p) => s + (+p.monto || 0), 0),
    }), [planes])

    return (
        <>
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total', value: stats.total, color: 'text-slate-900 dark:text-white' },
                    { label: 'Activos', value: stats.activos, color: 'text-emerald-600 dark:text-emerald-400' },
                    { label: 'Pendientes', value: stats.pendientes, color: 'text-amber-600 dark:text-amber-400' },
                    { label: 'MRR Activo', value: `$${stats.mrr.toLocaleString('es-AR')}`, color: 'text-brand-600 dark:text-brand-400' },
                ].map(c => (
                    <div key={c.label} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{c.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Barra de herramientas */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar nombre, email, plan..."
                        className="input pl-9 w-full"
                    />
                </div>
                <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="input">
                    <option value="Todos">Todos los estados</option>
                    {ESTADOS.map(s => <option key={s}>{s}</option>)}
                </select>
                <button
                    onClick={() => setAdding(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Plan
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                {tipo === 'equipo' && (
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort('organizacion')}>
                                        <span className="flex items-center gap-1">Organización <SortIcon k="organizacion" /></span>
                                    </th>
                                )}
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort('nombre')}>
                                    <span className="flex items-center gap-1">Contacto <SortIcon k="nombre" /></span>
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort('plan')}>
                                    <span className="flex items-center gap-1">Plan <SortIcon k="plan" /></span>
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort('monto')}>
                                    <span className="flex items-center gap-1">Monto <SortIcon k="monto" /></span>
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort('estado')}>
                                    <span className="flex items-center gap-1">Estado <SortIcon k="estado" /></span>
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Vencimiento</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={tipo === 'equipo' ? 7 : 6} className="text-center py-12 text-slate-400 dark:text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <CreditCard className="w-8 h-8 opacity-30" />
                                            <p>No hay planes cargados aún.</p>
                                            <button onClick={() => setAdding(true)} className="text-brand-600 dark:text-brand-400 text-sm hover:underline">+ Agregar el primero</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(p => {
                                const EstIcon = ESTADO_ICON[p.estado] ?? Clock
                                const vencido = p.fechaVencimiento && new Date(p.fechaVencimiento) < new Date()
                                return (
                                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        {tipo === 'equipo' && (
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white max-w-[160px] truncate">
                                                {p.organizacion || '—'}
                                            </td>
                                        )}
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-900 dark:text-white truncate max-w-[150px]">{p.nombre}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                {p.email && <><Mail className="w-3 h-3" />{p.email}</>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-xs font-semibold">
                                                {p.plan}
                                                {tipo === 'equipo' && p.cantPersonas ? ` · ${p.cantPersonas}p` : ''}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {p.monto ? `$${(+p.monto).toLocaleString('es-AR')}` : '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLOR[p.estado]}`}>
                                                <EstIcon className="w-3 h-3" />
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                            {p.fechaVencimiento
                                                ? <span className={vencido && p.estado === 'Activo' ? 'text-red-500 font-semibold' : ''}>
                                                    {new Date(p.fechaVencimiento).toLocaleDateString('es-AR')}
                                                </span>
                                                : '—'
                                            }
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 justify-end">
                                                <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {filtered.length > 0 && (
                    <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
                        {filtered.length} de {planes.length} planes
                    </div>
                )}
            </div>

            {/* Modales */}
            {(adding || editing) && (
                <PlanModal
                    tipo={tipo}
                    plan={editing}
                    onSave={handleSave}
                    onClose={() => { setAdding(false); setEditing(null) }}
                />
            )}
        </>
    )
}

// ─── Vista principal ──────────────────────────────────────────────
export default function PlansView() {
    const [activeTab, setActiveTab] = useState('individual')
    const [indPlanes, setIndPlanes] = useState(() => loadFromLS(LS_KEY_IND))
    const [eqPlanes, setEqPlanes] = useState(() => loadFromLS(LS_KEY_EQ))

    return (
        <div>
            {/* Encabezado */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-brand-600" />
                    Planes TrazAPP
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                    Gestioná abonos individuales y de equipos para tus clientes.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 w-fit">
                <button
                    onClick={() => setActiveTab('individual')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'individual'
                            ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    <CreditCard className="w-4 h-4" />
                    Individual
                    <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-1.5 py-0.5 rounded-full">
                        {indPlanes.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('equipo')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'equipo'
                            ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    <Users className="w-4 h-4" />
                    Equipo
                    <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-1.5 py-0.5 rounded-full">
                        {eqPlanes.length}
                    </span>
                </button>
            </div>

            {/* Contenido del tab */}
            {activeTab === 'individual' && (
                <PlanesTable tipo="individual" planes={indPlanes} setPlanes={setIndPlanes} />
            )}
            {activeTab === 'equipo' && (
                <PlanesTable tipo="equipo" planes={eqPlanes} setPlanes={setEqPlanes} />
            )}
        </div>
    )
}
