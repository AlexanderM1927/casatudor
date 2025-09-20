export const useGetUserCart = async () => {
    try {
        const cartReq: any = await $fetch('/api/cart/me', {
            method: 'GET'
        })

        return cartReq.cart?.data[0] || null
    } catch (error) {
        console.error('Error fetching cart:', error)
    }
}