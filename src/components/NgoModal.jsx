import React, { useState, useEffect } from 'react'
import { useApp } from '../store/AppContext'
import StatusBadge from './StatusBadge'
import { ESTADOS } from '../data/mockData'
import {
    X,
    Phone,
    Mail,
    MapPin,
    Instagram,
    User,
    FileText,
    CalendarDays,
    Send,
    Trash2,
    ExternalLink,
    Globe,
    Leaf,
    Pencil,
    Check,
} from 'lucide-react'

const ESTADO_LIST = Object.values(ESTADOS)

// Only these columns exist in Supabase — never send unknown fields
const SUPABASE_COLS = [
    'id', 'nombre', 'estado', 'provincia', 'ciudad', 'direccion',
    'telefono', 'email', 'instagram', 'sitioWeb', 'marimbaUrl',
    'personaContacto', 'proximaAccion', 'notas', 'scraped',
]

function pickSupabaseCols(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([k]) => SUPABASE_COLS.includes(k))
    )
}

function Section({ title, children }) {
    return (
        <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</h4>
            {children}
        </div>
    )
}

// Editable info row — shows value with a small edit button; clicking turns it into an input
function EditableRow({ icon: Icon, label, value, onChange, type = 'text', href }) {
    const [editing, setEditing] = useState(false)

    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
                {editing ? (
                    <div className="flex items-center gap-1.5">
                        <input
                            type={type}
                            value={value || ''}
                            onChange={e => onChange(e.target.value)}
                            autoFocus
                            className="input flex-1 py-1 text-sm"
                        />
                        <button
                            onClick={() => setEditing(false)}
                            className="p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 flex-shrink-0"
                        >
                            <Check className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 group">
                        {href && value ? (
                            <a href={href} target="_blank" rel="noopener noreferrer"
                                className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 truncate">
                                {value} <ExternalLink className="w-3 h-3 inline flex-shrink-0" />
                            </a>
                        ) : (
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                {value || <span className="text-slate-300 dark:text-slate-600">—</span>}
                            </p>
                        )}
                        <button
                            onClick={() => setEditing(true)}
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex-shrink-0"
                            title="Editar"
                        >
                            <Pencil className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>
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
                {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                        {value} <ExternalLink className="w-3 h-3 inline" />
                    </a>
                ) : (
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{value || '—'}</p>
                )}
            </div>
        </div>
    )
}

export default function NgoModal({ ong, onClose }) {
    const { dispatch } = useApp()
    const [form, setForm] = useState({ ...ong })
    const [noteText, setNoteText] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => { setForm({ ...ong }) }, [ong])

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [onClose])

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

    const handleSave = () => {
        setSaving(true)
        // Only pass columns that exist in Supabase
        dispatch({ type: 'UPDATE_ONG', payload: pickSupabaseCols(form) })
        setTimeout(() => setSaving(false), 600)
    }

    const handleAddNote = () => {
        if (!noteText.trim()) return
        dispatch({ type: 'ADD_NOTE', payload: { ongId: ong.id, texto: noteText.trim() } })
        setForm(prev => ({
            ...prev,
            notas: [
                ...prev.notas,
                { id: `n${Date.now()}`, texto: noteText.trim(), fecha: new Date().toISOString() },
            ],
        }))
        setNoteText('')
    }

    const handleDeleteNote = (noteId) => {
        dispatch({ type: 'DELETE_NOTE', payload: { ongId: ong.id, noteId } })
        setForm(prev => ({ ...prev, notas: prev.notas.filter(n => n.id !== noteId) }))
    }

    const fmtDate = (iso) => {
        if (!iso) return ''
        return new Date(iso).toLocaleString('es-AR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
    }

    const mapsUrl = form.direccion
        ? `https://maps.google.com/?q=${encodeURIComponent(form.direccion)}`
        : null

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

            <div className="fixed right-0 top-0 h-full w-full sm:max-w-xl bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700 gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <StatusBadge estado={form.estado} />
                            {ong.scraped && (
                                <span className="text-xs bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full font-medium">
                                    Scrapeada
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">{ong.nombre}</h2>
                        <p className="text-sm text-slate-400">{ong.ciudad}, {ong.provincia}</p>
                    </div>
                    <button onClick={onClose} className="btn-ghost p-2 mt-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Contact info — all editable */}
                    <Section title="Información de Contacto">
                        <p className="text-xs text-slate-400 -mt-1 flex items-center gap-1">
                            <Pencil className="w-3 h-3" /> Pasá el cursor sobre un campo para editarlo
                        </p>
                        <div className="space-y-3">
                            <EditableRow icon={Phone} label="Teléfono" value={form.telefono}
                                onChange={v => set('telefono', v)} type="tel"
                                href={form.telefono ? `tel:${form.telefono}` : null} />
                            <EditableRow icon={Mail} label="Email" value={form.email}
                                onChange={v => set('email', v)} type="email"
                                href={form.email ? `mailto:${form.email}` : null} />
                            <EditableRow icon={Instagram} label="Instagram" value={form.instagram}
                                onChange={v => set('instagram', v)}
                                href={form.instagram ? `https://instagram.com/${form.instagram.replace('@', '')}` : null} />
                            <EditableRow icon={Globe} label="Sitio Web" value={form.sitioWeb}
                                onChange={v => set('sitioWeb', v)} type="url"
                                href={form.sitioWeb || null} />
                            <EditableRow icon={MapPin} label="Dirección" value={form.direccion}
                                onChange={v => set('direccion', v)}
                                href={mapsUrl} />
                            {ong.marimbaUrl && (
                                <InfoRow icon={Leaf} label="Perfil Marimba" value="Ver en marimba.com.ar" href={ong.marimbaUrl} />
                            )}
                        </div>
                    </Section>

                    {/* Qualification */}
                    <Section title="Datos de Calificación">
                        <div className="space-y-1.5">
                            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" /> Persona de Contacto
                            </label>
                            <input
                                type="text"
                                value={form.personaContacto || ''}
                                onChange={e => set('personaContacto', e.target.value)}
                                placeholder="Nombre y apellido"
                                className="input w-full"
                            />
                        </div>
                    </Section>

                    {/* Status + Next action */}
                    <Section title="Estado y Seguimiento">
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estado</label>
                                <div className="flex flex-wrap gap-2">
                                    {ESTADO_LIST.map(est => (
                                        <button
                                            key={est}
                                            onClick={() => set('estado', est)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.estado === est
                                                ? 'bg-brand-600 text-white border-brand-600'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-400 dark:hover:border-brand-500'
                                                }`}
                                        >
                                            {est}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                    <CalendarDays className="w-3.5 h-3.5" /> Fecha de Próxima Acción
                                </label>
                                <input
                                    type="date"
                                    value={form.proximaAccion || ''}
                                    onChange={e => set('proximaAccion', e.target.value)}
                                    className="input"
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Notes */}
                    <Section title={`Historial de Notas (${form.notas.length})`}>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <textarea
                                    value={noteText}
                                    onChange={e => setNoteText(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAddNote() }}
                                    placeholder="Escribe una nota... (Ctrl+Enter para guardar)"
                                    rows={3}
                                    className="input resize-none flex-1"
                                />
                                <button
                                    onClick={handleAddNote}
                                    disabled={!noteText.trim()}
                                    className="btn-primary px-3 py-2 self-end disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                            {form.notas.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">
                                    Sin notas todavía. ¡Agregá la primera! 📝
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                    {[...form.notas].reverse().map(nota => (
                                        <div key={nota.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 group relative">
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{nota.texto}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-xs text-slate-400">{fmtDate(nota.fecha)}</p>
                                                <button
                                                    onClick={() => handleDeleteNote(nota.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-0.5"
                                                >
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

                {/* Footer – Save */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        onClick={handleSave}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <FileText className="w-4 h-4" />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}
