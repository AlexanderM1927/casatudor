<template>
    <template v-if="!isLoading">
        <section class="container-index">
            <!-- Hero image with high priority -->
            <NuxtImg
                :src="useImageFromStrapi(image)"
                :alt="title"
                class="hero-background"
                fetchpriority="high"
                format="webp"
                sizes="100vw"
                preload
            />
            <div :class="`hero-text ${type === 'xs' ? 'hero-text-center' : ''}`">
                <h2 class="title">
                    {{ title }}
                </h2>
                <p style="white-space: pre-line;">{{ description }}</p>
            </div>
        </section>
        <TopCategories></TopCategories>
        <LatestPosts></LatestPosts>
        <LatestProducts></LatestProducts>
    </template>
    <template v-else>
        <LoadingComponent
            :isLoading="isLoading"
            :id="1"
        ></LoadingComponent>
    </template>
</template>
<script setup lang="ts">
import { useBreakpoints } from '@/composables/useBreakpoints'
import { useImageFromStrapi } from '@/composables/useImageFromStrapi'
import ContentService from '@/services/ContentService'

const { type } = useBreakpoints()

const title: Ref<string> = ref('')
const description: Ref<string> = ref('')
const image: Ref<string> = ref('')
const isLoading: Ref<Boolean> = ref(true)

const appConfig = useRuntimeConfig()
const contentService = new ContentService(appConfig)


const getContent = async () => {
    isLoading.value = true
    try {
        const { data }: any = await contentService.getContent()
        // Single type returns data directly, not in an array
        const { attributes } = data
        title.value = attributes.titleHomePage
        description.value = attributes.descriptionHomePage
        image.value = attributes.imageHomePage.data.attributes.url
    } catch (e) {
        console.log(e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    getContent()
})

</script>

<style lang="scss" scoped>

.container-index {
    position: relative;
    width: 100%;
    min-height: 100vh;
    z-index: 1;
    padding-top: 5rem;
    padding-left: 2rem;
    padding-right: 2rem;
    color: white;
    overflow: hidden; /* Prevent image overflow */
}

.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}

.hero-text {
    position: relative;
    z-index: 1;
    padding: 2rem;
    border-radius: 1rem;
    width: 20rem;
    max-width: calc(100% - 2rem); /* Ensure it doesn't overflow on mobile */
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .container-index {
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 3rem;
    }
    
    .hero-text {
        padding: 1.5rem;
        width: 100%;
        max-width: none;
    }
    
    .hero-background {
        /* Ensure full coverage on mobile */
        width: 100vw;
        height: 100vh;
        object-position: center center;
    }
}

.hero-text-center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
</style>
