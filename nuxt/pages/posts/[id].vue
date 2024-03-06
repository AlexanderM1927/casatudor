<template>
    <div class="container custom-container">
        <h2>{{ post.title }}</h2>
        <b style="white-space: pre-line;">{{ post.summary }}</b>
        <hr>
        <p style="white-space: pre-line;">{{ post.fullText }}</p>
        <img :title="post.title" :src="post.image" class="d-block w-100" alt="{{ post.tile }}">
    </div>
</template>
<script setup lang="ts">
import PostService from '@/services/PostService';
import { useImageFromStrapi } from '@/composables/useImageFromStrapi'

const route = useRoute()

const isLoading: Ref<Boolean> = ref(true);

const post: Ref<Post> = ref({
    id: 1,
    title: '',
    summary: '',
    image: ''
})

const postService = new PostService(useRuntimeConfig())


const getPost = async (newPage: number = 1) => {
    isLoading.value = true
    const { data }: any = await postService.getSinglePost(route.params.id)
    post.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const post: Post = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return post
    })[0]

    isLoading.value = false
}

onMounted(() => {
    getPost()
})
</script>
