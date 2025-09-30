import type { ICategory } from './Category';

export interface IPage {
    id: number,
    urlId: string,
    urlTitle: string,
    title: string,
    content: string,
    subpages: {
        data?: [IPage]
    },
    category?: {
        data?: [ICategory]
    },
    isHeaderLink: boolean
}