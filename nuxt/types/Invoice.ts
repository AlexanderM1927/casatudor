export interface IInvoice {
    id: number,
    total?: number
    totalPaid?: number,
    paymentStatus?: string
}