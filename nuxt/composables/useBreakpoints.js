import { computed, onMounted, onUnmounted, ref } from "vue"

export const useBreakpoints = () => {
    // Check if we're on the client side (browser)
    const isClient = typeof window !== 'undefined'
    
    // Initialize with a default value for SSR, will be updated on client
    let windowWidth = ref(isClient ? window.innerWidth : 1200)

    const onWidthChange = () => {
        if (isClient && window) {
            windowWidth.value = window.innerWidth
        }
    }
    
    onMounted(() => {
        if (isClient && window) {
            // Update the width immediately when mounted on client
            windowWidth.value = window.innerWidth
            window.addEventListener('resize', onWidthChange)
        }
    })
    
    onUnmounted(() => {
        if (isClient && window) {
            window.removeEventListener('resize', onWidthChange)
        }
    })
    
    const type = computed(() => {
        if (windowWidth.value < 550) return 'xs'
        if (windowWidth.value >= 550 && windowWidth.value < 1200) return 'md'
        else return 'lg' // Fires when windowWidth.value >= 1200
    })

    const width = computed(() => windowWidth.value)

    return { width, type }
}