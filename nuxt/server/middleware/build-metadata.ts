export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  
  // Interceptar solicitudes a archivos de metadata de builds
  if (url.pathname.includes('/_nuxt/builds/meta/')) {
    // Retornar respuesta vacía exitosa en lugar de 499
    setResponseStatus(event, 200)
    setResponseHeader(event, 'Content-Type', 'application/json')
    setResponseHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
    return {
      id: '',
      timestamp: Date.now(),
      matcher: () => false
    }
  }
})
