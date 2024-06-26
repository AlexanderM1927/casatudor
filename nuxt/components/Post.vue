<template>
    <div :class="`card ${childClass}`">
        <img :title="post.title" :src="post.image" class="card-img-top post-img" alt="...">
        <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text">{{ post.summary }}</p>
            <NuxtLink
                :to="`/posts/${post.id}`"
                class="anchor"
                title="Leer artículo"
            >Leer artículo</NuxtLink>
        </div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps(
    {
        childClass: String,
        post: {
            type: Object as PropType<IPost>,
            required: true
        }
    }
)
</script>
<style scoped>
.post-img {
    width: 100%;
    height: 10rem;
}
</style>