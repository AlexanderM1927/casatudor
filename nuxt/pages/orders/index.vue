<template>
    <div class="container custom-container">
        Hello world
    </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>