<template>
    <div class="first-container">
        <h2 class="title">{{ subPage.title }}</h2>
        <Markdown :source="subPage.content" />
        <template v-if="!isLoading && categoryData && categoryData.products">
            <div class="row">
                <Product 
                    v-for="(product, index) in categoryData.products"
                    :product="product"
                    :childClass="`col-md-3 col-xs-12`"
                    :key="index"
                ></Product>
            </div>
            <div class="row">
                <Paginator
                    @getAction="getProducts"
                    :data="paginatorProducts"
                ></Paginator>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
import SubPageService from '@/services/SubPageService';
import ProductService from '@/services/ProductService'
import { sortByField } from '~/helpers/SortHelper'
import type { IPage } from '~/types/Page';
import type { IPaginator } from '~/types/Paginator';
import type { IProduct } from '~/types/Product';
import type { IImageStrapi } from '~/types/ImageStrapi';
const route = useRoute()

const isLoading: Ref<Boolean> = ref(true);

const subPage: Ref<IPage> = ref({
    id: 1,
    title: '',
    content: '',
    urlId: '',
    urlTitle: '',
    subpages: {},
    isHeaderLink: false
})

// Datos de categoría separados ya que no están en el tipo IPage
const categoryData: Ref<any> = ref(null)

const appConfig = useRuntimeConfig()
const subPageService = new SubPageService(appConfig)
const productService = new ProductService(appConfig)
const paginatorProducts: Ref<IPaginator> = ref({
    currentPage: 1,
    pageCount: 0,
    url: '',
    data: []
})

const getPage = async (newPage: number = 1) => {
    isLoading.value = true
    const { data }: any = await subPageService.getSinglePageByUrlId(route.params.id)
    const pageData = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        return {
            page: {
                id: id,
                title: attributes.title,
                content: attributes.content,
                urlId: attributes.urlId,
                urlTitle: attributes.urlTitle,
                subpages: attributes.subpages || {},
                isHeaderLink: attributes.isHeaderLink || false
            },
            category: attributes.category?.data || null
        }
    })[0]
    
    subPage.value = pageData.page
    
    if (pageData.category) {
        categoryData.value = {
            id: pageData.category.id,
            products: []
        }
        await getProducts()
    }
    
    isLoading.value = false
}

const getProducts = async (newPage: string | number = 1) => {
    const pageNumber = typeof newPage === 'string' ? parseInt(newPage) : newPage
    
    if (categoryData.value) {
        paginatorProducts.value.currentPage = pageNumber
        isLoading.value = true
        const categoryId = categoryData.value.id
        const { data, meta }: any = await productService.getProductsWithFilters(pageNumber, '', {
            id: categoryId
        }, '')
        const mappedProducts = data.map(({ id, attributes }: { id: number, attributes: any }) => {
            const product: IProduct = {
                ...attributes,
                images: attributes.image.data.map((el: IImageStrapi) => {
                    return useImageFromStrapi(el?.attributes?.url)
                }),
                id: id
            }
            return product
        })
        const products = sortByField(mappedProducts)
        categoryData.value = {
            id: categoryId,
            products: products
        }
        paginatorProducts.value = {
            currentPage: meta.pagination.page,
            pageCount: meta.pagination.pageCount,
            data: products,
            url: ''
        }
        isLoading.value = false
    }
}

// Usar useAsyncData para que funcione tanto en SSR como en cliente
await useAsyncData(`subpage-${route.params.id}`, async () => {
    await getPage()
    return subPage.value
}, {
    watch: [() => route.params.id]
})
</script>
