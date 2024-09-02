<template>
    <div v-if="data.currentPage < data.pageCount" class="paginator-see-more" @click="next()">
        Ver más
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['getAction'])
const props = defineProps(
    {
        data: {
            type: Object,
            required: true
        }
    }
)
const currentPage: Ref<number> = ref(1)
    
const next = () => {
    currentPage.value = currentPage.value + 1
    emit('getAction', currentPage.value)
}
</script>
<style>
.paginator-see-more {
    cursor: pointer;
    text-decoration: underline;
}
</style>