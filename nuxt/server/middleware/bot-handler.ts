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
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Content-Type': 'text/html; charset=utf-8'
    })
    
    // Evitar que los bots accedan a rutas de API o privadas
    if (url.pathname.startsWith('/api/') || 
        url.pathname.startsWith('/checkout') || 
        url.pathname.startsWith('/orders')) {
      setResponseStatus(event, 404)
      return sendRedirect(event, '/', 302)
    }
  }
})
