<template>
    <div class="first-container">
        <h2 class="title">{{ page.title }}</h2>
        <Markdown :source="page.content" />
        <template v-if="!isLoading && page.category && page.category.data">
            <div class="row">
                <Product 
                    v-for="(product, index) in page.category.data.products"
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
import PageService from '@/services/PageService'
import ProductService from '@/services/ProductService'
const route = useRoute()

const isLoading: Ref<Boolean> = ref(true);

const page: Ref<IPage> = ref({
    id: 1,
    title: '',
    content: '',
    urlId: '',
    urlTitle: '',
    subpages: {}
})

const appConfig = useRuntimeConfig()
const pageService = new PageService(appConfig)
const productService = new ProductService(appConfig)

const paginatorProducts: Ref<IPaginator> = ref({
    currentPage: 1,
    pageCount: 0,
    url: '',
    data: []
})


const getPage = async (newPage: number = 1) => {
    isLoading.value = true
    const { data }: any = await pageService.getSinglePageByUrlId(route.params.id)
    page.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const page: IPage = {
            ...attributes,
            id: id
        }
        return page
    })[0]
    getProducts()
    isLoading.value = false
}

const getProducts = async (newPage = 1) => {
    if (page.value && page.value.category && page.value.category.data) {
        paginatorProducts.value.currentPage = newPage
        isLoading.value = true
        const categoryId = page.value.category.data.id
        const { data, meta }: any = await productService.getProductsWithFilters(paginatorProducts.value.currentPage, '', {
            id: categoryId
        }, '')
        const products = data.map(({ id, attributes }: { id: number, attributes: any }) => {
            const product: IProduct = {
                ...attributes,
                images: attributes.image.data.map((el: IImageStrapi) => {
                    return useImageFromStrapi(el?.attributes?.url)
                }),
                id: id
            }
            return product
        })
        page.value = {
            ...page.value,
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
