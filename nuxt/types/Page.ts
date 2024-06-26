interface IPage {
    id: number,
    urlId: string,
    urlTitle: string,
    title: string,
    content: string,
    subpages: {
        data?: [IPage]
    }
}