import type { IProductCart } from '~/types/ProductCart'

export interface APICartProduct {
    id: number
    quantity: number
    selectedVariants: {
        size?: string
        color?: string
    }
    // Strapi v5: flat structure, no data/attributes wrapper
    product: {
        id: number
        documentId?: string
        name: string
        price: number
        createdAt?: string
        updatedAt?: string
        publishedAt?: string
        price_before_offer?: number
        description: string
        image?: Array<{ url: string }>
    }
}

export const mapAPICartProductToIProductCart = (apiProduct: APICartProduct): IProductCart => {
    return {
        // Strapi v5: fields are directly on product, no .data.attributes
        id: apiProduct.product.id,
        name: apiProduct.product.name,
        price: apiProduct.product.price,
        price_before_offer: apiProduct.product.price_before_offer,
        description: apiProduct.product.description,
        images: (apiProduct.product.image || []).map((el) => {
            return useImageFromStrapi(el?.url)
        }),
        // Map cart-specific data
        quantity: apiProduct.quantity,
        selectedVariants: {
            color: apiProduct.selectedVariants?.color || '',
            size: apiProduct.selectedVariants?.size || ''
        }
    }
}

export const mapAPICartProductsToIProductCarts = (apiProducts: APICartProduct[]): IProductCart[] => {
    return apiProducts.map((product) => mapAPICartProductToIProductCart(product))
}