export default defineEventHandler((event) => {
  const userAgent = getRequestHeader(event, 'user-agent') || ''
  const url = getRequestURL(event)
  
  // Detectar si es un bot de búsqueda
  const isBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkshare|w3c_validator/i.test(userAgent)
  
  if (isBot) {
    // Configurar headers apropiados para bots
    setResponseHeaders(event, {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'all',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS'
    })
    
    // Interceptar rutas de API que requieren autenticación
    // Los bots no necesitan estas rutas, retornar 404 sin error
    if (url.pathname.startsWith('/api/auth/') || 
        url.pathname.startsWith('/api/user/') ||
        url.pathname.startsWith('/api/orders/') ||
        url.pathname.startsWith('/api/cart/')) {
      setResponseStatus(event, 404)
      return { statusCode: 404, message: 'Not available for bots' }
    }
    
    // Redirigir bots de páginas privadas a home
    if (url.pathname.startsWith('/checkout') || 
        url.pathname.startsWith('/orders') ||
        url.pathname.startsWith('/login') ||
        url.pathname.startsWith('/register')) {
      return sendRedirect(event, '/', 302)
    }
  }
})
