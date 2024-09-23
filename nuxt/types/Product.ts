interface IProduct {
    id: number,
    name: string,
    images: string[],
    price: number
    category?: ICategory,
    description?: string,
    colors?: [],
    sizes?: []
}