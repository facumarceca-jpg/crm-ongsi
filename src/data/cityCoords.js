// Static lat/lng for Argentine cities — used by MapView to place markers
// Fallback: if city not found, use province capital coords

export const PROVINCE_CAPITALS = {
    'Buenos Aires': { lat: -36.6769, lng: -60.5581 }, // centre of province
    'CABA': { lat: -34.6037, lng: -58.3816 },
    'Córdoba': { lat: -31.4201, lng: -64.1888 },
    'Santa Fe': { lat: -31.6333, lng: -60.7000 },
    'Tucumán': { lat: -26.8083, lng: -65.2176 },
    'Neuquén': { lat: -38.9516, lng: -68.0591 },
    'Mendoza': { lat: -32.8908, lng: -68.8272 },
    'Río Negro': { lat: -40.8135, lng: -63.0000 },
    'Entre Ríos': { lat: -31.7748, lng: -60.4959 },
    'La Pampa': { lat: -36.6167, lng: -64.2833 },
    'Salta': { lat: -24.7859, lng: -65.4117 },
    'San Luis': { lat: -33.2950, lng: -66.3356 },
    'Santa Cruz': { lat: -51.6230, lng: -69.2168 },
    'Tierra del Fuego': { lat: -54.8019, lng: -68.3030 },
    'La Rioja': { lat: -29.4131, lng: -66.8558 },
    'Corrientes': { lat: -27.4692, lng: -58.8306 },
    'Misiones': { lat: -27.3671, lng: -55.8969 },
    'Chaco': { lat: -27.4513, lng: -59.0000 },
    'Chubut': { lat: -43.3002, lng: -65.1023 },
    'Formosa': { lat: -26.1775, lng: -58.1781 },
    'Jujuy': { lat: -24.1858, lng: -65.2995 },
    'San Juan': { lat: -31.5375, lng: -68.5364 },
    'Santiago del Estero': { lat: -27.7951, lng: -64.2615 },
}

export const CITY_COORDS = {
    // ── CABA ─────────────────────────────────────────────────────────────────
    'Buenos Aires': { lat: -34.6037, lng: -58.3816 },
    'Balvanera': { lat: -34.6180, lng: -58.4080 },

    // ── Buenos Aires Province ─────────────────────────────────────────────────
    'La Plata': { lat: -34.9205, lng: -57.9536 },
    'Mar del Plata': { lat: -38.0055, lng: -57.5426 },
    'Bahía Blanca': { lat: -38.7183, lng: -62.2663 },
    'Quilmes': { lat: -34.7206, lng: -58.2535 },
    'Lomas de Zamora': { lat: -34.7603, lng: -58.4018 },
    'Avellaneda': { lat: -34.6610, lng: -58.3680 },
    'Morón': { lat: -34.6524, lng: -58.6200 },
    'Tandil': { lat: -37.3217, lng: -59.1333 },
    'Merlo': { lat: -34.6735, lng: -58.7272 },
    'Tigre': { lat: -34.4260, lng: -58.5796 },
    'Zárate': { lat: -34.0984, lng: -59.0279 },
    'Campana': { lat: -34.1635, lng: -58.9608 },
    'Necochea': { lat: -38.5567, lng: -58.7379 },
    'Pinamar': { lat: -37.1088, lng: -56.8640 },
    'La Costa': { lat: -36.6667, lng: -56.7167 },
    'Junín': { lat: -34.5887, lng: -60.9570 },
    'Olavarría': { lat: -36.8928, lng: -60.3219 },
    'Ayacucho': { lat: -37.1522, lng: -58.4890 },
    'Saladillo': { lat: -35.6378, lng: -59.7861 },
    'Coronel Suárez': { lat: -37.4617, lng: -61.9375 },
    'Chivilcoy': { lat: -34.8985, lng: -60.0183 },
    'Las Flores': { lat: -36.0167, lng: -59.1000 },
    'General Madariaga': { lat: -37.0028, lng: -57.1343 },
    'Tres Arroyos': { lat: -38.3761, lng: -60.2740 },
    'Pigüé': { lat: -37.6060, lng: -62.4038 },
    'Bahia Blanca': { lat: -38.7183, lng: -62.2663 }, // alt spelling
    'San Nicolás': { lat: -33.3360, lng: -60.2204 },
    'Malvinas Argentinas': { lat: -34.4613, lng: -58.7004 },
    'Cañuelas': { lat: -35.0556, lng: -58.7558 },
    'San Vicente': { lat: -35.0271, lng: -58.4231 },
    'Lanús': { lat: -34.7072, lng: -58.3926 },
    'Atalaya': { lat: -35.0333, lng: -57.5333 },
    'Magdalena': { lat: -35.0795, lng: -57.5220 },
    'San Miguel': { lat: -34.5430, lng: -58.7138 },
    'Villa Gesell': { lat: -37.2626, lng: -56.9729 },
    'Mar Chiquita': { lat: -37.7333, lng: -57.4333 },
    'Pergamino': { lat: -33.8883, lng: -60.5693 },
    'Azul': { lat: -36.7820, lng: -59.8644 },
    'Luján': { lat: -34.5697, lng: -59.1068 },
    'Moreno': { lat: -34.6502, lng: -58.7902 },
    'Florencio Varela': { lat: -34.8172, lng: -58.2756 },
    'Berazategui': { lat: -34.7636, lng: -58.2117 },
    'San Martín': { lat: -34.5698, lng: -58.5349 },
    'Tres de Febrero': { lat: -34.6060, lng: -58.5780 },
    'Ituzaingó': { lat: -34.6588, lng: -58.6735 },
    'La Matanza': { lat: -34.7710, lng: -58.5833 },
    'Almirante Brown': { lat: -34.8216, lng: -58.3883 },
    'Esteban Echeverría': { lat: -34.8261, lng: -58.4645 },
    'Ezeiza': { lat: -34.8479, lng: -58.5236 },
    'Hurlingham': { lat: -34.5895, lng: -58.6346 },
    'San Isidro': { lat: -34.4728, lng: -58.5258 },
    'Vicente López': { lat: -34.5262, lng: -58.4774 },
    'General San Martín': { lat: -34.5698, lng: -58.5349 },

    // ── Córdoba ───────────────────────────────────────────────────────────────
    'Córdoba': { lat: -31.4201, lng: -64.1888 },
    'Villa Carlos Paz': { lat: -31.4228, lng: -64.4979 },
    'Río Cuarto': { lat: -33.1307, lng: -64.3499 },
    'San Francisco': { lat: -31.4268, lng: -62.0831 },
    'Villa María': { lat: -32.4079, lng: -63.2440 },

    // ── Santa Fe ──────────────────────────────────────────────────────────────
    'Santa Fe': { lat: -31.6333, lng: -60.7000 },
    'Rosario': { lat: -32.9468, lng: -60.6393 },
    'Rafaela': { lat: -31.2517, lng: -61.4878 },
    'Venado Tuerto': { lat: -33.7457, lng: -61.9685 },
    'Reconquista': { lat: -29.1447, lng: -59.6453 },

    // ── Neuquén ───────────────────────────────────────────────────────────────
    'Neuquén': { lat: -38.9516, lng: -68.0591 },
    'San Martín de los Andes': { lat: -40.1572, lng: -71.3534 },
    'Zapala': { lat: -38.8996, lng: -70.0620 },
    'Bariloche': { lat: -41.1335, lng: -71.3103 },

    // ── Mendoza ───────────────────────────────────────────────────────────────
    'Mendoza': { lat: -32.8908, lng: -68.8272 },
    'Maipú': { lat: -32.9810, lng: -68.7874 },
    'Godoy Cruz': { lat: -32.9265, lng: -68.8504 },
    'San Rafael': { lat: -34.6177, lng: -68.3301 },
    'Luján de Cuyo': { lat: -33.0380, lng: -68.8775 },

    // ── Río Negro ─────────────────────────────────────────────────────────────
    'Viedma': { lat: -40.8135, lng: -62.9967 },
    'General Roca': { lat: -39.0329, lng: -67.5753 },
    'Cipolletti': { lat: -38.9346, lng: -67.9927 },
    'El Bolsón': { lat: -41.9660, lng: -71.5322 },

    // ── Entre Ríos ────────────────────────────────────────────────────────────
    'Paraná': { lat: -31.7333, lng: -60.5333 },
    'Concordia': { lat: -31.3933, lng: -58.0200 },
    'Gualeguaychú': { lat: -33.0121, lng: -59.0213 },
    'Colón': { lat: -32.2220, lng: -58.1437 },

    // ── Tucumán ───────────────────────────────────────────────────────────────
    'San Miguel de Tucumán': { lat: -26.8083, lng: -65.2176 },
    'Banda del Río Salí': { lat: -26.8333, lng: -65.1833 },

    // ── Salta ─────────────────────────────────────────────────────────────────
    'Salta': { lat: -24.7859, lng: -65.4117 },
    'Tartagal': { lat: -22.5213, lng: -63.7927 },
    'Orán': { lat: -23.1337, lng: -64.3198 },

    // ── Chubut ────────────────────────────────────────────────────────────────
    'Rawson': { lat: -43.3002, lng: -65.1023 },
    'Trelew': { lat: -43.2481, lng: -65.3067 },
    'Puerto Madryn': { lat: -42.7692, lng: -65.0385 },
    'Comodoro Rivadavia': { lat: -45.8645, lng: -67.4964 },
    'Esquel': { lat: -42.9082, lng: -71.3217 },

    // ── Santa Cruz ────────────────────────────────────────────────────────────
    'Río Gallegos': { lat: -51.6230, lng: -69.2168 },
    'Caleta Olivia': { lat: -46.4396, lng: -67.5108 },
    'El Calafate': { lat: -50.3381, lng: -72.2648 },

    // ── Misiones ──────────────────────────────────────────────────────────────
    'Posadas': { lat: -27.3671, lng: -55.8969 },
    'Oberá': { lat: -27.4864, lng: -55.1197 },
    'Puerto Iguazú': { lat: -25.5972, lng: -54.5783 },

    // ── Corrientes ────────────────────────────────────────────────────────────
    'Corrientes': { lat: -27.4692, lng: -58.8306 },
    'Goya': { lat: -29.1438, lng: -59.2629 },
    'Paso de los Libres': { lat: -29.7129, lng: -57.0850 },

    // ── Chaco ─────────────────────────────────────────────────────────────────
    'Resistencia': { lat: -27.4513, lng: -59.0000 },
    'Presidencia Roque Sáenz Peña': { lat: -26.7888, lng: -60.4394 },

    // ── Formosa ───────────────────────────────────────────────────────────────
    'Formosa': { lat: -26.1775, lng: -58.1781 },

    // ── Jujuy ─────────────────────────────────────────────────────────────────
    'San Salvador de Jujuy': { lat: -24.1858, lng: -65.2995 },
    'Palpalá': { lat: -24.2556, lng: -65.1975 },

    // ── La Pampa ──────────────────────────────────────────────────────────────
    'Santa Rosa': { lat: -36.6167, lng: -64.2833 },
    'General Pico': { lat: -35.6595, lng: -63.7570 },

    // ── La Rioja ──────────────────────────────────────────────────────────────
    'La Rioja': { lat: -29.4131, lng: -66.8558 },

    // ── San Juan ──────────────────────────────────────────────────────────────
    'San Juan': { lat: -31.5375, lng: -68.5364 },

    // ── San Luis ──────────────────────────────────────────────────────────────
    'San Luis': { lat: -33.2950, lng: -66.3356 },
    'Villa Mercedes': { lat: -33.6708, lng: -65.4596 },

    // ── Santiago del Estero ───────────────────────────────────────────────────
    'Santiago del Estero': { lat: -27.7951, lng: -64.2615 },

    // ── Tierra del Fuego ──────────────────────────────────────────────────────
    'Ushuaia': { lat: -54.8019, lng: -68.3030 },
    'Río Grande': { lat: -53.7876, lng: -67.7071 },
}

/**
 * Returns {lat, lng} for a given city + province.
 * Priority: exact city match → province capital → geographic centre of Argentina
 */
export function getCoords(ciudad, provincia) {
    if (ciudad && CITY_COORDS[ciudad]) return CITY_COORDS[ciudad]
    // Try trimmed version
    const trimmed = ciudad?.trim()
    if (trimmed && CITY_COORDS[trimmed]) return CITY_COORDS[trimmed]
    // Fallback to province capital
    if (provincia && PROVINCE_CAPITALS[provincia]) return PROVINCE_CAPITALS[provincia]
    // Last resort: geographic centre of Argentina
    return { lat: -38.4161, lng: -63.6167 }
}
