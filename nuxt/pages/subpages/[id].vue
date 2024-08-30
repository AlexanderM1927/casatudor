<template>
    <div class="container custom-container">
        <h2 class="title">{{ subPage.title }}</h2>
        <Markdown :source="subPage.content" />
    </div>
</template>
<script setup lang="ts">
import SubPageService from '@/services/SubPageService';
const route = useRoute()

const isLoading: Ref<Boolean> = ref(true);

const subPage: Ref<IPage> = ref({
    id: 1,
    title: '',
    content: '',
    urlId: '',
    urlTitle: '',
    subpages: {}
})

const subPageService = new SubPageService(useRuntimeConfig())


const getPage = async (newPage: number = 1) => {
    isLoading.value = true
    const { data }: any = await subPageService.getSinglePageByUrlId(route.params.id)
    subPage.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const subPage: IPage = {
            ...attributes,
            id: id
        }
        return subPage
    })[0]

    isLoading.value = false
}

onMounted(() => {
    getPage()
})
</script>
