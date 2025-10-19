<template>
    <div class="footer">
        <div class="footer__content">
            <div class="footer__column">
                <div class="company-name" @click="goToHome()">
                    <h4 class="">{{ data.companyName }}</h4>
                    <SocialMediaLinks :data="data" :color="'white'"></SocialMediaLinks>
                </div>
            </div>
            <div class="footer__column">
                <h4>{{ texts.links }}</h4>
                <ul class="footer__links">
                    <li v-for="(url, index) in data.urls" :key="index">
                        <a :title="url.title" :href="url.url">{{ url.title }}</a>
                    </li>
                </ul>
            </div>
            <div class="footer__column">
                <h4 class="">{{ texts.contact }}</h4>
                <p style="white-space: pre-line;">{{ data.contact }}</p>
            </div>
            <div class="footer__column">
                <h4 class="">{{ data.title }}</h4>
                <p style="white-space: pre-line;">{{ data.description }}</p>
            </div>
        </div>
        <hr>
        <div class="footer__gateways">
            <div>
                <b>{{ texts.pay_with }}:</b>
                <NuxtImg
                    :alt="texts.payment_gateways"
                    src="/img/gateways.webp"
                    :title="texts.payment_gateways"
                ></NuxtImg>
            </div>
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

const appConfig = useRuntimeConfig();
</script>

<style lang="scss" scoped>


.footer {
    padding: 5rem;
    color: white;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: $primary;
}

.footer__content {
    display: flex;
    justify-content: center;
    gap: 5rem;
    width: 100%;
}

.footer__gateways {
    display: flex;
    justify-content: center;
}

.company-name img{
    height: 7rem;
    width: auto;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .footer__content {
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

@media only screen and (max-width: $grid-breakpoints-md) {
    .footer {
        text-align: center;
    }
}
</style>
