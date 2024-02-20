<template>
    <div class="container custom-container">
        <h2>Store</h2>
        <div class="row">
            <Product 
                v-for="(product, index) in products"
                :product="product"
                :childClass="`col-md-3 col-xs-12`"
                :key="index"
            ></Product>
        </div>
    </div>
</template>
<script setup lang="ts">

const products: Product[] = [
    {
        id: 1,
        name: 'Product1',
        image: 'img/bgjpg.jpg'
    },
    {
        id: 2,
        name: 'Product2',
        image: 'img/bgjpg.jpg'
    },
    {
        id: 3,
        name: 'Product3',
        image: 'img/bgjpg.jpg'
    },
    {
        id: 4,
        name: 'Product4',
        image: 'img/bgjpg.jpg'
    }
]
</script>