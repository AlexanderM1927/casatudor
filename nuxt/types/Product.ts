import type { ICategory } from './Category';

export interface IColor {
    id: number,
    name: string,
    hexadecimal: string,
    image?: string
}

export interface ISize {
    id: number,
    name: string
}

export interface IProduct {
    id: number,
    name: string,
    images: string[],
    price: number
    category?: ICategory,
    description?: string,
    colors?: IColor[],
    sizes?: ISize[],
    price_before_offer?: number,
}