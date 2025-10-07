<template>
    <div :class="`post-card card ${childClass}`">
        <NuxtImg
            :title="post.title"
            :src="post.image"
            class="card-img-top post-img" 
            :alt="post.title"
        />
        <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text">{{ post.summary }}</p>
            <NuxtLink
                :to="`/posts/${post.id}`"
                class="anchor"
                :title="texts.read_article"
            >{{ texts.read_article }}</NuxtLink>
        </div>
    </div>
</template>
<script setup lang="ts">
import texts from '@/config/texts.json'
import type { IPost } from '~/types/Post';

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
<style lang="scss" scoped>

.post-card {
    background: $themeBackgroundCards;
    color: $themeColorCards;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.post-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    object-position: center;
    border-radius: 0.375rem 0.375rem 0 0;
}
</style>
