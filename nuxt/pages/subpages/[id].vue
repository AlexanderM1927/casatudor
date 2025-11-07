<template>
    <div class="first-container">
        <h2 class="title">{{ subPage.title }}</h2>
        <Markdown :source="subPage.content" />
        <template v-if="!isLoading && subPage.category && subPage.category.data">
            <div class="row">
                <Product 
                    v-for="(product, index) in subPage.category.data.products"
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
    subpages: {}
})

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
    subPage.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const subPage: IPage = {
            ...attributes,
            id: id
        }
        return subPage
    })[0]

    getProducts()
    isLoading.value = false
}

const getProducts = async (newPage = 1) => {
    if (subPage.value && subPage.value.category && subPage.value.category.data) {
        paginatorProducts.value.currentPage = newPage
        isLoading.value = true
        const categoryId = subPage.value.category.data.id
        const { data, meta }: any = await productService.getProductsWithFilters(paginatorProducts.value.currentPage, '', {
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
        subPage.value = {
            ...subPage.value,
            category: {
                data: {
                    id: categoryId,
                    products: products
                }
            }
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

onMounted(() => {
    getPage()
})
</script>
