<template>
    <div :id="id" class="custom-carousel">

        <!-- Carousel Inner -->
        <div class="carousel-inner" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
            <div 
                v-for="(item, index) in data" 
                :key="index" 
                :class="['carousel-item', { active: index === currentSlide }]"
                :style="{ transform: `translateX(${(index - currentSlide) * 100}%)` }"
            >
                <NuxtImg 
                    :title="item.title" 
                    :src="item.image" 
                    class="carousel-image" 
                    :alt="item.title"
                />
                <div class="carousel-caption">
                    <h5>{{ item.title }}</h5>
                    <p>{{ item.description }}</p>
                </div>
            </div>
        </div>

        <!-- Navigation Buttons -->
        <button 
            class="carousel-control carousel-control-prev" 
            type="button" 
            @click="prevSlide"
            :disabled="currentSlide === 0 && !loop"
        >
            <Icon name="material-symbols:chevron-left" />
            <span class="visually-hidden">Previous</span>
        </button>
        
        <button 
            class="carousel-control carousel-control-next" 
            type="button" 
            @click="nextSlide"
            :disabled="currentSlide === data.length - 1 && !loop"
        >
            <Icon name="material-symbols:chevron-right" />
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Array,
        required: true,
        default: () => []
    },
    id: {
        type: String,
        required: true
    },
    autoplay: {
        type: Boolean,
        default: true
    },
    interval: {
        type: Number,
        default: 5000
    },
    loop: {
        type: Boolean,
        default: true
    }
})

const currentSlide = ref(0)
let autoplayInterval = null
let touchStartX = 0
let touchEndX = 0

const goToSlide = (index) => {
    currentSlide.value = index
    resetAutoplay()
}

const nextSlide = () => {
    if (currentSlide.value < props.data.length - 1) {
        currentSlide.value++
    } else if (props.loop) {
        currentSlide.value = 0
    }
    resetAutoplay()
}

const prevSlide = () => {
    if (currentSlide.value > 0) {
        currentSlide.value--
    } else if (props.loop) {
        currentSlide.value = props.data.length - 1
    }
    resetAutoplay()
}

const startAutoplay = () => {
    if (props.autoplay && props.data.length > 1) {
        autoplayInterval = setInterval(() => {
            nextSlide()
        }, props.interval)
    }
}

const stopAutoplay = () => {
    if (autoplayInterval) {
        clearInterval(autoplayInterval)
        autoplayInterval = null
    }
}

const resetAutoplay = () => {
    stopAutoplay()
    startAutoplay()
}

// Touch support for mobile
const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
}

const handleSwipe = () => {
    const swipeThreshold = 50
    const diff = touchStartX - touchEndX

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide()
        } else {
            prevSlide()
        }
    }
}

// Keyboard navigation
const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide()
    } else if (e.key === 'ArrowRight') {
        nextSlide()
    }
}

onMounted(() => {
    startAutoplay()
    document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    stopAutoplay()
    document.removeEventListener('keydown', handleKeyDown)
})

// Pause autoplay on hover
const pauseOnHover = () => {
    stopAutoplay()
}

const resumeOnLeave = () => {
    startAutoplay()
}
</script>

<style scoped>
.custom-carousel {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.custom-carousel:hover .carousel-control {
    opacity: 1;
}

.carousel-inner {
    position: relative;
    width: 100%;
    height: 400px; /* Adjust as needed */
    overflow: hidden;
}

.carousel-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease-in-out;
    opacity: 0;
}

.carousel-item.active {
    opacity: 1;
}

.carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.carousel-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    color: white;
    padding: 2rem 1rem 1rem;
    text-align: center;
}

.carousel-caption h5 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
}

.carousel-caption p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
}

.carousel-indicators {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 10;
}

.carousel-indicators button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0.7;
}

.carousel-indicators button.active,
.carousel-indicators button:hover {
    background: white;
    opacity: 1;
}

.carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.carousel-control:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-50%) scale(1.1);
}

.carousel-control:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.carousel-control:disabled:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: translateY(-50%);
}

.carousel-control-prev {
    left: 1rem;
}

.carousel-control-next {
    right: 1rem;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .carousel-inner {
        height: 250px;
    }
    
    .carousel-caption {
        padding: 1rem 0.5rem 0.5rem;
    }
    
    .carousel-caption h5 {
        font-size: 1.2rem;
    }
    
    .carousel-caption p {
        font-size: 0.9rem;
    }
    
    .carousel-control {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
    }
    
    .carousel-control-prev {
        left: 0.5rem;
    }
    
    .carousel-control-next {
        right: 0.5rem;
    }
}

/* Animation for smooth transitions */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.carousel-item.active {
    animation: fadeIn 0.5s ease-in-out;
}
</style>