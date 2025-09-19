import type { IUser } from "~/types/User"

export const useGetUserCart = async (user: IUser) => {
    try {
        const cartReq: any = await $fetch('/api/cart/me', {
            method: 'GET',
            params: {
                userId: user.id,
            }
        })

        return cartReq.cart?.data[0] || null
    } catch (error) {
        console.error('Error fetching cart:', error)
    }
}