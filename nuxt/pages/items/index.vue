<template>
    <div v-if="!isLoading" class="container custom-container">
        <h2>Store</h2>
        <div class="store">
            <div class="store__filters">
                <h4>Categories</h4>
                <ul>
                    <li>Cat 1</li>
                    <li>Cat 1</li>
                    <li>Cat 1</li>
                    <li>Cat 1</li>
                </ul>
                <h4>Filter by price</h4>
                <div class="store__filters-price">
                    <input 
                        class="form-control"
                        placeholder="Min"
                        type="text"
                        v-model="priceFilterMin"
                    >
                    <span>-</span>
                    <input 
                        class="form-control"
                        placeholder="Max"
                        type="text"
                        v-model="priceFilterMax"
                    > 
                </div> 
            </div>
            <div class="store__products">
                <div class="row">
                    <Product 
                        v-for="(product, index) in products"
                        :product="product"
                        :childClass="`col-md-4 col-xs-12`"
                        :key="index"
                    ></Product>
                </div>
            </div>
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
const priceFilter: Ref<number> = ref(50000)

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
<style lang="scss" scoped>
@import "../styles/_colors.scss";
@import "../styles/_breakpoints.scss";
.store {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .store {
        flex-direction: column;
    }
    .store__filters {
        margin-bottom: 3rem;
    }
}

.store__filters {
    width: 30rem;
}

.store__products {
    width: 100%;
}

.store__filters-price {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.store__filters-price input{
    width: 6rem;
}
</style>