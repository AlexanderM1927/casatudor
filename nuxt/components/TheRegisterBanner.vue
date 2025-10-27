<template>
    <div class="register-banner" v-show="!isBannerDismissed">
        <div class="d-flex flex-col">
            <div class="register-banner__content">
                <NuxtImg
                    :alt="appConfig.public.storeName"
                    :title="appConfig.public.storeName"
                    src="/img/logo.webp"
                />
                <div>
                    <b>{{ appConfig.public.storeName }}</b>
                    <p>
                        Registrate y obtén beneficios exclusivos!
                    </p>
                </div>
            </div>
            <div>
                <div>
                    <a href="#" @click="dismissBanner" alt="no" title="No, gracias" class="second-btn">No por ahora</a>
                    <a href="#" @click="goToRegister" alt="register" title="Registrarme" class="btn primary-btn">Registrarme</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
const appConfig = useRuntimeConfig();
const isBannerDismissed: Ref<Boolean> = ref(false)

const goToRegister = (evt: any) => {
    evt.preventDefault()
    navigateTo('register');
    hideBanner();
}

const dismissBanner = (evt: any) => {
    evt.preventDefault()
    hideBanner();
}

const hideBanner = () => {
    isBannerDismissed.value = true;
    localStorage.setItem('registerBannerDismissed', 'true');
}

const isBannerDismissedOnLocalStorage = () => {
    return localStorage.getItem('registerBannerDismissed') === 'true';
}

onMounted(() => {
    isBannerDismissed.value = isBannerDismissedOnLocalStorage();
});

</script>

<style lang="scss" scoped>
.register-banner {
    background: $themeBackgroundCards;
    padding: 1rem;
    border: 1px solid $themeBackgroundCards;
    border-radius: 0.5rem;
    font-size: 0.875rem;
}

.register-banner__content {
    display: flex;
}

.register-banner__content img {
    width: 3rem;
}

.register-banner p
{
    color: black;
    font-size: 0.875rem;
}

.register-banner .primary-btn {
    background: $primary;
}

.register-banner .second-btn {
    text-decoration: none;
    color: black;
    margin-right: 1rem;
}

.register-banner .primary-btn:hover {
    color: $themeBackground;
}
</style>
