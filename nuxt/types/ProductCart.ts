import type { IProduct } from './Product';
export interface IProductCart extends IProduct {
    quantity: number,
    selectedVariants?: {
        color?: String,
        size?: String
    }
}