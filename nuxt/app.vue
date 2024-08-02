<template>
  <TheHeader />
  <NuxtPage />
  <TheWhatsAppBtn :data="dataFooter" />
  <TheFooter :data="dataFooter" />
</template>
<script setup lang="ts">
import '~/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import FooterService from '@/services/FooterService'
const footerService = new FooterService(useRuntimeConfig())

const dataFooter = ref({})

const getFooter = async () => {
    const { data }: any = await footerService.getFooter()
    const { attributes } = data[0]
    dataFooter.value = attributes
}

onMounted(() => {
    getFooter()
})
useHead({
  title: 'CasaTudor - Connect with your soul',
  meta: [
    { name: 'description', content: 'Website to read tips and see all products that we have for you that you alwas desire | Relax zone | Learn | Your main alliance' }
  ],
})

</script>