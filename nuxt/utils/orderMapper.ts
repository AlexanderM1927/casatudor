import type { IOrder } from '~/types/Order'
import type { APICartProduct } from './cartMapper'

// Strapi v5: flat structure, no data/attributes wrapper on relations
interface APIOrder {
    id: number,
    documentId?: string,
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
        id: number,
        total?: number,
        totalPaid?: number,
        paymentStatus?: string,
        products: APICartProduct[]
    },
    users_permissions_user: {
        id: number,
        username: string,
        firstName: string,
        lastName: string,
        identify?: string,
        email: string,
        logged: boolean
    }
}

export const mapAPIOrderToIOrder = (order: APIOrder): IOrder => {
    return {
        id: order?.id,
        address1: order?.address1,
        addresDetails: order?.addresDetails,
        city: order?.city,
        country: order?.country,
        department: order?.department,
        email: order?.email,
        phone: order?.phone,
        shipmentAgency: order?.shipmentAgency,
        shipmentGuide: order?.shipmentGuide,
        createdAt: order?.createdAt,
        invoice: {
            id: order.invoice?.id,
            total: order.invoice?.total,
            totalPaid: order.invoice?.totalPaid,
            paymentStatus: order.invoice?.paymentStatus,
            products: order.invoice?.products?.map((product: APICartProduct) => ({
                id: product.product?.id,
                name: product.product?.name,
                images: (product.product?.image || []).map((el) => {
                    return useImageFromStrapi(el?.url)
                }),
                price: product.product?.price,
                description: product.product?.description,
                price_before_offer: product.product?.price_before_offer,
                quantity: product.quantity,
                selectedVariants: product.selectedVariants,
            })) || [],
        },
        user: {
            id: order.users_permissions_user?.id,
            username: order.users_permissions_user?.username,
            firstName: order.users_permissions_user?.firstName,
            lastName: order.users_permissions_user?.lastName,
            identify: order.users_permissions_user?.identify,
            email: order.users_permissions_user?.email,
            logged: order.users_permissions_user?.logged
        }
    }
}

export const mapAPIOrderToIOrders = (orders: APIOrder[]): IOrder[] => {
    return orders?.map((order) => mapAPIOrderToIOrder(order)) || []
}