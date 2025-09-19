<template>
    <div class="first-container">
        Hello world
    </div>
</template>
<script setup lang="ts">
definePageMeta({ middleware: 'auth',requiresAuth: true })
</script>
