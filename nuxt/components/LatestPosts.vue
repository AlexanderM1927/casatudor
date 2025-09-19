<template>
    <section v-if="!isLoading" class="second-container">
        <h2 class="title">{{ texts.last_posts }}</h2>
        <SliderPosts :posts="posts"></SliderPosts>
        <br>
        <div class="row">
            <Post 
                v-for="(post, index) in posts"
                :key="index"
                :post="post"
                :childClass="`col-md-3 col-xs-12`"
            ></Post>
        </div>
    </section>
</template>
<script setup lang="ts">
import texts from '@/config/texts.json'
import PostService from '@/services/PostService'
import type { IPost } from '~/types/Post'

const appConfig = useRuntimeConfig()
const postService = new PostService(appConfig)
const isLoading: Ref<Boolean> = ref(true)
const posts: Ref<[IPost]|[]> = ref([])

const getPosts = async () => {
    isLoading.value = true
    try {
        const { data }: any = await postService.getHomePosts()
        posts.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
            const post: IPost = {
                ...attributes,
                image: useImageFromStrapi(attributes?.image?.data?.attributes?.url),
                id: id
            }
            return post
        })
    } catch (e) {
        console.log(e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    getPosts()
})

</script>
