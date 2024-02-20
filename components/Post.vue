<template>
    <div :class="`card ${childClass}`">
        <img :src="post.image" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text">{{ post.summary }}</p>
            <NuxtLink :to="`/posts/${post.id}`" class="anchor">Read article</NuxtLink>
        </div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps(
    {
        childClass: String,
        post: {
            type: Object,
            required: true
        }
    }
)
</script>