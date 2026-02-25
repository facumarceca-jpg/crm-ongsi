import React, { useState, useMemo, useEffect } from 'react'
import {
    CreditCard, Users, Building2, Plus, Search,
    ChevronDown, ChevronUp, X, Phone, Mail,
    User, FileText, CalendarDays, Send, Trash2, Tag,
} from 'lucide-react'

// ─── Constantes ───────────────────────────────────────────────────
const TABS = [
    { id: 'ong', label: 'ONG', icon: Building2 },
    { id: 'individual', label: 'Individual', icon: CreditCard },
    { id: 'equipo', label: 'Equipo', icon: Users },
]

const ESTADOS_PLAN = ['Pendiente de Contacto', 'En Seguimiento', 'Activo', 'Rechazado']

const PRODUCTOS = [
    'Módulo Cultivo',
    'Módulo Médico / Paciente',
    'Equipos',
    'ONG',
    'Personalizado',
]

const ESTADO_COLOR = {
    'Activo': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'En Seguimiento': 'bg-blue-100    text-blue-700    dark:bg-blue-900/30 dark:text-blue-400',
    'Pendiente de Contacto': 'bg-amber-100   text-amber-700   dark:bg-amber-900/30 dark:text-amber-400',
    'Rechazado': 'bg-red-100     text-red-700     dark:bg-red-900/30 dark:text-red-400',
}

const LS_KEYS = { ong: 'crm_planes_ong', individual: 'crm_planes_individual', equipo: 'crm_planes_equipo' }

function load(key) { try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] } }
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)) }

// ─── Sub-componentes del detalle ──────────────────────────────────
function Section({ title, children }) {
    return (
        <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</h4>
            {children}
        </div>
    )
}

function InfoRow({ icon: Icon, label, value, href }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                {href
                    ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">{value}</a>
                    : <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{value || '—'}</p>
                }
            </div>
        </div>
    )
}

// ─── Panel de detalle (tipo NgoModal) ─────────────────────────────
function PlanModal({ tipo, plan, onSave, onClose }) {
    const [form, setForm] = useState({ ...plan })
    const [noteText, setNoteText] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [onClose])

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleSave = () => {
        setSaving(true)
        onSave(form)
        setTimeout(() => setSaving(false), 500)
    }

    const handleAddNote = () => {
        if (!noteText.trim()) return
        const newNote = { id: `n${Date.now()}`, texto: noteText.trim(), fecha: new Date().toISOString() }
        const updated = { ...form, notas: [...(form.notas || []), newNote] }
        setForm(updated)
        onSave(updated)
        setNoteText('')
    }

    const handleDeleteNote = (id) => {
        const updated = { ...form, notas: (form.notas || []).filter(n => n.id !== id) }
        setForm(updated)
        onSave(updated)
    }

    const fmtDate = (iso) => {
        if (!iso) return ''
        return new Date(iso).toLocaleString('es-AR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
    }

    const tipoLabel = TABS.find(t => t.id === tipo)?.label ?? tipo

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-full sm:max-w-xl bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700 gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLOR[form.estado] ?? ''}`}>
                                {form.estado}
                            </span>
                            <span className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full font-medium">
                                {tipoLabel}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                            {tipo === 'equipo' && form.organizacion ? form.organizacion : form.nombre}
                        </h2>
                        {tipo === 'equipo' && form.organizacion && (
                            <p className="text-sm text-slate-400">{form.nombre}</p>
                        )}
                    </div>
                    <button onClick={onClose} className="btn-ghost p-2 mt-1"><X className="w-5 h-5" /></button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    <Section title="Información de Contacto">
                        <div className="space-y-3">
                            <InfoRow icon={Phone} label="Teléfono" value={form.telefono}
                                href={form.telefono ? `tel:${form.telefono}` : null} />
                            <InfoRow icon={Mail} label="Email" value={form.email}
                                href={form.email ? `mailto:${form.email}` : null} />
                            {tipo === 'equipo' && (
                                <InfoRow icon={Users} label="Cantidad de Personas" value={form.cantPersonas ? `${form.cantPersonas} personas` : null} />
                            )}
                        </div>
                    </Section>

                    <Section title="Datos del Plan">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                    <Tag className="w-3.5 h-3.5" /> Producto de Interés
                                </label>
                                <div className="relative">
                                    <select value={form.plan || ''} onChange={e => set('plan', e.target.value)} className="select w-full pr-8 appearance-none">
                                        {PRODUCTOS.map(p => <option key={p}>{p}</option>)}
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" /> Persona de Contacto
                                </label>
                                <input type="text" value={form.personaContacto || ''} onChange={e => set('personaContacto', e.target.value)}
                                    placeholder="Nombre y apellido" className="input" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monto (ARS)</label>
                                <input type="number" value={form.monto || ''} onChange={e => set('monto', e.target.value)}
                                    placeholder="0" min="0" className="input" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Vencimiento</label>
                                <input type="date" value={form.fechaVencimiento || ''} onChange={e => set('fechaVencimiento', e.target.value)} className="input" />
                            </div>
                        </div>
                    </Section>

                    <Section title="Estado y Seguimiento">
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estado</label>
                                <div className="flex flex-wrap gap-2">
                                    {ESTADOS_PLAN.map(est => (
                                        <button key={est} onClick={() => set('estado', est)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.estado === est
                                                ? 'bg-brand-600 text-white border-brand-600'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-400 dark:hover:border-brand-500'
                                                }`}>
                                            {est}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                    <CalendarDays className="w-3.5 h-3.5" /> Fecha de Próxima Acción
                                </label>
                                <input type="date" value={form.proximaAccion || ''} onChange={e => set('proximaAccion', e.target.value)} className="input" />
                            </div>
                        </div>
                    </Section>

                    <Section title={`Historial de Notas (${(form.notas || []).length})`}>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAddNote() }}
                                    placeholder="Escribí una nota... (Ctrl+Enter para guardar)"
                                    rows={3} className="input resize-none flex-1" />
                                <button onClick={handleAddNote} disabled={!noteText.trim()}
                                    className="btn-primary px-3 py-2 self-end disabled:opacity-40 disabled:cursor-not-allowed">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            {(form.notas || []).length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">Sin notas todavía. ¡Agregá la primera! 📝</p>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                    {[...(form.notas || [])].reverse().map(nota => (
                                        <div key={nota.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 group relative">
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{nota.texto}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-xs text-slate-400">{fmtDate(nota.fecha)}</p>
                                                <button onClick={() => handleDeleteNote(nota.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-0.5">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2">
                        {saving
                            ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Guardando...</>
                            : <><FileText className="w-4 h-4" />Guardar Cambios</>
                        }
                    </button>
                </div>
            </div>
        </>
    )
}

// ─── Modal formulario para crear ──────────────────────────────────
function AddPlanModal({ tipo, onSave, onClose }) {
    const [form, setForm] = useState({
        nombre: '', email: '', telefono: '', plan: PRODUCTOS[0],
        monto: '', estado: 'Pendiente de Contacto',
        fechaInicio: new Date().toISOString().slice(0, 10),
        fechaVencimiento: '', proximaAccion: '', personaContacto: '', notas: [],
        ...(tipo === 'equipo' ? { organizacion: '', cantPersonas: '' } : {}),
    })
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Nuevo Plan — {TABS.find(t => t.id === tipo)?.label}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none">✕</button>
                </div>
                <form onSubmit={e => { e.preventDefault(); onSave({ ...form, id: crypto.randomUUID() }) }} className="p-6 space-y-4">
                    {tipo === 'equipo' && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Organización *</label>
                            <input value={form.organizacion ?? ''} onChange={e => set('organizacion', e.target.value)}
                                className="input w-full" placeholder="Nombre de la organización" required />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre del Contacto *</label>
                        <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                            className="input w-full" placeholder="Nombre completo" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                                className="input w-full" placeholder="email@ejemplo.com" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Teléfono</label>
                            <input value={form.telefono} onChange={e => set('telefono', e.target.value)}
                                className="input w-full" placeholder="+54 11..." />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Producto de Interés *</label>
                            <select value={form.plan} onChange={e => set('plan', e.target.value)} className="input w-full" required>
                                {PRODUCTOS.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Monto (ARS)</label>
                            <input type="number" value={form.monto} onChange={e => set('monto', e.target.value)}
                                className="input w-full" placeholder="0" min="0" />
                        </div>
                    </div>
                    {tipo === 'equipo' && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Cantidad de Personas</label>
                            <input type="number" value={form.cantPersonas ?? ''} onChange={e => set('cantPersonas', e.target.value)}
                                className="input w-full" placeholder="Nro de usuarios" min="1" />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Estado</label>
                            <select value={form.estado} onChange={e => set('estado', e.target.value)} className="input w-full">
                                {ESTADOS_PLAN.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Próxima Acción</label>
                            <input type="date" value={form.proximaAccion} onChange={e => set('proximaAccion', e.target.value)} className="input w-full" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
                        <button type="submit" className="btn-primary flex-1">Crear Plan</button>
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
    const [adding, setAdding] = useState(false)
    const [selected, setSelected] = useState(null)

    const lsKey = LS_KEYS[tipo]

    const handleSave = (plan) => {
        const updated = planes.some(p => p.id === plan.id)
            ? planes.map(p => p.id === plan.id ? plan : p)
            : [...planes, plan]
        setPlanes(updated)
        save(lsKey, updated)
        setAdding(false)
        if (selected?.id === plan.id) setSelected(plan)
    }

    const handleDelete = (id, e) => {
        e?.stopPropagation()
        if (!window.confirm('¿Eliminar este plan?')) return
        const updated = planes.filter(p => p.id !== id)
        setPlanes(updated)
        save(lsKey, updated)
        if (selected?.id === id) setSelected(null)
    }

    const toggleSort = (k) => {
        if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortKey(k); setSortDir('asc') }
    }

    const filtered = useMemo(() => planes
        .filter(p => {
            const q = search.toLowerCase()
            return (!q || [p.nombre, p.email, p.telefono, p.organizacion, p.plan].some(v => v?.toLowerCase().includes(q)))
                && (filterEstado === 'Todos' || p.estado === filterEstado)
        })
        .sort((a, b) => {
            const v1 = (a[sortKey] ?? '').toString().toLowerCase()
            const v2 = (b[sortKey] ?? '').toString().toLowerCase()
            return sortDir === 'asc' ? v1.localeCompare(v2) : v2.localeCompare(v1)
        }), [planes, search, filterEstado, sortKey, sortDir])

    const SortIcon = ({ k }) => sortKey === k
        ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
        : null

    const stats = useMemo(() => ({
        total: planes.length,
        activos: planes.filter(p => p.estado === 'Activo').length,
        pendientes: planes.filter(p => p.estado === 'Pendiente').length,
        mrr: planes.filter(p => p.estado === 'Activo').reduce((s, p) => s + (+p.monto || 0), 0),
    }), [planes])

    const alertas = useMemo(() => planes.filter(p =>
        p.proximaAccion && new Date(p.proximaAccion) <= new Date() && p.estado !== 'Cancelado'
    ).length, [planes])

    return (
        <>
            {/* Stats */}
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

            {/* Alerta seguimiento */}
            {alertas > 0 && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                        {alertas} plan{alertas > 1 ? 'es' : ''} con seguimiento vencido o pendiente hoy
                    </p>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="input pl-9 w-full" />
                </div>
                <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="input">
                    <option value="Todos">Todos los estados</option>
                    {ESTADOS_PLAN.map(s => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nuevo Plan
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                {tipo === 'equipo' && (
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('organizacion')}>
                                        <span className="flex items-center gap-1">Organización <SortIcon k="organizacion" /></span>
                                    </th>
                                )}
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('nombre')}>
                                    <span className="flex items-center gap-1">Contacto <SortIcon k="nombre" /></span>
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('plan')}>
                                    <span className="flex items-center gap-1">Producto <SortIcon k="plan" /></span>
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('estado')}>
                                    <span className="flex items-center gap-1">Estado <SortIcon k="estado" /></span>
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Próx. Acción</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Notas</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={tipo === 'equipo' ? 7 : 6} className="text-center py-12 text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <CreditCard className="w-8 h-8 opacity-30" />
                                            <p>No hay planes cargados aún.</p>
                                            <button onClick={() => setAdding(true)} className="text-brand-600 dark:text-brand-400 text-sm hover:underline">+ Agregar el primero</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(p => {
                                const vencida = p.proximaAccion && new Date(p.proximaAccion) < new Date()
                                return (
                                    <tr key={p.id} onClick={() => setSelected(p)}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
                                        {tipo === 'equipo' && (
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white max-w-[140px] truncate">{p.organizacion || '—'}</td>
                                        )}
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-900 dark:text-white truncate max-w-[160px]">{p.nombre}</div>
                                            {p.email && <div className="text-xs text-slate-400 truncate">{p.email}</div>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex px-2 py-0.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-xs font-semibold">
                                                {p.plan}
                                                {tipo === 'equipo' && p.cantPersonas ? ` · ${p.cantPersonas}p` : ''}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLOR[p.estado] ?? ''}`}>
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs whitespace-nowrap">
                                            {p.proximaAccion
                                                ? <span className={vencida ? 'text-red-500 font-semibold' : 'text-slate-500 dark:text-slate-400'}>
                                                    {new Date(p.proximaAccion).toLocaleDateString('es-AR')}
                                                </span>
                                                : <span className="text-slate-300 dark:text-slate-600">—</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold ${(p.notas || []).length > 0 ? 'text-brand-600 dark:text-brand-400' : 'text-slate-300 dark:text-slate-600'}`}>
                                                {(p.notas || []).length}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                            <button onClick={e => handleDelete(p.id, e)}
                                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
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

            {adding && <AddPlanModal tipo={tipo} onSave={handleSave} onClose={() => setAdding(false)} />}
            {selected && (
                <PlanModal
                    tipo={tipo}
                    plan={selected}
                    onSave={p => handleSave(p)}
                    onClose={() => setSelected(null)}
                />
            )}
        </>
    )
}

// ─── Vista principal ──────────────────────────────────────────────
export default function PlansView() {
    const [activeTab, setActiveTab] = useState('ong')
    const [planesData, setPlanesData] = useState({
        ong: () => load(LS_KEYS.ong),
        individual: () => load(LS_KEYS.individual),
        equipo: () => load(LS_KEYS.equipo),
    })

    // Cargo una sola vez al montar
    const [ong, setOng] = useState(() => load(LS_KEYS.ong))
    const [individual, setIndividual] = useState(() => load(LS_KEYS.individual))
    const [equipo, setEquipo] = useState(() => load(LS_KEYS.equipo))

    const tabData = { ong, individual, equipo }
    const tabSetters = { ong: setOng, individual: setIndividual, equipo: setEquipo }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-brand-600" />
                    Planes TrazAPP
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                    Seguimiento de abonos por tipo de cliente.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 w-fit">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    const count = tabData[tab.id].length
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-400 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}>
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            {count > 0 && (
                                <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-1.5 py-0.5 rounded-full">
                                    {count}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            <PlanesTable tipo={activeTab} planes={tabData[activeTab]} setPlanes={tabSetters[activeTab]} />
        </div>
    )
}
