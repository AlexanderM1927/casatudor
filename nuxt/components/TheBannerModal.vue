<template>
    <template v-if="isVisible">
        <div id="overlay-banner" @click="close"></div>
        <div class="banner-modal" role="dialog" aria-modal="true">
            <button class="banner-modal__close" @click="close" aria-label="Cerrar">
                <Icon name="material-symbols:close" />
            </button>
            <a
                :href="data.link"
                target="_blank"
                rel="noopener noreferrer"
                class="banner-modal__link"
            >
                <img
                    :src="imageUrl"
                    alt="Banner"
                    class="banner-modal__image"
                />
            </a>
        </div>
    </template>
</template>

<script setup lang="ts">
import type { IPopupBanner } from '~/types/Banner'

const props = defineProps({
    data: {
        type: Object as () => IPopupBanner,
        default: () => ({})
    }
})

const isVisible = ref(false)

const imageUrl = computed(() => {
    if (props.data?.image) {
        return useImageFromStrapi(props.data.image)
    }
    return ''
})

const close = () => {
    isVisible.value = false
}

watch(() => props.data, (val) => {
    if (val?.active && val?.image) {
        isVisible.value = true
    }
}, { deep: true, immediate: true })
</script>

<style lang="scss" scoped>
#overlay-banner {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  cursor: pointer;
}

.banner-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    max-width: 80vw;
    max-height: 80vh;
    width: auto;
    height: auto;

    &__close {
        position: absolute;
        top: -1rem;
        right: -1rem;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        border: none;
        background: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1001;
        font-size: 1.2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        padding: 0;

        &:hover {
            background: #f0f0f0;
        }
    }

    &__link {
        display: block;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    &__image {
        display: block;
        max-width: 80vw;
        max-height: 80vh;
        width: auto;
        height: auto;
        object-fit: contain;
    }
}

@media only screen and (max-width: $grid-breakpoints-md) {
    .banner-modal {
        max-width: 80vw;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
