import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const { products } = await readBody(event)
    const config = useRuntimeConfig()

    if (!products || !Array.isArray(products) || products.length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'Productos requeridos' })
    }

    try {
        // Create a temporary guest cart in Strapi
        const cart = await $fetch(`${config.public.apiBase}/carts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    products: products,
                    // No user associated - this is a guest cart
                    publishedAt: new Date()
                }
            })
        })

        return cart
    } catch (error: any) {
        console.error('Error creating guest cart:', error)
        throw createError({ 
            statusCode: error.statusCode || 500, 
            statusMessage: error.message || 'Error al crear carrito de invitado' 
        })
    }
})
