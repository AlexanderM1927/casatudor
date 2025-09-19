import type { ICategory } from './Category';
export interface IProduct {
    id: number,
    name: string,
    images: string[],
    price: number
    category?: ICategory,
    description?: string,
    colors?: [],
    sizes?: [],
    price_before_offer?: number,
}