<template>
    <div v-if="!isLoading" class="container custom-container">
        <h2>Store</h2>
        <div class="row">
            <Product 
                v-for="(product, index) in products"
                :product="product"
                :childClass="`col-md-3 col-xs-12`"
                :key="index"
            ></Product>
        </div>
        <div class="row">
            <Paginator 
                @getAction="getProducts"
                :data="paginator"
            ></Paginator>
        </div>
    </div>
</template>
<script setup lang="ts">
import ProductService from '../../services/ProductService';
import { useImageFromStrapi } from '../../composables/useImageFromStrapi'

const productService = new ProductService(useRuntimeConfig())

const isLoading: Ref<Boolean> = ref(true);

const products: Ref<[]> = ref([])

const paginator: Ref<Paginator> = ref({
    currentPage: 1,
    lastPage: 0,
    url: '',
    data: []
})

const getProducts = async (newPage: number = 1) => {
    isLoading.value = true
    const { data, meta }: any = await productService.getProducts(newPage)
    products.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const post: Post = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return post
    })
    paginator.value = {
        currentPage: newPage,
        lastPage: meta.pagination.pageCount,
        data: products.value,
        url: ''
    }

    isLoading.value = false
}

onMounted(() => {
    getProducts()
})
</script>