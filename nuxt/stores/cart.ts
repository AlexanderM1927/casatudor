import type { IProductCart } from "~/types/ProductCart"

export const useCartStore = defineStore('cart', {
    state: () => {
        const id: number | null = null
        const products: IProductCart[] = []
        return {
            id,
            products
        }
    },
    actions: {
        addProducts(product: IProductCart) {
            let isOnCart = false
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].id === product.id &&
                    this.products[i].selectedVariants?.color === product.selectedVariants?.color &&
                    this.products[i].selectedVariants?.size === product.selectedVariants?.size) {
                    isOnCart = true
                    this.products[i].quantity = this.products[i].quantity + 1
                }
            }
            if (!isOnCart) this.products.push(product)
            this.syncCartWithStrapi()
        },
        removeProducts(product: IProductCart) {
            const indexProduct =  this.products.findIndex((elProduct: IProductCart) => elProduct.id === product.id)
            this.products.splice(indexProduct, 1)
            this.syncCartWithStrapi()
        },
        setCart(id: number, products: IProductCart[]) {
            if (this.products.length > 0) return
            this.id = id
            this.products = products
        },
        clearCart() {
            this.products = []
            this.id = null
            console.log('CART CLEARED')
        },
        async syncCartWithStrapi() {
            const { user } = useAuth()
            if (!user.value) return // Only sync for logged-in users
            
            try {
                const cartData = {
                    data: {
                        users_permissions_user: user.value.id,
                        products: this.products.map((product: IProductCart) => ({
                            product: product.id,
                            quantity: product.quantity,
                            selectedVariants: {
                                color: product?.selectedVariants?.color,
                                size: product?.selectedVariants?.size
                            }
                        }))
                    }
                }
                if (this.id) {
                    await $fetch('/api/cart/update', {
                        method: 'POST',
                        body: {
                            id: this.id,
                            ...cartData
                        }
                    })
                } else {
                    const req: any = await $fetch('/api/cart/create', {
                        method: 'POST',
                        body: {
                            id: this.id,
                            ...cartData
                        }
                    })
                    this.id = req?.data?.id || null
                }
            } catch (error) {
                console.error('Failed to sync cart with Strapi:', error)
            }
        },
        async getUserCart () {
            const { user } = useAuth()
            const useCart = await useGetUserCart(user.value)
            if (!useCart) {
                this.syncCartWithStrapi()
            }
            const cartProducts = useCart?.attributes?.products || []
        
            const productCarts: IProductCart[] = mapAPICartProductsToIProductCarts(cartProducts)
            this.setCart(useCart.id, productCarts)
        }
    },
    getters: {
        getProductsCart: (state) => {
            return state.products.sort((a: IProductCart, b: IProductCart) => {
                const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                // names must be equal
                return 0;
            })
        }
    }
  })