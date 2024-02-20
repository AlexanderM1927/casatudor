export const useCartStore = defineStore('cart', {
    state: () => {
        const products: ProductCart[] = []
        return {
            products
        }
    },
    actions: {
      addProducts(product: ProductCart) {
        let isOnCart = false
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === product.id) {
                isOnCart = true
                this.products[i].quantity = this.products[i].quantity + 1
            }
        }
        if (!isOnCart) this.products.push(product)
      },
      removeProducts(product: ProductCart) {
        const indexProduct =  this.products.findIndex((elProduct: ProductCart) => elProduct.id === product.id)
        this.products.splice(indexProduct, 1)
      }
    },
    getters: {
        getProductsCart: (state) => {
            return state.products.sort((a: ProductCart, b: ProductCart) => {
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