import type { IImageStrapi } from '~/types/ImageStrapi'
import type { IProductCart } from '~/types/ProductCart'

export interface APICartProduct {
    id: number
    quantity: number
    selectedVariants: {
        size?: string
        color?: string
    }
    product: {
        data: {
            id: number
            attributes: {
                name: string
                price: number
                createdAt: string
                updatedAt: string
                publishedAt: string
                price_before_offer?: number
                description: string,
                image: {
                    data: any[]
                }
                // Add other product attributes as needed
            }
        }
    }
}

export const mapAPICartProductToIProductCart = (apiProduct: APICartProduct): IProductCart => {
    return {
        // Map product data from nested structure
        id: apiProduct.product.data.id,
        name: apiProduct.product.data.attributes.name,
        price: apiProduct.product.data.attributes.price,
        price_before_offer: apiProduct.product.data.attributes.price_before_offer,
        description: apiProduct.product.data.attributes.description,
        images: apiProduct.product.data.attributes.image.data.map((el: IImageStrapi) => {
            return useImageFromStrapi(el?.attributes?.url)
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