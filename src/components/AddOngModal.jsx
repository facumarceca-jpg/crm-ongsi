import React, { useState, useEffect } from 'react'
import { useApp } from '../store/AppContext'
import { LICENCIAS, ESTADOS, PROVINCIAS } from '../data/mockData'
import {
    X,
    Phone,
    Mail,
    MapPin,
    Instagram,
    User,
    FileText,
    Globe,
    Tag,
    ChevronDown,
    Building2,
    Plus,
} from 'lucide-react'

const ESTADO_LIST = Object.values(ESTADOS)

const EMPTY_ONG = {
    nombre: '',
    estado: ESTADOS.PENDIENTE,
    provincia: '',
    ciudad: '',
    direccion: '',
    telefono: '',
    email: '',
    instagram: '',
    sitioWeb: '',
    tipoLicencia: 'Ninguna',
    personaContacto: '',
    proximaAccion: '',
    notas: [],
    scraped: false,
    marimbaUrl: '',
}

function Field({ label, icon: Icon, children }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
            </label>
            {children}
        </div>
    )
}

export default function AddOngModal({ onClose, onCreated }) {
    const { ongs, dispatch } = useApp()
    const [form, setForm] = useState({ ...EMPTY_ONG })
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [onClose])

    const set = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
    }

    const validate = () => {
        const errs = {}
        if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio'
        if (!form.provincia) errs.provincia = 'Seleccioná una provincia'
        return errs
    }

    const handleSave = () => {
        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        setSaving(true)
        // Generate next ID
        const maxId = ongs.reduce((max, o) => Math.max(max, parseInt(o.id) || 0), 0)
        // Convert optional initial note to note object
        const initialNotes = form._notaInicial?.trim()
            ? [{ id: `n${Date.now()}`, texto: form._notaInicial.trim(), fecha: new Date().toISOString() }]
            : []
        const { _notaInicial, ...rest } = form
        const newOng = {
            ...rest,
            id: String(maxId + 1),
            nombre: form.nombre.trim(),
            ciudad: form.ciudad.trim(),
            direccion: form.direccion.trim(),
            notas: initialNotes,
        }
        dispatch({ type: 'ADD_ONG', payload: newOng })
        setTimeout(() => {
            setSaving(false)
            onCreated?.(newOng)
            onClose()
        }, 500)
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nueva ONG</h2>
                            <p className="text-sm text-slate-400">Carga manual de organización</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-ghost p-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Identificación */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Identificación</h4>

                        <Field label="Nombre de la organización *" icon={Building2}>
                            <input
                                type="text"
                                value={form.nombre}
                                onChange={e => set('nombre', e.target.value)}
                                placeholder="Ej: Cannábica del Sur"
                                className={`input ${errors.nombre ? 'border-red-400 focus:ring-red-400' : ''}`}
                                autoFocus
                            />
                            {errors.nombre && <p className="text-xs text-red-500 mt-0.5">{errors.nombre}</p>}
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Provincia *" icon={MapPin}>
                                <div className="relative">
                                    <select
                                        value={form.provincia}
                                        onChange={e => set('provincia', e.target.value)}
                                        className={`select w-full appearance-none pr-8 ${errors.provincia ? 'border-red-400' : ''}`}
                                    >
                                        <option value="">— Elegir —</option>
                                        {PROVINCIAS.map(p => <option key={p}>{p}</option>)}
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                {errors.provincia && <p className="text-xs text-red-500 mt-0.5">{errors.provincia}</p>}
                            </Field>

                            <Field label="Ciudad / Localidad" icon={MapPin}>
                                <input
                                    type="text"
                                    value={form.ciudad}
                                    onChange={e => set('ciudad', e.target.value)}
                                    placeholder="Ej: Bahía Blanca"
                                    className="input"
                                />
                            </Field>
                        </div>

                        <Field label="Dirección">
                            <input
                                type="text"
                                value={form.direccion}
                                onChange={e => set('direccion', e.target.value)}
                                placeholder="Calle, número, barrio..."
                                className="input"
                            />
                        </Field>
                    </div>

                    {/* Contacto */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Contacto</h4>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Teléfono / WhatsApp" icon={Phone}>
                                <input
                                    type="tel"
                                    value={form.telefono}
                                    onChange={e => set('telefono', e.target.value)}
                                    placeholder="+54 9 11 ..."
                                    className="input"
                                />
                            </Field>
                            <Field label="Persona de Contacto" icon={User}>
                                <input
                                    type="text"
                                    value={form.personaContacto}
                                    onChange={e => set('personaContacto', e.target.value)}
                                    placeholder="Nombre y apellido"
                                    className="input"
                                />
                            </Field>
                        </div>

                        <Field label="Email" icon={Mail}>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => set('email', e.target.value)}
                                placeholder="contacto@organización.org"
                                className="input"
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Instagram" icon={Instagram}>
                                <input
                                    type="text"
                                    value={form.instagram}
                                    onChange={e => set('instagram', e.target.value)}
                                    placeholder="@usuario"
                                    className="input"
                                />
                            </Field>
                            <Field label="Sitio Web" icon={Globe}>
                                <input
                                    type="url"
                                    value={form.sitioWeb}
                                    onChange={e => set('sitioWeb', e.target.value)}
                                    placeholder="https://..."
                                    className="input"
                                />
                            </Field>
                        </div>
                    </div>

                    {/* Calificación */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Calificación</h4>

                        <Field label="Tipo de Licencia" icon={Tag}>
                            <div className="relative">
                                <select
                                    value={form.tipoLicencia}
                                    onChange={e => set('tipoLicencia', e.target.value)}
                                    className="select w-full appearance-none pr-8"
                                >
                                    {LICENCIAS.map(l => <option key={l}>{l}</option>)}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </Field>

                        <div className="space-y-1.5">
                            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estado inicial</label>
                            <div className="flex flex-wrap gap-2">
                                {ESTADO_LIST.map(est => (
                                    <button
                                        key={est}
                                        type="button"
                                        onClick={() => set('estado', est)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.estado === est
                                            ? 'bg-brand-600 text-white border-brand-600'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-400'
                                            }`}
                                    >
                                        {est}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notas iniciales */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nota inicial (opcional)</h4>
                        <Field label="Nota" icon={FileText}>
                            <textarea
                                value={form._notaInicial || ''}
                                onChange={e => set('_notaInicial', e.target.value)}
                                placeholder="Contexto, cómo la conociste, próximos pasos..."
                                rows={3}
                                className="input resize-none"
                            />
                        </Field>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="btn-ghost flex-1"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Agregar ONG
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}
