export interface IUser {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    identify?: string,
    phone?: string,
    email: string,
    logged: boolean
}