<template>
    <div class="container custom-container">
        <h2>Posts</h2>
        <SliderPosts :posts="posts"></SliderPosts>
        <hr>    
        <div class="row">
            <Post v-for="(post, index) in posts" :key="index" :post="post" :childClass="`col-md-3 col-xs-12`"></Post>
        </div>
        <div class="row">
            <Paginator 
                @getAction="getPosts()"
                :data="paginator"
            ></Paginator>
        </div>
    </div>
</template>
<script setup lang="ts">

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

const paginator: Paginator = {
    data: posts,
    currentPage: 1,
    lastPage: 20,
    url: ''
}

const getPosts = (newPage: number) => {
    paginator.currentPage = newPage
}
</script>
