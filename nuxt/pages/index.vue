<template>
    <template v-if="!isLoading">
        <section class="container-index">
            <!-- Banner Slider -->
            <div class="banner-slider" v-if="banners && banners.length > 0">
                <div 
                    v-for="(banner, index) in banners" 
                    :key="index"
                    :class="['banner-slide', { 'active': index === currentSlide }]"
                    @click="handleBannerClick(banner.urlForRedirect)"
                >
                    <!-- Desktop Image -->
                    <NuxtImg
                        v-if="type !== 'xs'"
                        :src="useImageFromStrapi(banner.imageForDesktop)"
                        :alt="`Banner ${index + 1}`"
                        class="hero-background"
                        fetchpriority="high"
                        format="webp"
                        quality="90"
                        densities="1x 2x"
                        :preload="index === 0"
                        :loading="index === 0 ? 'eager' : 'lazy'"
                    />
                    <!-- Mobile Image -->
                    <NuxtImg
                        v-else
                        :src="useImageFromStrapi(banner.imageForMobile || banner.imageForDesktop)"
                        :alt="`Banner ${index + 1}`"
                        class="hero-background"
                        fetchpriority="high"
                        format="webp"
                        quality="90"
                        densities="1x 2x"
                        :preload="index === 0"
                        :loading="index === 0 ? 'eager' : 'lazy'"
                    />
                </div>
                
                <!-- Navigation Arrows -->
                <button 
                    v-if="banners.length > 1"
                    class="slider-control slider-control-prev" 
                    @click.stop="prevSlide"
                    :disabled="currentSlide === 0 && !loop"
                >
                    <Icon name="material-symbols:chevron-left" />
                </button>
                
                <button 
                    v-if="banners.length > 1"
                    class="slider-control slider-control-next" 
                    @click.stop="nextSlide"
                    :disabled="currentSlide === banners.length - 1 && !loop"
                >
                    <Icon name="material-symbols:chevron-right" />
                </button>
                
                <!-- Indicators -->
                <div v-if="banners.length > 1" class="slider-indicators">
                    <button
                        v-for="(banner, index) in banners"
                        :key="index"
                        :class="['indicator', { 'active': index === currentSlide }]"
                        @click.stop="goToSlide(index)"
                    ></button>
                </div>
            </div>
        </section>
        <TopCategories></TopCategories>
        <LatestProducts></LatestProducts>
        <LatestPosts></LatestPosts>
    </template>
    <template v-else>
        <LoadingComponent
            :isLoading="isLoading"
            :id="1"
        ></LoadingComponent>
    </template>
</template>
<script setup lang="ts">
import TopCategories from '@/components/TopCategories.vue'
import LatestProducts from '@/components/LatestProducts.vue'
import LatestPosts from '@/components/LatestPosts.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useBreakpoints } from '@/composables/useBreakpoints'
import { useImageFromStrapi } from '@/composables/useImageFromStrapi'
import ContentService from '@/services/ContentService'
import type { IBanner } from '~/types/Banner'

const { type } = useBreakpoints()

const banners: Ref<IBanner[]> = ref([])
const isLoading: Ref<Boolean> = ref(true)
const currentSlide: Ref<number> = ref(0)
const autoplayInterval: Ref<NodeJS.Timeout | null> = ref(null)

const appConfig = useRuntimeConfig()
const contentService = new ContentService(appConfig)

// Slider configuration
const loop = true
const autoplay = true
const interval = 5000

const getContent = async () => {
    isLoading.value = true
    try {
        const { data }: any = await contentService.getContent()
        const { attributes } = data
        
        // Map banner data from the new structure
        if (attributes.banner && attributes.banner.length > 0) {
            banners.value = attributes.banner.map((banner: any) => ({
                imageForDesktop: banner.imageForDesktop.data.attributes.url,
                imageForMobile: banner.imageForMobile?.data?.attributes?.url,
                urlForRedirect: banner.urlForRedirect
            }))
        }
    } catch (e) {
        console.log(e)
    } finally {
        isLoading.value = false
    }
}

// Slider functionality
const nextSlide = () => {
    if (currentSlide.value < banners.value.length - 1) {
        currentSlide.value++
    } else if (loop) {
        currentSlide.value = 0
    }
}

const prevSlide = () => {
    if (currentSlide.value > 0) {
        currentSlide.value--
    } else if (loop) {
        currentSlide.value = banners.value.length - 1
    }
}

const goToSlide = (index: number) => {
    currentSlide.value = index
}

const handleBannerClick = (url?: string) => {
    if (url) {
        // Check if it's an external URL
        if (url.startsWith('http://') || url.startsWith('https://')) {
            window.open(url, '_blank')
        } else {
            // Internal navigation
            navigateTo(url)
        }
    }
}

// Autoplay functionality
const startAutoplay = () => {
    if (autoplay && banners.value.length > 1) {
        autoplayInterval.value = setInterval(() => {
            nextSlide()
        }, interval)
    }
}

const stopAutoplay = () => {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value)
        autoplayInterval.value = null
    }
}

onMounted(() => {
    getContent().then(() => {
        if (banners.value.length > 1) {
            startAutoplay()
        }
    })
})

onUnmounted(() => {
    stopAutoplay()
})
</script>

<style lang="scss" scoped>
.container-index {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.banner-slider {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.banner-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    
    &.active {
        z-index: 2;
        opacity: 1;
    }
}

.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    z-index: -1;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
}

.slider-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 2;
    font-size: 1.5rem;
    
    &:hover {
        background: rgba(0, 0, 0, 0.7);
        transform: translateY(-50%) scale(1.1);
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        
        &:hover {
            transform: translateY(-50%);
        }
    }
}

.slider-control-prev {
    left: 2rem;
}

.slider-control-next {
    right: 2rem;
}

.slider-indicators {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 2;
}

.indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0.7;
    
    &:hover {
        opacity: 1;
        transform: scale(1.2);
    }
    
    &.active {
        background: white;
        opacity: 1;
    }
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .container-index {
        /* Fix for iOS Safari viewport */
        min-height: 100vh;
        min-height: -webkit-fill-available;
        /* Ensure full width on mobile */
        width: 100vw;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
    }
    
    .slider-control {
        width: 2.5rem;
        height: 2.5rem;
        font-size: 1.2rem;
    }
    
    .slider-control-prev {
        left: 1rem;
    }
    
    .slider-control-next {
        right: 1rem;
    }
    
    .slider-indicators {
        bottom: 1rem;
    }
    
    .indicator {
        width: 10px;
        height: 10px;
    }
    
    .hero-background {
        /* Ensure full coverage on mobile - iOS Safari fix */
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        height: -webkit-fill-available;
        object-fit: cover;
        object-position: center center;
        z-index: -1;
        /* Force hardware acceleration for better performance */
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
    }
}

// Touch/mouse events for pausing autoplay
.banner-slider {
    &:hover {
        .slider-control {
            opacity: 1;
        }
    }
}
</style>
