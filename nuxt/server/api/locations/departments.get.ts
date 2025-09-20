export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const countryId = query.countryId
    
    // Departamentos de Colombia
    const departments = {
    'CO': [
        { id: 'AMA', name: 'Amazonas' },
        { id: 'ANT', name: 'Antioquia' },
        { id: 'ARA', name: 'Arauca' },
        { id: 'ATL', name: 'Atlántico' },
        { id: 'BOL', name: 'Bolívar' },
        { id: 'BOY', name: 'Boyacá' },
        { id: 'CAL', name: 'Caldas' },
        { id: 'CAQ', name: 'Caquetá' },
        { id: 'CAS', name: 'Casanare' },
        { id: 'CAU', name: 'Cauca' },
        { id: 'CES', name: 'Cesar' },
        { id: 'CHO', name: 'Chocó' },
        { id: 'COR', name: 'Córdoba' },
        { id: 'CUN', name: 'Cundinamarca' },
        { id: 'GUA', name: 'Guainía' },
        { id: 'GUV', name: 'Guaviare' },
        { id: 'HUI', name: 'Huila' },
        { id: 'LAG', name: 'La Guajira' },
        { id: 'MAG', name: 'Magdalena' },
        { id: 'MET', name: 'Meta' },
        { id: 'NAR', name: 'Nariño' },
        { id: 'NDS', name: 'Norte de Santander' },
        { id: 'PUT', name: 'Putumayo' },
        { id: 'QUI', name: 'Quindío' },
        { id: 'RIS', name: 'Risaralda' },
        { id: 'SAP', name: 'San Andrés y Providencia' },
        { id: 'SAN', name: 'Santander' },
        { id: 'SUC', name: 'Sucre' },
        { id: 'TOL', name: 'Tolima' },
        { id: 'VAL', name: 'Valle del Cauca' },
        { id: 'VAU', name: 'Vaupés' },
        { id: 'VIC', name: 'Vichada' },
        { id: 'BOG', name: 'Bogotá D.C.' }
    ]
    };

    
    return departments[countryId as string] || []
})