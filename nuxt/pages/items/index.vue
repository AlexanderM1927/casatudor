<template>
    <div v-if="!isLoading" class="container custom-container">
        <h2>Tienda</h2>
        <div class="store">
            <div class="store__filters">
                <h4>Categorias</h4>
                <ul>
                    <li
                        class="store__category"
                        @click="setDefaultProducts"
                    >
                        Todos
                    </li>
                    <li 
                        v-for="(category, index) in categories" 
                        :key="index"
                        class="store__category"
                        @click="filterProducts(category)"
                    >
                        {{ category.name }}
                    </li>
                </ul>
                <h4>Filtrar por precio</h4>
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
                <div class="row" v-if="!productsFiltered">
                    <Product 
                        v-for="(product, index) in products"
                        :product="product"
                        :childClass="`col-md-4 col-xs-12`"
                        :key="index"
                    ></Product>
                </div>
                <div class="row" v-else-if="productsFiltered.length === 0">
                    <div class="col-12">
                        <b>No hay productos en esta categoria</b>
                    </div>
                    <Product 
                        v-for="(product, index) in products"
                        :product="product"
                        :childClass="`col-md-4 col-xs-12`"
                        :key="index"
                    ></Product>
                </div>
                <div class="row" v-else>
                    <Product 
                        v-for="(product, index) in productsFiltered"
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
import ProductService from '@/services/ProductService';
import CategoryService from '@/services/CategoryService';
import { useImageFromStrapi } from '@/composables/useImageFromStrapi'

const productService = new ProductService(useRuntimeConfig())
const categoryService = new CategoryService(useRuntimeConfig())

const isLoading: Ref<Boolean> = ref(true);

const products: Ref<[]> = ref([])
const categories: Ref<[]> = ref([])
const priceFilterMin: Ref<string> = ref('')
const priceFilterMax: Ref<string> = ref('')
const productsFiltered: Ref<[]> = ref(null)

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
        const product: Product = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return product
    })
    paginator.value = {
        currentPage: newPage,
        lastPage: meta.pagination.pageCount,
        data: products.value,
        url: ''
    }

    isLoading.value = false
}

const getCategories = async (newPage: number = 1) => {
    isLoading.value = true
    const { data, meta }: any = await categoryService.getCategories(newPage)
    categories.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const category: Category = {
            ...attributes,
            id: id
        }
        return category
    })

    isLoading.value = false
}

const filterProducts = (category) => {
    productsFiltered.value = products.value.filter((product) => {
        return product.category.data?.id === category.id
    })
}

const setDefaultProducts = () => {
    productsFiltered.value = products.value
}

onMounted(() => {
    getCategories()
    getProducts()
})
</script>
<style lang="scss" scoped>
@import "@/styles/_colors.scss";
@import "@/styles/_breakpoints.scss";
.store {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 1rem;
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
    background-color: $darkBlue;
    padding: 2rem;
    border-radius: 1rem;
    color: white;
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

.store__category {
    cursor: pointer;
    text-decoration: underline;
    opacity: 0.5;
}

.store__category:hover {
    opacity: 1;
}
</style>