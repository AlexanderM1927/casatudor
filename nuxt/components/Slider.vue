<template>
    <div :id="id" class="carousel carousel-dark slide">
        <div class="carousel-indicators">
            <button 
                v-for="(item, index) in data"
                :key="index"
                type="button"
                :data-bs-target="'#'+id"
                :data-bs-slide-to="index"
                :aria-label="`Slide ${index}`"
                :class="`${index === 0 ? 'active' : ''}`"
            ></button>
        </div>
        <div class="carousel-inner">
            <div 
                v-for="(item, index) in data" 
                :key="index" 
                :class="`carousel-item ${index === 0 ? 'active' : ''}`"
                :data-bs-interval="`${item.id}000`"
            >
                <img :title="item.title" :src="item.image" class="d-block w-100" :alt="item.title">
                <div class="carousel-caption d-md-block">
                    <h5>{{ item.title }}</h5>
                    <p>{{ item.description }}.</p>
                </div>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" :data-bs-target="'#'+id" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" :data-bs-target="'#'+id" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</template>
<script setup>
const props = defineProps({
    data: Array,
    id: String

})
</script>

<style scoped>
.carousel-caption {
    background: white;
}
</style>