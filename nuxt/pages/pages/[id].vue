<template>
    <div class="first-container">
        <h2 class="title">{{ page.title }}</h2>
        <Markdown :source="page.content" />
        
        <!-- Mostrar todos los productos mezclados -->
        <template v-if="!isLoading && allProducts.length > 0">
            <div class="row">
                <Product 
                    v-for="(product, index) in allProducts"
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
import { sortByField } from '~/helpers/SortHelper'
import type { IImageStrapi } from '~/types/ImageStrapi';
import type { IPage } from '~/types/Page';
import type { IPaginator } from '~/types/Paginator';
import type { IProduct } from '~/types/Product';
const route = useRoute()

const isLoading: Ref<Boolean> = ref(true);

const page: Ref<IPage> = ref({
    id: 1,
    title: '',
    content: '',
    urlId: '',
    urlTitle: '',
    subpages: {},
    categories: { data: [] },
    isHeaderLink: false
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

const allProducts: Ref<IProduct[]> = ref([])


const getPage = async (newPage: number = 1) => {
    isLoading.value = true
    const { data }: any = await pageService.getSinglePageByUrlId(route.params.id)
    page.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const pageData: IPage = {
            ...attributes,
            id: id
        }
        
        // Mapear las categorías si existen
        if (attributes.categories && attributes.categories.data) {
            pageData.categories = {
                data: attributes.categories.data.map(({ id, attributes: catAttributes }: { id: number, attributes: any }) => ({
                    id,
                    name: catAttributes.name,
                    products: []
                }))
            }
        }
        
        return pageData
    })[0]
    
    await getProducts()
    isLoading.value = false
}

const getProducts = async (newPage = 1) => {
    if (page.value && page.value.categories && page.value.categories.data && page.value.categories.data.length > 0) {
        paginatorProducts.value.currentPage = newPage
        isLoading.value = true
        
        let allProductsFromCategories: IProduct[] = []
        
        // Obtener productos para cada categoría
        for (const category of page.value.categories.data) {
            try {
                const { data, meta }: any = await productService.getProductsWithFilters(
                    paginatorProducts.value.currentPage, 
                    '', 
                    { id: category.id }, 
                    ''
                )
                
                const categoryProducts = data.map(({ id, attributes }: { id: number, attributes: any }) => {
                    const product: IProduct = {
                        ...attributes,
                        images: attributes.image.data.map((el: IImageStrapi) => {
                            return useImageFromStrapi(el?.attributes?.url)
                        }),
                        id: id
                    }
                    return product
                })
                
                // Agregar a la lista total de productos
                allProductsFromCategories = [...allProductsFromCategories, ...categoryProducts]
                
                // Usar la paginación de la primera categoría
                if (category === page.value.categories.data[0]) {
                    paginatorProducts.value = {
                        currentPage: meta.pagination.page,
                        pageCount: meta.pagination.pageCount,
                        data: allProductsFromCategories,
                        url: ''
                    }
                }
            } catch (error) {
                console.error(`Error fetching products for category ${category.id}:`, error)
            }
        }
        
        // Ordenar productos por campo sort (null/undefined al final)
        allProducts.value = sortByField(allProductsFromCategories)
        
        isLoading.value = false
    }
}

onMounted(() => {
    getPage()
})
</script>
