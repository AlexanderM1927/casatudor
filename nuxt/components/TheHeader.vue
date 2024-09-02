<template>
    <div v-if="!isLoading">
        <template v-if="type === 'xs'">
            <div 
                id="header-mobile" 
                :class="`header-mobile ${route.name === 'index' ? 'header-transparent' : 'header-secondary'}`"
            >
                <div id="burger-menu-btn" class="burger-menu-btn">
                    <Icon name="iconamoon:menu-burger-horizontal-fill" @click="openBurger" />
                </div>
                <div class="company-name" @click="goToHome()">{{ appConfig.public.storeName }}</div>
                <div class="menu-icon">
                    <Icon name="material-symbols:garden-cart-outline" @click="openCart" />
                    <Icon name="material-symbols:favorite" @click="openFavoritesModal" />
                </div>
            </div>
        </template>
        <template v-else>
            <div id="header" :class="`header ${route.name === 'index' ? 'header-transparent' : 'header-secondary'}`">
                <div class="company-name" @click="goToHome()">{{ appConfig.public.storeName }}</div>
                <ul class="menu-items">
                    <li>
                        <NuxtLink
                            :title="texts.pages.index" 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                            to="/"
                        >{{ texts.pages.index }}</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink 
                            :title="texts.pages.posts"
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                            to="/posts"
                        >{{ texts.pages.posts }}</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink 
                            :title="texts.pages.store" 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                            to="/items"
                        >{{ texts.pages.store }}</NuxtLink>
                    </li>
                    <li class="subnav" v-for="(page, index) in pages" :key="index">
                        <NuxtLink 
                            :title="page.urlTitle" 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                            :to="`/pages/${page.urlId}`"
                        >{{ page.urlTitle }}</NuxtLink>
                        <div 
                            :class="`subnav-content ${route.name === 'index' ? 'ct-bg-transparent' : 'ct-bg-secondary'}`" 
                            v-if="page.subpages.data && page.subpages.data.length > 0"
                        >
                            <NuxtLink 
                                v-for="(subpage, index) in page.subpages.data"
                                class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                                :to="`/subpages/${subpage.urlId}`"
                                :title="subpage.urlTitle" 
                            >
                                {{ subpage.urlTitle }}
                            </NuxtLink>
                        </div>
                    </li>
                    <li
                        v-if="!user.logged"
                    >
                        <NuxtLink
                            :title="texts.pages.login" 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                            to="/login"
                        >{{ texts.pages.login }}</NuxtLink>
                    </li>
                    <li
                        v-if="user.logged"
                    >
                        <NuxtLink
                            title="Mis Pedidos" 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                            to="/orders"
                        >Mis Pedidos</NuxtLink>
                    </li>
                    <li
                        v-if="user.logged"
                    >
                        <a
                            title="Logout"
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                            @click="logout"
                            href="#"
                        >Logout</a>
                    </li>
                    <li>
                        <div class="menu-icon">
                            <Icon name="material-symbols:garden-cart-outline" @click="openCart" />
                            <Icon name="material-symbols:favorite" @click="openFavoritesModal" />
                        </div>
                    </li>
                </ul>
            </div>
        </template>
        <div class="burger-menu" id="burger-menu" ref="burgerMenu">
            <div class="burger-menu-header">
                <h1 class="subtitle">{{ appConfig.public.storeName }}</h1>
                <div class="close-btn">
                    <Icon name="material-symbols:close" @click="closeBurger()" />
                </div>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">
                    <Icon name="material-symbols:search" color="black" />
                </span>
                <input
                    type="text"
                    class="form-control"
                    :placeholder="texts.filter.searcher_placeholder"
                    v-model="productNameSearch"
                    @keyup.enter="searchItem"
                >
            </div>
            <ul class="items">
                <li><NuxtLink :title="texts.pages.index" class="anchor anchor-third" to="/">{{ texts.pages.index }}</NuxtLink></li>
                <li><NuxtLink :title="texts.pages.posts" class="anchor anchor-third" to="/posts">{{ texts.pages.posts }}</NuxtLink></li>
                <li><NuxtLink :title="texts.pages.store" class="anchor anchor-third" to="/items">{{ texts.pages.store }}</NuxtLink></li>
                <li v-for="(page, index) in pages" :key="index">
                    <NuxtLink
                        class="anchor anchor-third" 
                        :to="`/pages/${page.urlId}`"
                        :title="page.urlTitle"
                    >
                        {{ page.urlTitle }}
                    </NuxtLink>
                    <ul v-if="page.subpages">
                        <li
                            v-for="(subpage, index) in page.subpages.data"
                        >
                            <NuxtLink 
                                class="anchor anchor-third" 
                                :to="`/subpages/${subpage.urlId}`"
                                :title="subpage.urlTitle" 
                            >
                                {{ subpage.urlTitle }}
                            </NuxtLink>
                        </li>
                    </ul>
                </li>
                <li
                    v-if="!user.logged"
                >
                    <NuxtLink 
                        class="anchor anchor-third" 
                        to="/login"
                        :title="texts.pages.login"
                    >{{ texts.pages.login }}</NuxtLink>
                </li>
                <li
                    v-if="user.logged"
                >
                    <NuxtLink 
                        class="anchor anchor-third" 
                        to="/orders"
                        title="Mis Pedidos"
                    >Mis Pedidos</NuxtLink>
                </li>
                <li
                    v-if="user.logged"
                >
                    <a 
                        title="Logout" 
                        class="anchor anchor-third" 
                        @click="logout" 
                        href="#"
                    >Logout</a>
                </li>
            </ul>
            <SocialMediaLinks :data="data" :color="'black'"></SocialMediaLinks>
        </div>
        <TheCart :data="data" :isCartOpen="isCartOpen" @closeCart="closeCart()"></TheCart>
        <TheFavoritesModal :isFavoritesModalOpen="isFavoritesModalOpen" @closeFavoritesModal="closeFavoritesModal()"></TheFavoritesModal>
    </div>
</template>

<script setup lang="ts">
import PageService from '@/services/PageService';
import { useBreakpoints } from '@/composables/useBreakpoints'
import SocialMediaLinks from './SocialMediaLinks.vue';
import texts from '@/config/texts.json'
defineProps({
    data: {
        type: Object
    }
})
const route = useRoute()

const { type } = useBreakpoints()
const userState = useUserStore()
const appConfig = useRuntimeConfig()

const userStore = storeToRefs(userState)
const user = userStore.getUser

const burgerMenu: Ref<HTMLDivElement | undefined> = ref()
const isCartOpen: Ref<Boolean> = ref(false)
const isFavoritesModalOpen: Ref<Boolean> = ref(false)
const pages: Ref<[IPage]> = ref([{
    id: 0,
    urlId: '',
    urlTitle: '',
    title: '',
    content: '',
    subpages: {}
}])
const isLoading: Ref<Boolean> = ref(false)
const productNameSearch: Ref<String> = ref('')


const searchItem = (() => {
    navigateTo('/items?q=' + productNameSearch.value)
})

const pageService = new PageService(appConfig)

const getPages = async () => {
    isLoading.value = true
    const { data }: any = await pageService.getPages()
    pages.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const page: IPage = {
            ...attributes,
            id: id,
        }
        if (attributes.subpages && attributes.subpages.data.length > 0) {
            page.subpages.data = attributes.subpages.data.map(({ id, attributes }: { id: number, attributes: any }) => {
                return {
                    ...attributes,
                    id: id
                }
            })
        }
        return page
    })
    isLoading.value = false
}

watch(() => route.name, () => {
    handleScroll()
    closeBurger()
})

const goToHome = (() => {
    navigateTo('/')
})

const logout = (() => {
    userState.removeUser()
    localStorage.removeItem('userData')
    localStorage.removeItem('jwt')
})

const openCart = (() => {
    isCartOpen.value = true
})

const closeCart = (() => {
    isCartOpen.value = false
})

const openFavoritesModal = (() => {
    isFavoritesModalOpen.value = true
})

const closeFavoritesModal = (() => {
    isFavoritesModalOpen.value = false
})

const closeBurger = (() => {
    if (burgerMenu.value) {
        burgerMenu.value.style.opacity = '0'
        burgerMenu.value.style.left = '-70%'
    }
})

const openBurger = (() => {
    if (burgerMenu.value) {
        burgerMenu.value.style.opacity = '1'
        burgerMenu.value.style.left = '0px'
    }
})

const setMenuItemsColor = ((color: String) => {
    const menuItems = document.getElementsByClassName('menu-items-anchor')
    const elemntsModalWithBgWhite = document.getElementsByClassName('subnav-content')
    for (let i = 0; i < menuItems.length; i++) {
        if (color === 'secondary') {
            menuItems[i].classList.replace('anchor-secondary', 'anchor-primary') 
        } else {
            menuItems[i].classList.replace('anchor-primary', 'anchor-secondary') 
        }
    }
    for (let i = 0; i < elemntsModalWithBgWhite.length; i++) {
        if (color === 'secondary') {
            elemntsModalWithBgWhite[i]?.classList.replace('ct-bg-transparent', 'ct-bg-secondary')
        } else {
            elemntsModalWithBgWhite[i]?.classList.replace('ct-bg-secondary', 'ct-bg-transparent')
        }
    } 
})

const burgerMenuBtn = document.getElementById('burger-menu-btn')
const setPositionsFixed = (() => {
    const headerHTML = document.getElementById('header')
    const headerMobileHTML = document.getElementById('header-mobile')
    const burgerMenuHTML = document.getElementById('burger-menu')
    if (headerHTML) {
        headerHTML.style.position = 'fixed'
    }
    if (headerMobileHTML) {
        headerMobileHTML.style.position = 'fixed'
    }
    if (burgerMenuHTML) {
        burgerMenuHTML.style.position = 'fixed'
    }
})
const setPositionsAbsolute = (() => {
    const headerHTML = document.getElementById('header')
    const headerMobileHTML = document.getElementById('header-mobile')
    const burgerMenuHTML = document.getElementById('burger-menu')
    if (headerHTML) {
        headerHTML.style.position = 'absolute'
    }
    if (headerMobileHTML) {
        headerMobileHTML.style.position = 'absolute'
    }
    if (burgerMenuHTML) {
        burgerMenuHTML.style.position = 'absolute'
    }
})
const changeHeaderPerWhite = (() => {
    const headerHTML = document.getElementById('header')
    const headerMobileHTML = document.getElementById('header-mobile')
    if (burgerMenuBtn) burgerMenuBtn.style.color = 'black'
    headerHTML?.classList.replace('header-transparent', 'header-secondary')
    headerMobileHTML?.classList.replace('header-transparent', 'header-secondary')
    setMenuItemsColor('secondary')
})
const changeHeaderPerDefault = (() => {
    const headerHTML = document.getElementById('header')
    const headerMobileHTML = document.getElementById('header-mobile')
    if (burgerMenuBtn) burgerMenuBtn.style.color = 'white'
    headerHTML?.classList.replace('header-secondary', 'header-transparent')
    headerMobileHTML?.classList.replace('header-secondary', 'header-transparent')
    setMenuItemsColor('primary')
})

const handleScroll = (() => {
    const bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (bodyScrollTop > 70) {
        changeHeaderPerWhite()
        setPositionsFixed()
    } else {
        if (route.name === 'index') {
            changeHeaderPerDefault()
            setPositionsAbsolute()
        } else {
            changeHeaderPerWhite()
            setPositionsAbsolute()
        }
    }
})

const checkLogin = (() => {
    if (!user.value.logged) {
        if (localStorage.getItem('userData')) {
            userState.setUser(JSON.parse(localStorage.getItem('userData') || '{}'))
        }
    }
})

onMounted(() => {
    checkLogin()
    getPages()
    setTimeout(() => {
        handleScroll()
        window.addEventListener('scroll', () => {
            handleScroll()
        })
    }, 200)
})

onUnmounted(() => {
    window.removeEventListener('scroll', () => {
        handleScroll()
    })
})
</script>

<style lang="scss" scoped>
@import "@/styles/_colors.scss";

.header-secondary, .ct-bg-secondary {
    background: $primary;
    border-bottom: 1px solid rgba(60, 60, 60, .12);
    color: white;
}

.header-transparent, .ct-bg-transparent {
    background: transparent;
    color: white;
}

.header-mobile {
    display: flex;
    position: absolute;
    top: 0px;
    z-index: 3;
    font-size: 1.5rem;
    padding: 1rem;
    vertical-align: middle;
    width: 100%;
    place-items: center;
    justify-content: space-between;
    font-family: 'contra-slab-bold';
}

.header-mobile .burger-menu-btn {
    display: flex;
    align-items: center;
}

.header {
    position: absolute;
    display: flex;
    font-size: 1.5rem;
    padding: 1rem;
    width: 100%;
    justify-content: space-between;
    z-index: 3;
    top: 0px;
}

.company-name {
    cursor: pointer;
    font-family: 'contra-slab-bold';
}

.header .menu-items {
    font-family: 'contra-slab';
    display: flex;
    gap: 1rem;
    list-style: none;
    font-size: 1rem;
    margin-bottom: 0;
    align-items: center;
}

.anchor {
    text-decoration: none;
}

.anchor-opacity {
    opacity: 0.7;
}

.anchor-opacity:hover {
    opacity: 1;
}

.anchor-secondary {
    color: white;
}

.anchor-secondary:after {
    background-color: white;
}

.anchor-third {
    color: black;
}

.anchor-third:after {
    background-color: black;
}

.anchor-primary {
    color: white;
}

.anchor-primary:after {
    background-color: white;
}

.anchor-underline {
    display: inline-block;
    position: relative;
}

.anchor-underline:after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
}

.anchor-underline:hover:after {
    transform: scaleX(1);
    transform-origin: bottom left;
}

.burger-menu {
    position: absolute;
    width: 70%;
    height: 100vh;
    background: hsla(0,0%,100%,.95);
    left: -70%;
    opacity: 0;
    padding: 1rem;
    z-index: 3;
    transition: all 0.3s ease;
    top: 0;
}

.burger-menu-header {
    display: flex;
    justify-content: space-between;
    color: $primary;
    padding: 1rem;
}

.burger-menu h1 {
    margin-bottom: 0;
    font-family: 'contra-slab-bold';
}

.burger-menu .items {
    list-style: none;
    padding-left: 0px;
    font-size: 1.3rem;
}

.burger-menu .items li {
    border-bottom: 1px solid #ececec;
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
    width: 100%;
}

.close-btn {
    display: flex;
    align-items: center;
    font-size: 2rem;
    cursor: pointer;
    color: $primary;
}

.menu-icon {
    cursor: pointer;
    display: flex;
    gap: 0.5rem;
}

.subnav {
    position: relative;
    display: inline-block;
}

.subnav .subnav-content {
    display: none;
    position: absolute;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
}

.subnav:hover .subnav-content {
    display: block;
}

.subnav:hover .subnav-content a {
    display: block;
}
</style>