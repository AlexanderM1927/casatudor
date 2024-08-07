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
                <div class="company-name">CASA TUDOR</div>
                <div class="menu-icon">
                    <Icon name="material-symbols:garden-cart-outline" @click="openCart" />
                    <Icon name="material-symbols:favorite" @click="openFavoritesModal" />
                </div>
            </div>
        </template>
        <template v-else>
            <div id="header" :class="`header ${route.name === 'index' ? 'header-transparent' : 'header-secondary'}`">
                <div class="company-name">CASA TUDOR</div>
                <ul class="menu-items">
                    <li>
                        <NuxtLink
                            title="Inicio" 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                            to="/"
                        >Inicio</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink 
                            title="Publicaciones" 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                            to="/posts"
                        >Publicaciones</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink 
                            title="Tienda" 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                            to="/items"
                        >Tienda</NuxtLink>
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
                            title="Login" 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-primary" 
                            to="/login"
                        >Login</NuxtLink>
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
        <div class="burger-menu" ref="burgerMenu">
            <div class="burger-menu-header">
                <h1 class="subtitle">Casa Tudor</h1>
                <div class="close-btn">
                    <Icon name="material-symbols:close" @click="closeBurger()" color="white" />
                </div>
            </div>
            <ul class="items">
                <li><NuxtLink title="Inicio" class="anchor anchor-third" to="/">Inicio</NuxtLink></li>
                <li><NuxtLink title="Publicaciones" class="anchor anchor-third" to="/posts">Publicaciones</NuxtLink></li>
                <li><NuxtLink title="Tienda" class="anchor anchor-third" to="/items">Tienda</NuxtLink></li>
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
                        title="Login"
                    >Login</NuxtLink>
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
        </div>
        <TheCart :isCartOpen="isCartOpen" @closeCart="closeCart()"></TheCart>
        <TheFavoritesModal :isFavoritesModalOpen="isFavoritesModalOpen" @closeFavoritesModal="closeFavoritesModal()"></TheFavoritesModal>
    </div>
</template>

<script setup lang="ts">
import PageService from '@/services/PageService';
import { useBreakpoints } from '@/composables/useBreakpoints'
const route = useRoute()

const { type } = useBreakpoints()
const userState = useUserStore()

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

const pageService = new PageService(useRuntimeConfig())

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
        burgerMenu.value.style.left = '-80%'
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

const changeHeaderPerWhite = (() => {
    if (burgerMenuBtn) burgerMenuBtn.style.color = 'black'
    document.getElementById('header')?.classList.replace('header-transparent', 'header-secondary')
    document.getElementById('header-mobile')?.classList.replace('header-transparent', 'header-secondary')
    setMenuItemsColor('secondary')
})
const changeHeaderPerDefault = (() => {
    if (burgerMenuBtn) burgerMenuBtn.style.color = 'white'
    document.getElementById('header')?.classList.replace('header-secondary', 'header-transparent')
    document.getElementById('header-mobile')?.classList.replace('header-secondary', 'header-transparent')
    setMenuItemsColor('primary')
})

const handleScroll = (() => {
    const bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (bodyScrollTop > 70) {
        changeHeaderPerWhite()
    } else {
        if (route.name === 'index') {
            changeHeaderPerDefault()
        } else {
            changeHeaderPerWhite()
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

<style lang="scss">
@import "@/styles/_colors.scss";

.header-secondary, .ct-bg-secondary {
    background: $softBlue;
    border-bottom: 1px solid rgba(60, 60, 60, .12);
    color: white;
}

.header-transparent, .ct-bg-transparent {
    background: transparent;
    color: white;
}

.header-mobile {
    display: flex;
    position: fixed;
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
    position: fixed;
    display: flex;
    font-size: 1.5rem;
    padding: 1rem;
    width: 100%;
    justify-content: space-between;
    z-index: 3;
}

.company-name {
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
    position: fixed;
    width: 80%;
    height: 100vh;
    background: white;
    left: -80%;
    opacity: 0;
    padding: 1rem;
    z-index: 3;
    transition: all 0.3s ease;
}

.burger-menu-header {
    display: flex;
    justify-content: space-between;
    background: $softBlue;
    color: white;
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

.close-btn {
    display: flex;
    align-items: center;
    font-size: 2rem;
    cursor: pointer;
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