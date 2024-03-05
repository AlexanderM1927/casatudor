<template>
    <div class="footer">
        <div class="footer__column">
            <h4 class="text-centered">{{ data.title }}</h4>
            <p style="white-space: pre-line;">{{ data.description }}</p>
        </div>
        <div class="footer__column text-centered">
            <h4>Links</h4>
            <ul class="footer__links">
                <li v-for="(url, index) in data.urls" :key="index">
                    <a :href="url.url">{{ url.title }}</a>
                </li>
            </ul>
        </div>
        <div class="footer__column">
            <h4 class="text-centered">Redes sociales</h4>
            <div class="footer__social-media">
                <a :href="`https://wa.me/${data.whatsappPhone}`" target="_blank">
                    <Icon name="mdi:whatsapp" />
                </a>
                <a :href="data.facebookUrl" target="_blank">
                    <Icon name="mdi:facebook" />
                </a>
                <a :href="data.instagramUrl" target="_blank">
                    <Icon name="mdi:instagram" />
                </a>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    data: {
        type: Object
    }
})
</script>

<style lang="scss" scoped>
@import "@/styles/_colors.scss";
@import "@/styles/_breakpoints.scss";
.footer {
    padding: 5rem;
    padding-top: 7rem;
    padding-bottom: 7rem;
    color: white;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    background: $darkBlue;
}

.footer__column {
    flex: 1 1 0;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .footer {
        flex-direction: column;
    }
}

.footer__social-media {
    font-size: 2rem;
    display: flex;
    justify-content: center;
}

.footer__social-media a {
    color: white;
    text-decoration: none;
}

.footer__links {
    list-style: none;
    padding-left: 0;
}

.footer__links li a {
    color: white;
    opacity: 0.5;
}

.footer__links li a:hover {
    opacity: 1;
}
</style>