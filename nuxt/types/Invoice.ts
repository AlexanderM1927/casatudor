import type { IProductCart } from "./ProductCart"

export interface IInvoice {
    id: number,
    total?: number
    totalPaid?: number,
    paymentStatus?: string,
    products: IProductCart[]
}