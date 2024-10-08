<template>
    <div v-if="!isLoading" class="first-container">
        <h2 class="title">{{ texts.pages.posts }}</h2>
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
import texts from '@/config/texts.json'
import PostService from '@/services/PostService'
import { useImageFromStrapi } from '@/composables/useImageFromStrapi'

const postService = new PostService(useRuntimeConfig())
const isLoading: Ref<Boolean> = ref(true);

const posts: Ref<[]> = ref([])
const sliderPosts: Ref<[]> = ref([])

const paginator: Ref<IPaginator> = ref({
    currentPage: 1,
    pageCount: 0,
    url: '',
    data: []
})


const getPosts = async (newPage: number = 1) => {
    isLoading.value = true
    const { data, meta }: any = await postService.getPosts(newPage)
    posts.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const post: IPost = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return post
    })
    paginator.value = {
        currentPage: newPage,
        pageCount: meta.pagination.pageCount,
        data: posts.value,
        url: ''
    }
    if (posts.value.length >= 4) {
        const postsToShowOnSlider = posts.value.slice(0, 4)
        for (let i = 0; i < postsToShowOnSlider.length; i++) {
            const element = postsToShowOnSlider[i]
            sliderPosts.value.push(element)
        }
    }

    isLoading.value = false
}

onMounted(() => {
    getPosts()
})
</script>
