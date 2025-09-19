<template>
    <section class="promotion" v-if="data && data.isEnabled">
        <div>{{ data.text }}</div>
        <NuxtLink 
            :to="`/promotions/${data.id}`"
            :title="'view'"
        >
            {{ texts.view }}
        </NuxtLink>
    </section>
</template>

<script setup lang="ts">
import texts from '@/config/texts.json'

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
})
</script>
<style lang="scss" scoped>


.promotion {
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    width: 100%;
    background: $primary;
    font-family: system-ui;
    gap: 0.5rem;
}
.promotion a {
    color: $themePromotionButton;
    font-weight: 800;
    text-decoration: none;
}
</style>
