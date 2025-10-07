export default defineEventHandler((event) => {
  // Set the correct content type for robots.txt
  setHeader(event, 'Content-Type', 'text/plain')
  
  const robotsTxt = `User-agent: *
Allow: /

# Permitir páginas principales
Allow: /items
Allow: /posts
Allow: /pages/
Allow: /subpages/
Allow: /promotions/

# Bloquear páginas de usuario y administrativas
Disallow: /login
Disallow: /register
Disallow: /checkout
Disallow: /orders
Disallow: /admin

# Bloquear APIs
Disallow: /api/

# Bloquear archivos temporales y de sistema
Disallow: /*.json$
Disallow: /*?*

# Permitir bots específicos para imágenes
User-agent: Googlebot-Image
Allow: /img/
Allow: /_nuxt/
Allow: /uploads/

# Sitemap location
Sitemap: https://mandarastore.com/sitemap.xml`

  return robotsTxt
})