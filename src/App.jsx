import React, { useState, useEffect, useMemo } from 'react'
import { AppProvider, useApp } from './store/AppContext'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import NgoTable from './components/NgoTable'
import NgoModal from './components/NgoModal'
import AddOngModal from './components/AddOngModal'
import MapView from './components/MapView'
import PlansView from './components/PlansView'
import { XCircle } from 'lucide-react'

function CrmApp() {
    const { ongs, loading, error } = useApp()
    const [activeView, setActiveView] = useState('dashboard')
    const [selectedOng, setSelectedOng] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [dark, setDark] = useState(() => {
        const stored = localStorage.getItem('crm_dark_mode')
        if (stored !== null) return stored === 'true'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark)
        localStorage.setItem('crm_dark_mode', dark)
    }, [dark])

    // If selectedOng is in context, keep it fresh
    const freshSelectedOng = useMemo(() => {
        if (!selectedOng) return null
        return ongs.find(o => o.id === selectedOng.id) ?? null
    }, [selectedOng, ongs])

    const counts = useMemo(() => ({
        total: ongs.length,
        Activa: ongs.filter(o => o.estado === 'Activa').length,
        Pendiente: ongs.filter(o => o.estado === 'Pendiente').length,
        'En Seguimiento': ongs.filter(o => o.estado === 'En Seguimiento').length,
        Rechazada: ongs.filter(o => o.estado === 'Rechazada').length,
    }), [ongs])

    const handleOpenOng = (ong) => setSelectedOng(ong)
    const handleCloseModal = () => setSelectedOng(null)

    const tableViews = ['all', 'Activa', 'Pendiente', 'En Seguimiento', 'Rechazada']
    const isTableView = tableViews.includes(activeView)

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Conectando con Supabase...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error de Conexión</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Reintentar
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                dark={dark}
                toggleDark={() => setDark(d => !d)}
                counts={counts}
            />

            {/* Main content with left margin for sidebar */}
            <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
                <div className="p-4 md:p-8 max-w-6xl mx-auto">
                    {activeView === 'dashboard' && (
                        <Dashboard
                            setActiveView={setActiveView}
                            onOpenOng={handleOpenOng}
                        />
                    )}
                    {activeView === 'mapa' && (
                        <MapView onOpenOng={handleOpenOng} />
                    )}
                    {activeView === 'planes' && (
                        <PlansView />
                    )}
                    {isTableView && (
                        <NgoTable
                            filterEstado={activeView === 'all' ? 'Todos' : activeView}
                            onOpenOng={handleOpenOng}
                            onAddOng={() => setShowAddModal(true)}
                        />
                    )}
                </div>
            </main>

            {/* Edit modal */}
            {freshSelectedOng && (
                <NgoModal ong={freshSelectedOng} onClose={handleCloseModal} />
            )}

            {/* Add ONG modal */}
            {showAddModal && (
                <AddOngModal
                    onClose={() => setShowAddModal(false)}
                    onCreated={(newOng) => handleOpenOng(newOng)}
                />
            )}
        </div>
    )
}

export default function App() {
    return (
        <AppProvider>
            <CrmApp />
        </AppProvider>
    )
}
