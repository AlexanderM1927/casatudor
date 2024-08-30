<template>
    <div class="container custom-container">
        <h2 class="title">{{ page.title }}</h2>
        <Markdown :source="page.content" />
    </div>
</template>
<script setup lang="ts">
import PageService from '@/services/PageService';
const route = useRoute()

const isLoading: Ref<Boolean> = ref(true);

const page: Ref<IPage> = ref({
    id: 1,
    title: '',
    content: '',
    urlId: '',
    urlTitle: '',
    subpages: {}
})

const pageService = new PageService(useRuntimeConfig())


const getPage = async (newPage: number = 1) => {
    isLoading.value = true
    const { data }: any = await pageService.getSinglePageByUrlId(route.params.id)
    page.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const page: IPage = {
            ...attributes,
            id: id
        }
        return page
    })[0]

    isLoading.value = false
}

onMounted(() => {
    getPage()
})
</script>
