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
                sizes="(max-width: 576px) 100vw, 100vw"
                quality="90"
                densities="1x 2x"
                preload
                loading="eager"
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
    height: 100vh;
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
    object-position: center center;
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
        /* Fix for iOS Safari viewport */
        min-height: 100vh;
        min-height: -webkit-fill-available;
        margin-left: 0;
        margin-right: 0;
        /* Ensure full width on mobile */
        width: 100vw;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
    }
    
    .hero-text {
        padding: 1.5rem;
        width: 100%;
        max-width: none;
        /* Ensure proper positioning on mobile */
        position: relative;
        transform: none;
    }
    
    .hero-background {
        /* Ensure full coverage on mobile - iOS Safari fix */
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        height: -webkit-fill-available;
        object-fit: cover;
        object-position: center center;
        z-index: -1;
        /* Force hardware acceleration for better performance */
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
    }
}

.hero-text-center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    /* Ensure proper mobile centering */
    width: calc(100% - 2rem);
    max-width: 90%;
}
</style>
