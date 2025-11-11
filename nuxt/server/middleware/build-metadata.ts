export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  
  // Interceptar solicitudes a archivos de metadata de builds
  if (url.pathname.includes('/_nuxt/builds/meta/') || 
      url.pathname.includes('/_nuxt/builds/latest.json')) {
    // Retornar respuesta vacía exitosa en lugar de 499
    setResponseStatus(event, 200)
    setResponseHeader(event, 'Content-Type', 'application/json')
    setResponseHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
    setResponseHeader(event, 'Pragma', 'no-cache')
    setResponseHeader(event, 'Expires', '0')
    
    // Retornar un manifest vacío pero válido
    return {
      id: 'static-build',
      timestamp: Date.now(),
      matcher: {
        static: {},
        wildcard: {},
        dynamic: {}
      },
      prerendered: []
    }
  }
})
