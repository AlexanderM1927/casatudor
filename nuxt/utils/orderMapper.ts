import type { IImageStrapi } from '~/types/ImageStrapi'
import type { IOrder } from '~/types/Order'

interface APIOrder {
    id: number,
    address1: string,
    addresDetails: string,
    city: string,
    country: string,
    department: string,
    email: string,
    phone: string,
    shipmentAgency: string,
    shipmentGuide: string,
    createdAt: string,
    invoice: {
        data: {
            id: number,
            attributes: {
                total?: number
                totalPaid?: number,
                paymentStatus?: string,
                products: APICartProduct[]
            }
        }
    },
    users_permissions_user: {
        data: {
            id: number,
            attributes: {
                username: string,
                firstName: string,
                lastName: string,
                identify?: string,
                email: string,
                logged: boolean
            }
        }
    }
}

export const mapAPIOrderToIOrder = (order: APIOrder): IOrder => {
    return {
        id: order.id,
        address1: order.address1,
        addresDetails: order.addresDetails,
        city: order.city,
        country: order.country,
        department: order.department,
        email: order.email,
        phone: order.phone,
        shipmentAgency: order.shipmentAgency,
        shipmentGuide: order.shipmentGuide,
        createdAt: order.createdAt,
        invoice: {
            id: order.invoice.data.id,
            ...order.invoice.data.attributes,
            products: order.invoice.data.attributes.products.map((product: APICartProduct) => ({
                id: product.product.data.id,
                name: product.product.data.attributes.name,
                images: product.product.data.attributes.image.data.map((el: IImageStrapi) => {
                    return useImageFromStrapi(el?.attributes?.url)
                }),
                price: product.product.data.attributes.price,
                description: product.product.data.attributes.description,
                price_before_offer: product.product.data.attributes.price_before_offer,
                quantity: product.quantity,
                selectedVariants: product.selectedVariants,
            })),
        },
        user: {
            id: order.users_permissions_user.data.id,
            ...order.users_permissions_user.data.attributes
        }
    }
}

export const mapAPIOrderToIOrders = (orders: APIOrder[]): IOrder[] => {
    return orders.map((order) => mapAPIOrderToIOrder(order))
}