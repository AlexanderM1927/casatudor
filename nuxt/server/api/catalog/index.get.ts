import { defineEventHandler, setResponseHeaders } from 'h3'
import qs from 'qs'
import PDFDocument from 'pdfkit'

interface StrapiProduct {
    id: number
    attributes: {
        name: string
        description?: string
        price: number
        price_before_offer?: number
        image?: {
            data: Array<{ attributes: { url: string } }>
        }
        colors?: Array<{
            id: number
            name: string
            hexadecimal: string
        }>
        sizes?: Array<{
            id: number
            name: string
        }>
        category?: {
            data?: {
                attributes: { name: string }
            }
        }
    }
}

function formatPrice(value: number): string {
    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
    try {
        const response = await fetch(url)
        if (!response.ok) return null
        const arrayBuffer = await response.arrayBuffer()
        return Buffer.from(arrayBuffer)
    } catch {
        return null
    }
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // Fetch all products from Strapi with pagination
    const allProducts: StrapiProduct[] = []
    let page = 1
    const pageSize = 100

    while (true) {
        const query = qs.stringify({
            populate: ['image', 'colors', 'sizes', 'category'],
            sort: ['sort:asc', 'id:desc'],
            pagination: { page, pageSize },
        })
        const response: any = await $fetch(config.public.apiBase + '/products?' + query)
        if (response.data && response.data.length > 0) {
            allProducts.push(...response.data)
        }
        if (!response.meta?.pagination || page >= response.meta.pagination.pageCount) {
            break
        }
        page++
    }

    if (allProducts.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'No products found' })
    }

    // Prefetch all product images in parallel
    const imageBuffers = new Map<number, Buffer>()
    await Promise.all(
        allProducts.map(async (product) => {
            const images = product.attributes.image?.data
            if (images && images.length > 0) {
                const imageUrl = config.public.strapiAssets + images[0].attributes.url
                const buffer = await fetchImageBuffer(imageUrl)
                if (buffer) {
                    imageBuffers.set(product.id, buffer)
                }
            }
        })
    )

    // Fetch logo
    const logoBuffer = await fetchImageBuffer(config.public.strapiAssets + '/uploads/logo_casatudor.png')
        ?? await fetchImageBuffer(config.public.strapiAssets + '/img/logo.png')

    // Build PDF
    const doc = new PDFDocument({ size: 'A4', margin: 40 })
    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))

    const pdfReady = new Promise<Buffer>((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)))
    })

    const PAGE_WIDTH = 595.28
    const PAGE_HEIGHT = 841.89
    const MARGIN = 40
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
    const PRIMARY_COLOR = '#FF8243'
    const TEXT_COLOR = '#333333'
    const LIGHT_GRAY = '#999999'

    // --- Cover page ---
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill('#F9F4EE')

    if (logoBuffer) {
        try {
            doc.image(logoBuffer, PAGE_WIDTH / 2 - 80, 180, { width: 160, fit: [160, 160] })
        } catch { /* skip logo if format not supported */ }
    }

    doc.fillColor(PRIMARY_COLOR)
        .fontSize(36)
        .font('Helvetica-Bold')
        .text('Catálogo de Productos', MARGIN, 400, { align: 'center', width: CONTENT_WIDTH })

    const storeName = config.public.storeName || ''
    if (storeName) {
        doc.fillColor(TEXT_COLOR)
            .fontSize(18)
            .font('Helvetica')
            .text(storeName, MARGIN, 460, { align: 'center', width: CONTENT_WIDTH })
    }

    const today = new Date()
    const dateStr = today.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    doc.fillColor(LIGHT_GRAY)
        .fontSize(12)
        .text(dateStr, MARGIN, 500, { align: 'center', width: CONTENT_WIDTH })

    doc.fillColor(LIGHT_GRAY)
        .fontSize(11)
        .text(`${allProducts.length} productos`, MARGIN, 520, { align: 'center', width: CONTENT_WIDTH })

    // --- Product pages ---
    for (const product of allProducts) {
        doc.addPage({ size: 'A4', margin: MARGIN })

        const attrs = product.attributes
        let yPos = MARGIN

        // Header line
        doc.moveTo(MARGIN, yPos).lineTo(PAGE_WIDTH - MARGIN, yPos).strokeColor(PRIMARY_COLOR).lineWidth(2).stroke()
        yPos += 15

        // Category badge
        const categoryName = attrs.category?.data?.attributes?.name
        if (categoryName) {
            doc.fillColor(PRIMARY_COLOR)
                .fontSize(9)
                .font('Helvetica-Bold')
                .text(categoryName.toUpperCase(), MARGIN, yPos)
            yPos += 18
        }

        // Product Image
        const imgBuffer = imageBuffers.get(product.id)
        const IMAGE_MAX_HEIGHT = 320
        const IMAGE_MAX_WIDTH = CONTENT_WIDTH

        if (imgBuffer) {
            try {
                doc.image(imgBuffer, MARGIN, yPos, {
                    fit: [IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT],
                    align: 'center',
                    valign: 'center',
                })
            } catch { /* skip if image format not supported */ }
        }
        yPos += IMAGE_MAX_HEIGHT + 20

        // Product name
        doc.fillColor(TEXT_COLOR)
            .fontSize(22)
            .font('Helvetica-Bold')
            .text(attrs.name, MARGIN, yPos, { width: CONTENT_WIDTH })
        yPos = doc.y + 10

        // Price section
        if (attrs.price_before_offer) {
            doc.fillColor(LIGHT_GRAY)
                .fontSize(14)
                .font('Helvetica')

            const beforeText = formatPrice(attrs.price_before_offer)
            const beforeWidth = doc.widthOfString(beforeText)
            doc.text(beforeText, MARGIN, yPos)
            // Strikethrough line
            doc.moveTo(MARGIN, yPos + 8)
                .lineTo(MARGIN + beforeWidth, yPos + 8)
                .strokeColor(LIGHT_GRAY)
                .lineWidth(1)
                .stroke()

            doc.fillColor(PRIMARY_COLOR)
                .fontSize(20)
                .font('Helvetica-Bold')
                .text(formatPrice(attrs.price), MARGIN + beforeWidth + 12, yPos - 3)
            yPos = doc.y + 10
        } else {
            doc.fillColor(PRIMARY_COLOR)
                .fontSize(20)
                .font('Helvetica-Bold')
                .text(formatPrice(attrs.price), MARGIN, yPos)
            yPos = doc.y + 10
        }

        // Separator
        doc.moveTo(MARGIN, yPos).lineTo(PAGE_WIDTH - MARGIN, yPos).strokeColor('#E0E0E0').lineWidth(0.5).stroke()
        yPos += 15

        // Description
        if (attrs.description) {
            doc.fillColor(TEXT_COLOR)
                .fontSize(10)
                .font('Helvetica-Bold')
                .text('Descripción:', MARGIN, yPos)
            yPos = doc.y + 4

            // Strip markdown syntax for plain text display
            const plainDescription = attrs.description
                .replace(/[#*_~`>]/g, '')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .replace(/\n{3,}/g, '\n\n')
                .trim()

            doc.fillColor(TEXT_COLOR)
                .fontSize(10)
                .font('Helvetica')
                .text(plainDescription, MARGIN, yPos, {
                    width: CONTENT_WIDTH,
                    lineGap: 3,
                    height: 120,
                    ellipsis: true,
                })
            yPos = doc.y + 12
        }

        // Colors
        if (attrs.colors && attrs.colors.length > 0) {
            doc.fillColor(TEXT_COLOR)
                .fontSize(10)
                .font('Helvetica-Bold')
                .text('Colores:', MARGIN, yPos)
            yPos = doc.y + 6

            let xPos = MARGIN
            for (const color of attrs.colors) {
                if (xPos + 30 > PAGE_WIDTH - MARGIN) {
                    xPos = MARGIN
                    yPos += 28
                }
                // Color circle
                doc.circle(xPos + 9, yPos + 9, 9)
                    .fillAndStroke(color.hexadecimal, '#CCCCCC')
                // Color name below
                doc.fillColor(LIGHT_GRAY)
                    .fontSize(7)
                    .font('Helvetica')
                    .text(color.name, xPos - 4, yPos + 21, { width: 30, align: 'center' })
                xPos += 35
            }
            yPos += 38
        }

        // Sizes
        if (attrs.sizes && attrs.sizes.length > 0) {
            doc.fillColor(TEXT_COLOR)
                .fontSize(10)
                .font('Helvetica-Bold')
                .text('Tallas:', MARGIN, yPos)
            yPos = doc.y + 6

            let xPos = MARGIN
            for (const size of attrs.sizes) {
                const sizeWidth = Math.max(doc.widthOfString(size.name) + 14, 30)
                if (xPos + sizeWidth > PAGE_WIDTH - MARGIN) {
                    xPos = MARGIN
                    yPos += 24
                }
                doc.roundedRect(xPos, yPos, sizeWidth, 20, 3)
                    .strokeColor('#CCCCCC')
                    .lineWidth(0.5)
                    .stroke()
                doc.fillColor(TEXT_COLOR)
                    .fontSize(9)
                    .font('Helvetica')
                    .text(size.name, xPos, yPos + 5, { width: sizeWidth, align: 'center' })
                xPos += sizeWidth + 8
            }
            yPos += 30
        }

        // Footer with page number
        doc.fillColor(LIGHT_GRAY)
            .fontSize(8)
            .font('Helvetica')
            .text(
                `${storeName}  •  Página ${allProducts.indexOf(product) + 2}`,
                MARGIN,
                PAGE_HEIGHT - 30,
                { width: CONTENT_WIDTH, align: 'center' }
            )
    }

    doc.end()
    const pdfBuffer = await pdfReady

    setResponseHeaders(event, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="catalogo-productos.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
    })

    return pdfBuffer
})
