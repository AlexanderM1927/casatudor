export const usePageWithSubnav = () => {
  const route = useRoute()
  
  // Computed property to check if current page has subnav
  const hasSubnav = computed(() => {
    // Check if we're on a main page that would show subnav
    const isMainPageWithSub = route.path.includes('/pages/')
    // Check if we're on a subpage that would show subnav
    const isSubPage = route.path.includes('/subpages/')
    
    return isMainPageWithSub || isSubPage
  })
  
  // CSS class for containers
  const containerClass = computed(() => {
    return hasSubnav.value ? 'first-container first-container-with-subnav' : 'first-container'
  })
  
  return {
    hasSubnav: readonly(hasSubnav),
    containerClass: readonly(containerClass)
  }
}