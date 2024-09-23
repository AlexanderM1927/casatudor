<template>
    <template v-if="!isLoading">
        <section class="container-index"  :style="`background: url(
                ${
                    useImageFromStrapi(image)
                }
            ); background-size: cover;`">
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
        const { attributes } = data[0]
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
@import "@/styles/_breakpoints.scss";
.container-index {
    position: relative;
    background: url('img/bgjpg.jpg');
    background-size: cover;
    width: 100%;
    min-height: 100vh;
    z-index: 1;
    padding-top: 5rem;
    padding-left: 2rem;
    padding-right: 2rem;
    color: white;
}

.hero-text {
    padding: 2rem;
    border-radius: 1rem;
    width: 20rem;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .hero-text {
        padding: 2rem;
        width: 100%;
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