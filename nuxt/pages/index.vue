<template>
    <div v-if="!isLoading">
        <div class="container-index"  :style="`background: url(
                ${
                    useImageFromStrapi(image)
                }
            ); background-size: cover;`">
            <div :class="`hero-text ${type === 'xs' ? 'hero-text-center' : ''}`">
                <h2>
                    {{ title }}
                </h2>
                <p style="white-space: pre-line;">{{ description }}</p>
            </div>
        </div>
        <div class="container">
            <h2>Latest posts</h2>
            <hr />
            <SliderPosts :posts="posts"></SliderPosts>
            <br>
            <div class="row">
                <Post v-for="(post, index) in posts" :key="index" :post="post" :childClass="`col-md-3 col-xs-12`"></Post>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import PostService from '../services/PostService';
import { useBreakpoints } from '../composables/useBreakpoints'
import { useImageFromStrapi } from '../composables/useImageFromStrapi'
import ContentService from '../services/ContentService'

const { type } = useBreakpoints()

const title: Ref<any> = ref(null)
const description: Ref<any> = ref(null)
const image: Ref<any> = ref(null)
const posts: Ref<[]> = ref([])
const isLoading = ref(true)

const getContent = async () => {
    const { data }: any = await ContentService.getContent()
    const { attributes } = data[0]
    title.value = attributes.titleHomePage
    description.value = attributes.descriptionHomePage
    image.value = attributes.imageHomePage.data.attributes.url
}

const getPosts = async () => {
    isLoading.value = true
    const { data }: any = await PostService.getHomePosts()
    posts.value = data.map(({ id, attributes }) => {
        const post: Post = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return post
    })
    isLoading.value = false
}

onMounted(() => {
    getContent()
    getPosts()
})

</script>

<style lang="scss" scoped>
@import "../styles/_breakpoints.scss";
.container-index {
    background: url('img/bgjpg.jpg');
    background-size: cover;
    width: 100%;
    min-height: 100vh;
    z-index: 1;
    padding-top: 5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    color: white;
}

.hero-text {
    padding: 2rem;
    border-radius: 1rem;
    width: 20rem;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .hero-text {
        padding: 1rem;
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