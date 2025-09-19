<template>
    <div class="social-media">
        <a :style="`color: ${color}`" title="Whatsapp" :href="`https://wa.me/${data.whatsappPhone}`" target="_blank">
            <Icon name="mdi:whatsapp" />
        </a>
        <a :style="`color: ${color}`" title="Facebook" :href="data.facebookUrl" target="_blank">
            <Icon name="mdi:facebook" />
        </a>
        <a :style="`color: ${color}`" title="Instagram" :href="data.instagramUrl" target="_blank">
            <Icon name="mdi:instagram" />
        </a>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object
    },
    color: {
        type: String
    }
})
</script>
<style>
.social-media {
    font-size: 2rem;
    display: flex;
    justify-content: center;
}

.social-media a {
    color: white;
    text-decoration: none;
}
</style>
