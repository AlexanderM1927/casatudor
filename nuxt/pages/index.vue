<template>
    <div>
        <div class="container-index">
            <div :class="`hero-text ${type === 'xs' ? 'hero-text-center' : ''}`">
                <h2>
                    {{ title }}
                </h2>
                <p>{{ description }}</p>
            </div>
        </div>
        <div class="container">
            <h2>Latest posts</h2>
            <hr />
            <SliderPosts :posts="posts"></SliderPosts>
            <div class="row">
                <Post v-for="(post, index) in posts" :key="index" :post="post" :childClass="`col-md-3 col-xs-12`"></Post>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useBreakpoints } from '../composables/getBreakpoints'
import ContentService from '../services/ContentService'

const title: Ref<any> = ref(null)
const description: Ref<any> = ref(null)

const getContent = async () => {
    const runtimeConfig = useRuntimeConfig()
    const { data }: any = await ContentService.getContent(runtimeConfig)
    console.log('data', data)
    title.value = data[0]?.attributes.title_home_page
    description.value = data[0]?.attributes.description_home_page
}

onMounted(() => {
    getContent()
})

const { type } = useBreakpoints()
const posts: Post[] = [
    {
        id: 1,
        title: 'Card title1',
        summary: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        image: 'img/bgjpg.jpg'
    },
    {
        id: 2,
        title: 'Card title2',
        summary: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        image: 'img/bgjpg.jpg'
    },
    {
        id: 3,
        title: 'Card title3',
        summary: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        image: 'img/bgjpg.jpg'
    },
    {
        id: 4,
        title: 'Card title4',
        summary: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        image: 'img/bgjpg.jpg'
    }
]
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