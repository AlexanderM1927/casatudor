export interface IBanner {
  imageForDesktop: string
  imageForMobile?: string
  urlForRedirect?: string
}

export interface IPopupBanner {
    active: boolean,
    image: string,
    link: string
}
