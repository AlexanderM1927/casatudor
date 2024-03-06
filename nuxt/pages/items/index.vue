<template>
    <div class="container custom-container">
        <template v-if="!isLoading">
            <h2>Tienda</h2>
            <div class="store">
                <div class="store__filters">
                    <h4>Buscador</h4>
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Producto..."
                        v-model="productNameFilter"
                    >
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
                        <li style="list-style: none;">
                            <PaginatorSeeMore
                                @getAction="getCategories"
                                :data="paginatorCategories"
                            ></PaginatorSeeMore>
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
                    :data="paginatorProducts"
                ></Paginator>
            </div>
        </template>
        <template v-else>
            <LoadingComponent
                :isLoading="isLoading"
                :id="1"
            ></LoadingComponent>
        </template>
    </div>
</template>
<script setup lang="ts">
import ProductService from '@/services/ProductService';
import CategoryService from '@/services/CategoryService';
import { useImageFromStrapi } from '@/composables/useImageFromStrapi'
import { useDebounce } from '@/composables/useDebounce'

const productService = new ProductService(useRuntimeConfig())
const categoryService = new CategoryService(useRuntimeConfig())

const isLoading: Ref<Boolean> = ref(true);

const products: Ref<any> = ref([])
const categories: Ref<any> = ref([])
const priceFilterMin: Ref<string> = ref('')
const priceFilterMax: Ref<string> = ref('')
const productsFiltered: Ref<any> = ref(null)
const categoryFiltered: Ref<any> = ref({})
const productNameFilter: Ref<string> = ref('')
const { debounce } = useDebounce()

const paginatorProducts: Ref<Paginator> = ref({
    currentPage: 1,
    lastPage: 0,
    url: '',
    data: []
})

const paginatorCategories: Ref<Paginator> = ref({
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

watch(productNameFilter, (val) => {
    debounce(() => {
        getProductsByName(val)
    }, 3000)
})

const filterProducts = () => {
    const minPrice = priceFilterMin.value ? parseFloat(priceFilterMin.value) : 0
    const maxPrice = priceFilterMax.value ? parseFloat(priceFilterMax.value) : 0
    const category = categoryFiltered.value
    const nameFilter = productNameFilter.value

    let productsFilteredToShow = products.value.filter((product: Product) => {
        const productPrice = product.price

        let validate = true
        if (minPrice != 0 && maxPrice == 0) validate = productPrice >= minPrice
        else if (minPrice == 0 && maxPrice != 0) validate = productPrice <= maxPrice
        else if (minPrice != 0 && maxPrice != 0) validate = productPrice >= minPrice && productPrice <= maxPrice

        return validate
    })

    if (category && category != '') {
        productsFilteredToShow = productsFilteredToShow.filter((product: Product) => {
            return product.category?.data?.id === category.id
        })
    }

    if (nameFilter && nameFilter != '') {
        productsFilteredToShow = productsFilteredToShow.filter((product: Product) => {
            return product.name.toLowerCase().includes(nameFilter.toLowerCase())
        })
    }

    productsFiltered.value = productsFilteredToShow
}

const getProducts = async (newPage: number = 1) => {
    paginatorProducts.value.currentPage = newPage
    isLoading.value = true
    const { data, meta }: any = await productService.getProducts(paginatorProducts.value.currentPage)
    products.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const product: Product = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return product
    })
    paginatorProducts.value = {
        currentPage: meta.pagination.page,
        lastPage: meta.pagination.pageCount,
        data: products.value,
        url: ''
    }

    isLoading.value = false
}

const getProductsByCategory = async (categoryId: number) => {
    isLoading.value = true
    const { data, meta }: any = await productService.getProductsByCategory(paginatorProducts.value.currentPage, categoryId)
    products.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const product: Product = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return product
    })
    paginatorProducts.value = {
        currentPage: meta.pagination.page,
        lastPage: meta.pagination.pageCount,
        data: products.value,
        url: ''
    }
    filterProducts()
    isLoading.value = false
}

const getProductsByName = async (name: string) => {
    isLoading.value = true
    const { data, meta }: any = await productService.getProductsByName(paginatorProducts.value.currentPage, name)
    products.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const product: Product = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return product
    })
    paginatorProducts.value = {
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
    const categoriesToShow = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const category: Category = {
            ...attributes,
            id: id
        }
        return category
    })
    for (let i = 0; i < categoriesToShow.length; i++) {
        const element = categoriesToShow[i]
        const isOnCategories = categories.value.find((cate: Category) => {
            return cate.id === element.id
        })
        if (!isOnCategories) {
            categories.value.push(element)
        }
    }
    paginatorCategories.value = {
        currentPage: meta.pagination.page,
        lastPage: meta.pagination.pageCount,
        data: categories.value,
        url: ''
    }

    isLoading.value = false
}

const filterByCategory = (category: Category) => {
    categoryFiltered.value = category
    getProductsByCategory(categoryFiltered.value.id)
}

const setDefaultProducts = () => {
    categoryFiltered.value = null
    priceFilterMax.value = ''
    priceFilterMin.value = ''
    productsFiltered.value = null
    productNameFilter.value = ''
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
    background-color: $softBlue;
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