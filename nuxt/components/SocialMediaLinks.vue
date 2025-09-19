<template>
    <div class="social-media" v-if="hasAnyData">
        <a 
            v-if="data.whatsappPhone" 
            :style="`color: ${color}`" 
            title="Whatsapp" 
            :href="`https://wa.me/${data.whatsappPhone}`" 
            target="_blank"
        >
            <Icon name="mdi:whatsapp" />
        </a>
        <a 
            v-if="data.facebookUrl" 
            :style="`color: ${color}`" 
            title="Facebook" 
            :href="data.facebookUrl" 
            target="_blank"
        >
            <Icon name="mdi:facebook" />
        </a>
        <a 
            v-if="data.instagramUrl" 
            :style="`color: ${color}`" 
            title="Instagram" 
            :href="data.instagramUrl" 
            target="_blank"
        >
            <Icon name="mdi:instagram" />
        </a>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    color: {
        type: String,
        default: 'white'
    }
})

// Computed property to check if we have any social media data
const hasAnyData = computed(() => {
    return !!(props.data.whatsappPhone || props.data.facebookUrl || props.data.instagramUrl)
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
