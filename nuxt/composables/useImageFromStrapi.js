
export const useImageFromStrapi = (imageUrl) => {
    const runtimeConfig = useRuntimeConfig()

    return runtimeConfig.public.strapiAssets + '' + imageUrl
}