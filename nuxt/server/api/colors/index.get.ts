import { defineEventHandler } from 'h3'
import qs from 'qs'

export default defineEventHandler(async () => {
    const config = useRuntimeConfig()

    const colorsMap = new Map<string, { name: string, hexadecimal: string }>()

    let page = 1
    let pageCount = 1

    do {
        const query = qs.stringify({
            populate: ['colors'],
            fields: ['id'],
            pagination: {
                page: page,
                pageSize: 100
            }
        })

        const response: any = await $fetch(config.public.apiBase + '/products?' + query)

        pageCount = response.meta?.pagination?.pageCount || 1

        for (const product of response.data) {
            const colors = product.attributes?.colors || []
            for (const color of colors) {
                if (color.hexadecimal && !colorsMap.has(color.hexadecimal)) {
                    colorsMap.set(color.hexadecimal, {
                        name: color.name,
                        hexadecimal: color.hexadecimal
                    })
                }
            }
        }

        page++
    } while (page <= pageCount)

    return Array.from(colorsMap.values())
})
