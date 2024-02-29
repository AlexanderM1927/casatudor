<template>
    <div class="container custom-container">
        <h2>{{ title }}</h2>
        <span style="white-space: pre-line;">{{ description }}</span>
    </div>
</template>

<script setup lang="ts">
import ContentService from '../services/ContentService'

const title: Ref<any> = ref(null)
const description: Ref<any> = ref(null)

const getContent = async () => {
    const { data }: any = await ContentService.getContent()
    console.log('data', data)
    title.value = data[0]?.attributes.titleInfoPage
    description.value = data[0]?.attributes.descriptionInfoPage
}

onMounted(() => {
    getContent()
})
</script>