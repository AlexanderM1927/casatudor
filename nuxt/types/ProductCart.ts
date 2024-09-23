interface IProductCart extends IProduct {
    quantity: number,
    selectedVariants?: {
        color?: String,
        size?: String
    }
}