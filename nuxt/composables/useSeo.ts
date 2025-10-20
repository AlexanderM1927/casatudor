export const useSeo = () => {
  const setSeoMeta = (options: {
    title?: string
    description?: string
    image?: string
    url?: string
  }) => {
    const config = useRuntimeConfig()
    
    // Set default values
    const title = options.title || config.public.storeName
    const description = options.description || config.public.description
    const image = options.image || '/img/logo.png'
    const url = options.url || ''

    // Update head meta tags
    useHead({
      title,
      meta: [
        { name: 'description', content: description },
        // Open Graph
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: config.public.storeName },
        // Twitter
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
        { name: 'twitter:card', content: 'summary_large_image' }
      ]
    })
  }

  const setProductSeo = (product: {
    name: string
    description?: string
    image?: string
    price?: number
  }) => {
    const config = useRuntimeConfig()
    const title = `${product.name} - ${config.public.storeName}`
    const description = product.description || `${product.name} disponible en ${config.public.storeName}`
    const image = product.image || '/img/logo.png'
    
    setSeoMeta({
      title,
      description,
      image
    })
  }

  const setPostSeo = (post: {
    title: string
    excerpt?: string
    featuredImage?: string
  }) => {
    const config = useRuntimeConfig()
    const title = `${post.title} - ${config.public.storeName}`
    const description = post.excerpt || `Lee más sobre ${post.title} en ${config.public.storeName}`
    const image = post.featuredImage || '/img/logo.png'
    
    setSeoMeta({
      title,
      description,
      image
    })
  }

  return {
    setSeoMeta,
    setProductSeo,
    setPostSeo
  }
}