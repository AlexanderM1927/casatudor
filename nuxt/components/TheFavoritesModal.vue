<template>
    <div class="favorites-content" ref="favoritesContent">
        <div class="favorites-content-header">
            <h2>Favorites</h2>
            <div class="close-btn">
                <Icon name="material-symbols:close" @click="closeFavoritesModal()" color="black" />
            </div>
        </div>
        <div class="favorites-content-items">
            <div class="row">
                <Product
                    v-for="(product, index) in favoritesProducts"
                    :key="index"
                    :product="product"
                    :childClass="`col-12`"
                ></Product>
            </div>
        </div>
    </div>
    <div id="overlay-favorites" @click="closeFavoritesModal()"></div>
</template>
<script setup lang="ts">
const favoritesStore = useFavoritesStore()
const favoritesStoreComputed = storeToRefs(favoritesStore)
const favoritesProducts = favoritesStoreComputed.getProducts



const emit = defineEmits(['closeFavoritesModal'])
const props = defineProps(['isFavoritesModalOpen'])
const favoritesContent: Ref<HTMLDivElement | undefined> = ref()

watch(() => props.isFavoritesModalOpen, (val) => {
    if (val === true) {
        openCartHTML()
    } else {
        closeFavoritesModalHTML()
    }
})

const closeFavoritesModalHTML = (() => {
    const overlayItem = document.getElementById("overlay")
    if (overlayItem) overlayItem.style.display = "none";
    if (favoritesContent.value) {
        favoritesContent.value.style.opacity = '0'
        favoritesContent.value.style.visibility = 'hidden'
    }
})

const openCartHTML = (() => {
    const overlayItem = document.getElementById("overlay")
    if (overlayItem) overlayItem.style.display = "block";
    if (favoritesContent.value) {
        favoritesContent.value.style.opacity = '1'
        favoritesContent.value.style.visibility = 'visible'
    }
})

const closeFavoritesModal = (() => {
    emit('closeFavoritesModal')
})

onMounted(() => {
    const favoritesLS = localStorage.getItem('favorites')
    const favorites = favoritesLS ? JSON.parse(favoritesLS) : []
    favoritesStore.set(favorites)
})
</script>

<style lang="scss" scoped>
@import "@/styles/_breakpoints.scss";
#overlay-favorites {
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 4; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}

.favorites-content {
    position: fixed;
    width: 30%;
    right: 0;
    height: 100vh;
    background: white;
    visibility: hidden;
    opacity: 0;
    padding: 1rem;
    z-index: 5;
    transition: visibility 0s, opacity 0.5s linear;
    overflow-y: auto;
}

.favorites-content h2 {
    margin-bottom: 0;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .favorites-content {
        width: 100%;
    }
}
.favorites-content-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #000;
}

.favorites-content h1 {
    font-family: 'contra-slab-bold';
    font-size: 3rem;
}

.favorites-content-items {
    overflow-y: auto;
    overflow-x: hidden;
}
</style>