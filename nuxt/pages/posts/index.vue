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
import PostService from '../../services/PostService';

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
    const runtimeConfig = useRuntimeConfig()
    const { data, meta }: any = await PostService.getPosts(runtimeConfig, newPage)
    posts.value = data.map(({ id, attributes }) => {
        const post: Post = {
            ...attributes,
            image: runtimeConfig.public.strapiAssets + '' + attributes.image.data.attributes.url,
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
    sliderPosts.value = posts.value.slice(0, 4)

    isLoading.value = false
}

onMounted(() => {
    getPosts()
})
</script>
