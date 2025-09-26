import FooterService from '~/services/FooterService'

export const useFooter = () => {
    const footerData = useState('footer', () => ({}))
    const isLoading = useState('footer.loading', () => false)
    
    const fetchFooter = async () => {
        // If already fetched, return existing data
        if (Object.keys(footerData.value).length > 0) {
            return footerData.value
        }
        
        isLoading.value = true
        try {
            const appConfig = useRuntimeConfig()
            const footerService = new FooterService(appConfig)
            const { data }: any = await footerService.getFooter()
            
            if (data) {
                footerData.value = data.attributes
            }
            return footerData.value
        } catch (error) {
            console.error('Error fetching footer data:', error)
            return {}
        } finally {
            isLoading.value = false
        }
    }
    
    return {
        footerData: readonly(footerData),
        isLoading: readonly(isLoading),
        fetchFooter
    }
}