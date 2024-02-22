<template>
    <div class="container custom-container">
        <h2>{{ post.title }}</h2>
        <b style="white-space: pre-line;">{{ post.summary }}</b>
        <hr>
        <p style="white-space: pre-line;">{{ post.fullText }}</p>
        <img :src="post.image" class="d-block w-100" alt="{{ post.tile }}">
    </div>
</template>
<script setup lang="ts">
import PostService from '../../services/PostService';

const route = useRoute()

const isLoading: Ref<Boolean> = ref(true);

const post: Ref<Post> = ref({
    id: 1,
    title: '',
    summary: '',
    image: ''
})


const getPost = async (newPage: number = 1) => {
    isLoading.value = true
    const runtimeConfig = useRuntimeConfig()
    const { data }: any = await PostService.getSinglePost(runtimeConfig, route.params.id)
    post.value = data.map(({ id, attributes }) => {
        const post: Post = {
            ...attributes,
            image: runtimeConfig.public.strapiAssets + '' + attributes.image.data.attributes.url,
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
