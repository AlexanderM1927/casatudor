<template>
    <template v-if="!isLoading">
        <BannerSlider />
        <TopCategories></TopCategories>
        <LatestProducts></LatestProducts>
        <LatestPosts></LatestPosts>
    </template>
    <template v-else>
        <LoadingComponent
            :isLoading="isLoading"
            :id="1"
        ></LoadingComponent>
    </template>
</template>
<script setup lang="ts">
import BannerSlider from '@/components/BannerSlider.vue'
import TopCategories from '@/components/TopCategories.vue'
import LatestProducts from '@/components/LatestProducts.vue'
import LatestPosts from '@/components/LatestPosts.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useSeo } from '@/composables/useSeo'

const { setSeoMeta } = useSeo()
const config = useRuntimeConfig()

const isLoading: Ref<Boolean> = ref(true)

// Configurar SEO para la página principal
setSeoMeta({
    title: config.public.storeName,
    description: config.public.description,
    image: '/img/logo.webp'
})

// Simple loading state management
onMounted(() => {
    // Set loading to false after a short delay to allow components to initialize
    setTimeout(() => {
        isLoading.value = false
    }, 100)
})
</script>

<style lang="scss" scoped>
/* Page-specific styles can be added here if needed */
</style>
