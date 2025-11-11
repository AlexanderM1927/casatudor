export default defineNuxtPlugin((nuxtApp) => {
  // Manejar errores de manifest sin mostrarlos al usuario
  nuxtApp.hook('app:error', (error) => {
    // Suprimir errores de app manifest
    if (error.message?.includes('app manifest') || 
        error.message?.includes('builds/meta') ||
        error.message?.includes('499 Client Closed Request')) {
      console.warn('App manifest error suppressed:', error.message)
      // Prevenir que el error se propague
      return false
    }
  })

  // Interceptar errores no manejados de fetch
  if (process.client) {
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        // Si es una solicitud a builds/meta y falla, retornar respuesta vacía
        if (args[0]?.toString().includes('/_nuxt/builds/meta/')) {
          if (!response.ok) {
            return new Response(JSON.stringify({
              id: 'static-build',
              timestamp: Date.now(),
              matcher: {},
              prerendered: []
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          }
        }
        return response
      } catch (error) {
        // Si es error de builds/meta, retornar respuesta válida
        if (args[0]?.toString().includes('/_nuxt/builds/meta/')) {
          console.warn('Fetch error suppressed for builds/meta:', error)
          return new Response(JSON.stringify({
            id: 'static-build',
            timestamp: Date.now(),
            matcher: {},
            prerendered: []
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        }
        throw error
      }
    }
  }
})
