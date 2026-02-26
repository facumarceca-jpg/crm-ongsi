import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

export function AppProvider({ children }) {
    const [ongs, setOngs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Initial fetch from Supabase
    useEffect(() => {
        async function fetchOngs() {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('ongs')
                    .select('*')
                    .order('nombre', { ascending: true })

                if (error) throw error
                setOngs(data || [])
            } catch (err) {
                console.error('Error fetching ONGs:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchOngs()
    }, [])

    // Real-time updates handler (optional, but good for multi-user)
    useEffect(() => {
        const channel = supabase
            .channel('public:ongs')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ongs' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setOngs(prev => [...prev, payload.new].sort((a, b) => a.nombre.localeCompare(b.nombre)))
                } else if (payload.eventType === 'UPDATE') {
                    setOngs(prev => prev.map(o => o.id === payload.new.id ? payload.new : o))
                } else if (payload.eventType === 'DELETE') {
                    setOngs(prev => prev.filter(o => o.id !== payload.old.id))
                }
            })
            .subscribe()

        return () => supabase.removeChannel(channel)
    }, [])

    const dispatch = async (action) => {
        try {
            switch (action.type) {
                case 'ADD_ONG': {
                    const { data, error } = await supabase
                        .from('ongs')
                        .insert([action.payload])
                        .select()
                    if (error) throw error
                    // setOngs is handled by real-time subscription or manually:
                    // setOngs(prev => [...prev, data[0]])
                    break
                }
                case 'UPDATE_ONG': {
                    // Filter payload to only columns that exist in Supabase
                    // (keys from the originally-fetched record = real DB columns)
                    const existing = ongs.find(o => o.id === action.payload.id)
                    const allowedKeys = existing ? Object.keys(existing) : Object.keys(action.payload)
                    const safePayload = Object.fromEntries(
                        Object.entries(action.payload).filter(([k]) => allowedKeys.includes(k))
                    )
                    const { error } = await supabase
                        .from('ongs')
                        .update(safePayload)
                        .eq('id', safePayload.id)
                    if (error) throw error
                    break
                }
                case 'ADD_NOTE': {
                    const ong = ongs.find(o => o.id === action.payload.ongId)
                    if (!ong) return
                    const newNotes = [
                        ...(ong.notas || []),
                        {
                            id: `n${Date.now()}`,
                            texto: action.payload.texto,
                            fecha: new Date().toISOString(),
                        },
                    ]
                    const { error } = await supabase
                        .from('ongs')
                        .update({ notas: newNotes })
                        .eq('id', action.payload.ongId)
                    if (error) throw error
                    // Update local state so UI reflects saved data
                    setOngs(prev => prev.map(o =>
                        o.id === action.payload.ongId ? { ...o, notas: newNotes } : o
                    ))
                    break
                }
                case 'DELETE_NOTE': {
                    const ong = ongs.find(o => o.id === action.payload.ongId)
                    if (!ong) return
                    const newNotes = (ong.notas || []).filter(n => n.id !== action.payload.noteId)
                    const { error } = await supabase
                        .from('ongs')
                        .update({ notas: newNotes })
                        .eq('id', action.payload.ongId)
                    if (error) throw error
                    // Update local state
                    setOngs(prev => prev.map(o =>
                        o.id === action.payload.ongId ? { ...o, notas: newNotes } : o
                    ))
                    break
                }
                default:
                    return
            }
        } catch (err) {
            console.error(`Error in action ${action.type}:`, err)
            alert(`Error al guardar: ${err.message}`)
        }
    }

    return (
        <AppContext.Provider value={{ ongs, dispatch, loading, error }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    return useContext(AppContext)
}
