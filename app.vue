<template>
  <TheHeader />
  <NuxtPage />
</template>
<script setup lang="ts">
import '~/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
useHead({
  title: 'CasaTudor',
  meta: [
    { name: 'description', content: 'Relax space.' }
  ],
})
</script>