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
                <div class="float-btns">
                    <TheRegisterBanner />
                    <TheWhatsAppBtn :data="dataFooter" />
                </div>
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
import PromotionService from '@/services/PromotionService'

const appConfig = useRuntimeConfig()
const { footerData, fetchFooter } = useFooter()
const promotionService = new PromotionService(appConfig)
const dataFooter = footerData
const dataPromotions = ref({})
const isLoading: Ref<Boolean> = ref(true)

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
    await fetchFooter()
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
<style lang="scss" scoped>
.float-btns {
    position: fixed;
    bottom: .5rem;
    display: flex;
    justify-content: space-between;
    z-index: 3;
    width: 100%;
    padding: 0.5rem;
}


@media only screen and (max-width: $grid-breakpoints-md) {
    .float-btns {
        flex-direction: column;
    }
}
</style>