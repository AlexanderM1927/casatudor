<template>
    <div class="btn-whatsapp">
        <a
            :href="`https://wa.me/${data.whatsappPhone}`"
            target="_blank"
            title="WhatsApp"
        >
            <Icon name="logos:whatsapp-icon" />
        </a>
    </div>
</template>
<script setup>
const props = defineProps({
    data: {
        required: true
    }
})
</script>

<style>
.btn-whatsapp {
    position: fixed;
    right: .5rem;
    bottom: .5rem;
}

.btn-whatsapp {
    font-size: 3rem;
    cursor: pointer;
    text-decoration: none;
}
</style>
