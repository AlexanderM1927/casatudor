<template>
    <div :id="`spinner-overlay-${id}`" class="spinner-overlay">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>  
        </div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    id: {
        required: true
    },
    isLoading: {
        required: true
    }
})

onMounted(() => {
    setTimeout(() => {
        if (props.isLoading === true) {
            const overlayItem = document.getElementById("spinner-overlay-" + props.id)
            if (overlayItem) overlayItem.style.display = "flex";
        } else {
            setTimeout(() => {
                const overlayItem = document.getElementById("spinner-overlay-" + props.id)
                if (overlayItem) overlayItem.style.display = "none";
            }, 1000)
        }
    }, 1000)
})

onUpdated(() => {
    setTimeout(() => {
        if (props.isLoading === true) {
            const overlayItem = document.getElementById("spinner-overlay-" + props.id)
            if (overlayItem) overlayItem.style.display = "flex";
        } else {
            setTimeout(() => {
                const overlayItem = document.getElementById("spinner-overlay-" + props.id)
                if (overlayItem) overlayItem.style.display = "none";
            }, 1000)
        }
    }, 1000)
})
</script>

<style>
.spinner-overlay {
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
  justify-content: center;
  align-items: center;
}
</style>