import type { IProductCart } from "~/types/ProductCart"

export const useCartStore = defineStore('cart', {
    state: () => ({
        id: null as number | null,
        products: [] as IProductCart[]
    }),
    actions: {
        // Load cart from localStorage for guest users
        loadGuestCart() {
            if (process.client) {
                const savedCart = localStorage.getItem('guestCart')
                if (savedCart) {
                    try {
                        const parsedCart = JSON.parse(savedCart)
                        this.products = parsedCart.products || []
                    } catch (error) {
                        console.error('Error loading guest cart:', error)
                    }
                }
            }
        },
        // Save cart to localStorage for guest users
        saveGuestCart() {
            if (process.client) {
                const { user } = useAuth()
                if (!user.value) {
                    localStorage.setItem('guestCart', JSON.stringify({
                        products: this.products
                    }))
                }
            }
        },
        addProducts(product: IProductCart) {
            let isOnCart = false
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].id === product.id &&
                    this.products[i].selectedVariants?.color === product.selectedVariants?.color &&
                    this.products[i].selectedVariants?.size === product.selectedVariants?.size) {
                    this.products[i].quantity = this.products[i].quantity + product.quantity
                    isOnCart = true
                }
            }
            if (!isOnCart) this.products.push(product)
            this.syncCartWithStrapi()
            this.saveGuestCart() // Save for guest users
        },
        removeProducts(product: IProductCart) {
            const indexProduct =  this.products.findIndex((elProduct: IProductCart) => elProduct.id === product.id)
            this.products.splice(indexProduct, 1)
            this.syncCartWithStrapi()
            this.saveGuestCart() // Save for guest users
        },
        updateProductQuantity(product: IProductCart, newQuantity: number) {
            const productIndex = this.products.findIndex((elProduct: IProductCart) => 
                elProduct.id === product.id &&
                elProduct.selectedVariants?.color === product.selectedVariants?.color &&
                elProduct.selectedVariants?.size === product.selectedVariants?.size
            )
            if (productIndex !== -1) {
                if (newQuantity <= 0) {
                    this.products.splice(productIndex, 1)
                } else {
                    this.products[productIndex].quantity = newQuantity
                }
                this.syncCartWithStrapi()
                this.saveGuestCart() // Save for guest users
            }
        },
        setCart(id: number, products: IProductCart[]) {
            if (this.products.length > 0) return
            this.id = id
            this.products = products
        },
        clearCart() {
            this.products = []
            this.id = null
            if (process.client) {
                localStorage.removeItem('guestCart') // Clear guest cart from localStorage
            }
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
            const useCart = await useGetUserCart()
            if (!useCart || this.products.length > 0) {
                return this.syncCartWithStrapi()
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
