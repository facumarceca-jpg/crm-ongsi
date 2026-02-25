import { supabase } from '../src/lib/supabase.js'
import { initialMockData } from '../src/data/mockData.js'

async function seed() {
    console.log('🚀 Iniciando migración de ONGs a Supabase...')

    // Mapear campos de JS (camelCase) a Supabase (snake_case)
    const formattedOngs = initialMockData.map(o => ({
        id: o.id,
        nombre: o.nombre,
        estado: o.estado,
        provincia: o.provincia,
        ciudad: o.ciudad,
        direccion: o.direccion,
        telefono: o.telefono,
        email: o.email,
        instagram: o.instagram || '',
        sitio_web: o.sitioWeb || '',
        tipo_licencia: o.tipoLicencia || 'Ninguna',
        persona_contacto: o.personaContacto || '',
        proxima_accion: (o.proximaAccion && o.proximaAccion !== '') ? o.proximaAccion : null,
        marimba_url: o.marimbaUrl || '',
        scraped: o.scraped || false,
        notas: o.notas || []
    }))

    // Subir en bloques de 50 para evitar problemas de timeout
    const chunk = 50
    for (let i = 0; i < formattedOngs.length; i += chunk) {
        const batch = formattedOngs.slice(i, i + chunk)
        const { error } = await supabase
            .from('ongs')
            .upsert(batch, { onConflict: 'id' })

        if (error) {
            console.error(`❌ Error en bloque ${i / chunk + 1}:`, error)
        } else {
            console.log(`✅ Bloque ${i / chunk + 1} subido (${batch.length} registros)`)
        }
    }

    console.log('✨ ¡Migración completada!')
}

seed()
