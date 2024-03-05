<template>
    <div v-if="!isLoading" class="container custom-container">
        <h2>Tienda</h2>
        <div class="store">
            <div class="store__filters">
                <h4>Categorias</h4>
                <ul>
                    <li 
                        v-for="(category, index) in categories" 
                        :key="index"
                        :class="`store__category ${categoryFiltered?.id === category.id ? 'category-selected' : ''}`"
                        @click="filterByCategory(category)"
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
                <br>
                <button class="btn btn-danger" @click="setDefaultProducts">Quitar filtros</button>
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
                        <b>No hay productos con estos filtros</b>
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
const categoryFiltered: Ref<{}> = ref(null)

const paginator: Ref<Paginator> = ref({
    currentPage: 1,
    lastPage: 0,
    url: '',
    data: []
})

watch(priceFilterMin, (val) => {
    filterProducts()
})

watch(priceFilterMax, (val) => {
    filterProducts()
})

const filterProducts = () => {
    const minPrice = priceFilterMin.value ? parseFloat(priceFilterMin.value) : 0
    const maxPrice = priceFilterMax.value ? parseFloat(priceFilterMax.value) : 0
    const category = categoryFiltered.value

    let productsFilteredToShow = products.value.filter((product) => {
        const productPrice = product.price

        let validate = true
        if (minPrice != '' && maxPrice == '') validate = productPrice >= minPrice
        else if (minPrice == '' && maxPrice != '') validate = productPrice <= maxPrice
        else if (minPrice != '' && maxPrice != '') validate = productPrice >= minPrice && productPrice <= maxPrice

        return validate
    })

    if (category && category != '') {
        productsFilteredToShow = productsFilteredToShow.filter((product) => {
            return product.category.data?.id === category.id
        })
    }

    productsFiltered.value = productsFilteredToShow
}

const getProducts = async (newPage) => {
    if (newPage) {
        paginator.value.currentPage = newPage
    }
    isLoading.value = true
    const { data, meta }: any = await productService.getProducts(paginator.value.currentPage)
    products.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const product: Product = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return product
    })
    paginator.value = {
        currentPage: meta.pagination.page,
        lastPage: meta.pagination.pageCount,
        data: products.value,
        url: ''
    }

    isLoading.value = false
}

const getProductsByCategory = async (categoryId) => {
    isLoading.value = true
    const { data, meta }: any = await productService.getProductsByCategory(paginator.value.currentPage, categoryId)
    products.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const product: Product = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return product
    })
    paginator.value = {
        currentPage: meta.pagination.page,
        lastPage: meta.pagination.pageCount,
        data: products.value,
        url: ''
    }
    filterProducts()
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

const filterByCategory = (category) => {
    categoryFiltered.value = category
    getProductsByCategory(categoryFiltered.value.id)
}

const setDefaultProducts = () => {
    categoryFiltered.value = null
    priceFilterMax.value = ''
    priceFilterMin.value = ''
    productsFiltered.value = null
    getProducts()
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

.category-selected {
    opacity: 1;
}
</style>