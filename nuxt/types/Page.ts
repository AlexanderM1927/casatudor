import type { ICategory } from './Category';

export interface IPage {
    id: number,
    urlId: string,
    urlTitle: string,
    title: string,
    content: string,
    subpages: {
        data?: IPage[]
    },
    categories?: {
        data?: ICategory[]
    },
    isHeaderLink: boolean
}