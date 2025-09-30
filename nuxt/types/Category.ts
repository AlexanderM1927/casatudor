import type { IProduct } from './Product';

export interface ICategory {
    id: number,
    name: string,
    products?: IProduct[]
    data?: any,
    image?: string
}