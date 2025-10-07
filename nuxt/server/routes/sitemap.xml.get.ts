export default defineEventHandler(async (event) => {
  // Set the correct content type for XML
  setHeader(event, 'Content-Type', 'application/xml')
  
  try {
    // Get the base URL from runtime config or environment
    const config = useRuntimeConfig()
    const baseUrl = 'https://mandarastore.com' // Update this to your actual domain
    
    // Current date for lastmod
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Static pages that should always be in sitemap
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/items', priority: '0.9', changefreq: 'daily' },
      { url: '/posts', priority: '0.8', changefreq: 'weekly' },
      { url: '/pages', priority: '0.7', changefreq: 'monthly' },
      { url: '/subpages', priority: '0.6', changefreq: 'monthly' },
      { url: '/promotions', priority: '0.8', changefreq: 'weekly' }
    ]
    
    // TODO: Fetch dynamic content from Strapi
    // You can uncomment and modify these sections when you want to include dynamic content
    
    /*
    // Fetch products/items from Strapi
    const strapiUrl = config.public?.apiBase || 'https://back.mandarastore.com/api'
    
    let dynamicPages = []
    
    try {
      // Fetch products
      const productsResponse = await $fetch(`${strapiUrl}/products?populate=*`)
      const products = productsResponse.data || []
      
      products.forEach(product => {
        dynamicPages.push({
          url: `/items/${product.attributes.slug || product.id}`,
          priority: '0.7',
          changefreq: 'weekly',
          lastmod: product.attributes.updatedAt?.split('T')[0] || currentDate
        })
      })
      
      // Fetch posts
      const postsResponse = await $fetch(`${strapiUrl}/posts?populate=*`)
      const posts = postsResponse.data || []
      
      posts.forEach(post => {
        dynamicPages.push({
          url: `/posts/${post.attributes.slug || post.id}`,
          priority: '0.6',
          changefreq: 'weekly',
          lastmod: post.attributes.updatedAt?.split('T')[0] || currentDate
        })
      })
      
      // Fetch pages
      const pagesResponse = await $fetch(`${strapiUrl}/pages?populate=*`)
      const pages = pagesResponse.data || []
      
      pages.forEach(page => {
        dynamicPages.push({
          url: `/pages/${page.attributes.slug || page.id}`,
          priority: '0.5',
          changefreq: 'monthly',
          lastmod: page.attributes.updatedAt?.split('T')[0] || currentDate
        })
      })
      
    } catch (error) {
      console.error('Error fetching dynamic content for sitemap:', error)
      // Continue with static pages only if dynamic content fails
    }
    */
    
    // For now, we'll use only static pages
    const dynamicPages = []
    
    // Combine static and dynamic pages
    const allPages = [...staticPages, ...dynamicPages]
    
    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`
    
    return sitemap
    
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback sitemap if there's an error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mandarastore.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
    
    return fallbackSitemap
  }
})