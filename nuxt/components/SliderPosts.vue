<template>
    <div>
        <Slider :data="data"></Slider>
    </div>
</template>
<script setup lang="ts">
const props = defineProps(
    {
        posts: Array<IPost>
    }
)
const data: Ref<any> = ref([])

onMounted(() => {
    data.value = props.posts?.map((element: IPost) => {
    const newElement = {
        id: element.id,
        title: element.title,
        description: element.summary,
        image: element.image
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