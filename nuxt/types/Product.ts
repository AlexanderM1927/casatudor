interface IProduct {
    id: number,
    name: string,
    image: string,
    price: number
    category?: ICategory
}