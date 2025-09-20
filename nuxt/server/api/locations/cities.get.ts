import citiesData from './cities.json'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const departmentId = query.departmentId as string
    
    if (!departmentId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Department ID is required'
        })
    }
    
    // Get cities for the specified department
    const cities = citiesData[departmentId] || []
    
    return cities
})