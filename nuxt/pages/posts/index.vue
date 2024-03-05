<template>
    <div v-if="!isLoading" class="container custom-container">
        <h2>Posts</h2>
        <SliderPosts :posts="sliderPosts"></SliderPosts>
        <hr>    
        <div class="row">
            <Post v-for="(post, index) in posts" :key="index" :post="post" :childClass="`col-md-3 col-xs-12`"></Post>
        </div>
        <div class="row">
            <Paginator 
                @getAction="getPosts"
                :data="paginator"
            ></Paginator>
        </div>
    </div>
</template>
<script setup lang="ts">
import PostService from '@/services/PostService';
import { useImageFromStrapi } from '@/composables/useImageFromStrapi'

const postService = new PostService(useRuntimeConfig())
const isLoading: Ref<Boolean> = ref(true);

const posts: Ref<[]> = ref([])
const sliderPosts: Ref<[]> = ref([])

const paginator: Ref<Paginator> = ref({
    currentPage: 1,
    lastPage: 0,
    url: '',
    data: []
})


const getPosts = async (newPage: number = 1) => {
    isLoading.value = true
    const { data, meta }: any = await postService.getPosts(newPage)
    posts.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const post: Post = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return post
    })
    paginator.value = {
        currentPage: newPage,
        lastPage: meta.pagination.pageCount,
        data: posts.value,
        url: ''
    }
    if (posts.value.length >= 4) {
        sliderPosts.value = posts.value.slice(0, 4)
    }

    isLoading.value = false
}

onMounted(() => {
    getPosts()
})
</script>
