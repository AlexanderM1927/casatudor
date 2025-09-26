<template>
    <div>
        <div id="toast-container">
            <!-- Toast notifications will appear here -->
        </div>
        
        <template v-if="!isLoading">
            <ThePromotion :data="dataPromotions"></ThePromotion>
            <div class="main-page">
                <TheHeader :data="dataFooter" />
                <!-- Page content goes here -->
                <NuxtPage />
                <TheWhatsAppBtn :data="dataFooter" />
                <TheFooter :data="dataFooter" />
            </div>
        </template>
        
        <template v-else>
            <LoadingComponent
                :isLoading="isLoading"
                :id="1"
            ></LoadingComponent>
        </template>
    </div>
</template>
<script setup lang="ts">
import ThePromotion from '@/components/ThePromotion.vue'
import FooterService from '@/services/FooterService'
import PromotionService from '@/services/PromotionService'

const appConfig = useRuntimeConfig()
const footerService = new FooterService(appConfig)
const promotionService = new PromotionService(appConfig)
const dataFooter = ref({})
const dataPromotions = ref({})
const isLoading: Ref<Boolean> = ref(true)

const getFooter = async () => {
    try {
        const { data }: any = await footerService.getFooter()
        if (data) {
            const { attributes } = data
            dataFooter.value = attributes
        }
    } catch (error) {
        console.error('Error fetching footer data:', error)
    }
}

const getPromotions = async () => {
    try {
        const { data }: any = await promotionService.getPromotions()
        if (data && data[0]) {
            const { attributes } = data[0]
            dataPromotions.value = {
                ...attributes,
                id: data[0].id
            }
        }
    } catch (error) {
        console.error('Error fetching promotions data:', error)
    }
}

onMounted(async () => {
    await getFooter()
    await getPromotions()
    isLoading.value = false
})
useHead({
    title: `${appConfig.public.header}`,
    meta: [
        { name: 'description', content: appConfig.public.description }
    ],
})

</script>
