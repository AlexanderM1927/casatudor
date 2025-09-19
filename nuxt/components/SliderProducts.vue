<template>
    <div>
        <Slider id="products" :data="data"></Slider>
    </div>
</template>
<script setup lang="ts">
const props = defineProps(
    {
        products: Array<IProduct>
    }
)
const data: Ref<Object[]|undefined> = ref(undefined)

onMounted(() => {
    data.value = props.products?.map((element: IProduct) => {
        const newElement = {
            id: element.id,
            title: element.name,
            description: element.description,
            image: element.images[0]
        }
        return newElement
    })
})
</script>
<style scoped>
.carousel-caption {
    background: white;
}
</style>
