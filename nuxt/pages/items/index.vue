<template>
    <div class="container custom-container">
        <template v-if="!isLoading">
            <h2>Tienda</h2>
            <div class="store">
                <div class="store__filters">
                    <h4>Ordenar por:</h4>
                    <select class="form-select" v-model="orderBy">
                        <option value=""> </option>
                        <option value="price:asc">De menor a mayor precio</option>
                        <option value="price:desc">De mayor a menos precio</option>
                    </select>
                    <h4>Buscador</h4>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">
                            <Icon name="material-symbols:search" color="black" />
                        </span>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Producto..."
                            v-model="productNameFilter"
                        >
                    </div>
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

const products: Ref<IProduct[]> = ref([])
const categories: Ref<ICategory[]> = ref([])
const priceFilterMin: Ref<string> = ref('')
const priceFilterMax: Ref<string> = ref('')
const productsFiltered: Ref<IProduct[]|null> = ref(null)
const categoryFiltered: Ref<ICategory|null> = ref(null)
const productNameFilter: Ref<string> = ref('')
const orderBy: Ref<string> = ref('')
const { debounce } = useDebounce()

const paginatorProducts: Ref<IPaginator> = ref({
    currentPage: 1,
    lastPage: 0,
    url: '',
    data: []
})

const paginatorCategories: Ref<IPaginator> = ref({
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
        isLoading.value = true
        getProductsByFilter()
        isLoading.value = false
    }, 1500)
})

watch(orderBy, (val) => {
    getProductsByFilter()
})

const filterProducts = () => {
    const minPrice = priceFilterMin.value ? parseFloat(priceFilterMin.value) : 0
    const maxPrice = priceFilterMax.value ? parseFloat(priceFilterMax.value) : 0
    const category = categoryFiltered.value
    const nameFilter = productNameFilter.value
    const orderByValue = orderBy.value

    let productsFilteredToShow: IProduct[] = products.value.filter((product: IProduct) => {
        const productPrice = product.price

        let validate = true
        if (minPrice != 0 && maxPrice == 0) validate = productPrice >= minPrice
        else if (minPrice == 0 && maxPrice != 0) validate = productPrice <= maxPrice
        else if (minPrice != 0 && maxPrice != 0) validate = productPrice >= minPrice && productPrice <= maxPrice
        
        return validate
    })

    if (category && category.id) {
        productsFilteredToShow = productsFilteredToShow.filter((product: IProduct) => {
            return product.category?.data?.id === category.id
        })
    }

    if (nameFilter && nameFilter != '') {
        productsFilteredToShow = productsFilteredToShow.filter((product: IProduct) => {
            return product.name.toLowerCase().includes(nameFilter.toLowerCase())
        })
    }

    if (orderByValue && orderByValue != '') {
        productsFilteredToShow = productsFilteredToShow.sort((productA: IProduct, productB: IProduct) => {
            if (orderByValue === 'price:asc') {
                return productA.price - productB.price
            } else if (orderByValue === 'price:desc') {
                return productB.price - productA.price
            } else {
                return 0
            }
        })
    }

    productsFiltered.value = productsFilteredToShow
}

const getProducts = async (newPage: number = 1) => {
    paginatorProducts.value.currentPage = newPage
    isLoading.value = true
    const { data, meta }: any = await productService.getProducts(paginatorProducts.value.currentPage)
    products.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const product: IProduct = {
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

const getProductsByFilter = async () => {
    isLoading.value = true
    const sort = orderBy.value
    const nameFilter = productNameFilter.value
    const category = categoryFiltered.value
    const { data, meta }: any = await productService.getProductsWithFilters(paginatorProducts.value.currentPage, nameFilter, category, sort)
    products.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const product: IProduct = {
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
        const category: ICategory = {
            ...attributes,
            id: id
        }
        return category
    })
    for (let i = 0; i < categoriesToShow.length; i++) {
        const element = categoriesToShow[i]
        const isOnCategories = categories.value.find((cate: ICategory) => {
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

const filterByCategory = (category: ICategory) => {
    categoryFiltered.value = category
    getProductsByFilter()
}

const setDefaultProducts = () => {
    orderBy.value = ''
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