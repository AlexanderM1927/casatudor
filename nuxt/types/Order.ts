import type { IInvoice } from "./Invoice";
import type { IUser } from "./User";

export interface IOrder {
    id: number,
    address1: string,
    addresDetails: string,
    city: string,
    country: string,
    department: string,
    email: string,
    phone: string,
    shipmentAgency: string,
    shipmentGuide: string,
    invoice: IInvoice,
    user: IUser,
    createdAt: string
}