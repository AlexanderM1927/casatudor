export const useFavoritesStore = defineStore('favorites', {
    state: () => {
        const products: Product[] = []
        return {
            products
        }
    },
    actions: {
        addProducts(product: Product) {
            let isOnCart = false
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].id === product.id) {
                    isOnCart = true
                }
            }
            if (!isOnCart) this.products.push(product)
        },
        set (products: [Product]) {
            this.products = products
        },
        removeProducts(product: Product) {
            const indexProduct =  this.products.findIndex((elProduct: Product) => elProduct.id === product.id)
            this.products.splice(indexProduct, 1)
        }
    },
    getters: {
        getProducts: (state) => {
            return state.products.sort((a: Product, b: Product) => {
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