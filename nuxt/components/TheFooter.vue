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
                    <a :title="url.title" :href="url.url">{{ url.title }}</a>
                </li>
            </ul>
        </div>
        <div class="footer__column">
            <h4 class="text-centered">{{ texts.social_media }}</h4>
            <SocialMediaLinks :data="data" :color="'white'"></SocialMediaLinks>
        </div>
    </div>
</template>
<script setup>
import texts from '@/config/texts.json'
import SocialMediaLinks from './SocialMediaLinks.vue'
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
    background: $primary;
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