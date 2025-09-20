export default defineEventHandler(async (event) => {
    // You can replace this with your actual countries data source
    const countries = [
        { id: 'CO', name: 'Colombia' },
    ]
    
    return countries
})