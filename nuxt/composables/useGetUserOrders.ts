export const useGetUserOrders = async (page: number) => {
    try {
        const ordersReq: any = await $fetch('/api/orders/me', {
            method: 'GET',
            params: {
                page: page
            }
        })

        return ordersReq.orders?.data || null
    } catch (error) {
        console.log('Error fetching cart', error)
        return null
    }
}