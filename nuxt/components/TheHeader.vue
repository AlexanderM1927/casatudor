<template>
    <div>
        <template v-if="type === 'xs'">
            <div 
                id="header-mobile" 
                :class="`header-mobile ${route.name === 'index' ? 'header-transparent' : 'header-white'}`"
            >
                <div id="burger-menu-btn" class="burger-menu-btn">
                    <Icon name="iconamoon:menu-burger-horizontal-fill" @click="openBurger" />
                </div>
                <div class="company-name">CASA TUDOR</div>
                <div class="cart-icon">
                    <Icon name="material-symbols:garden-cart-outline" @click="openCart" />
                </div>
            </div>
        </template>
        <template v-else>
            <div id="header" :class="`header ${route.name === 'index' ? 'header-transparent' : 'header-white'}`">
                <div class="company-name">CASA TUDOR</div>
                <ul class="menu-items">
                    <li>
                        <NuxtLink 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-black" 
                            to="/"
                        >Home</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-black" 
                            to="/posts"
                        >Posts</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-black" 
                            to="/items"
                        >Store</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-black" 
                            to="/info"
                        >Info</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink 
                            class="menu-items-anchor anchor anchor-opacity anchor-underline anchor-black" 
                            to="/login"
                        >Login</NuxtLink>
                    </li>
                    <li>
                        <div class="cart-icon">
                        <Icon name="material-symbols:garden-cart-outline" @click="openCart" />
                    </div>
                    </li>
                </ul>
            </div>
        </template>
        <div class="burger-menu" ref="burgerMenu">
            <div class="burger-menu-header">
                <h1>Casa Tudor</h1>
                <div class="close-btn">
                    <Icon name="material-symbols:close" @click="closeBurger()" color="black" />
                </div>
            </div>
            <ul class="items">
                <li><NuxtLink class="anchor anchor-black" to="/">Home</NuxtLink></li>
                <li><NuxtLink class="anchor anchor-black" to="/posts">Posts</NuxtLink></li>
                <li><NuxtLink class="anchor anchor-black" to="/items">Store</NuxtLink></li>
                <li><NuxtLink class="anchor anchor-black" to="/info">Info</NuxtLink></li>
                <li><NuxtLink class="anchor anchor-black" to="/login">Login</NuxtLink></li>
            </ul>
        </div>
        <div class="cart-content" ref="cartContent">
            <div class="cart-content-header">
                <h2>My Cart</h2>
                <div class="close-btn">
                    <Icon name="material-symbols:close" @click="closeCart()" color="black" />
                </div>
            </div>
            <div class="cart-content-items">
                <div class="row">
                    <ProductCart
                        v-for="(product, index) in cartProducts"
                        :key="index"
                        :product="product"
                        :childClass="`col-12`"
                    ></ProductCart>
                </div>
            </div>
        </div>
        <div id="overlay"></div>
    </div>
</template>

<script setup lang="ts">
import { useBreakpoints } from '../composables/getBreakpoints'
const cart = useCartStore()
const route = useRoute()

const { type } = useBreakpoints()

const burgerMenu: Ref<HTMLDivElement | undefined> = ref()
const cartContent: Ref<HTMLDivElement | undefined> = ref()

const cartProducts = cart.getProductsCart

watch(() => route.name, () => {
    handleScroll()
    closeBurger()
})

const closeBurger = (() => {
    if (burgerMenu.value) {
        burgerMenu.value.style.opacity = '0'
        burgerMenu.value.style.visibility = 'hidden'
    }
})

const openBurger = (() => {
    if (burgerMenu.value) {
        burgerMenu.value.style.opacity = '1'
        burgerMenu.value.style.visibility = 'visible'
    }
})

const closeCart = (() => {
    const overlayItem = document.getElementById("overlay")
    if (overlayItem) overlayItem.style.display = "none";
    if (cartContent.value) {
        cartContent.value.style.opacity = '0'
        cartContent.value.style.visibility = 'hidden'
    }
})

const openCart = (() => {
    const overlayItem = document.getElementById("overlay")
    if (overlayItem) overlayItem.style.display = "block";
    if (cartContent.value) {
        cartContent.value.style.opacity = '1'
        cartContent.value.style.visibility = 'visible'
    }
})

const setMenuItemsColor = ((color: String) => {
    const menuItems = document.getElementsByClassName('menu-items-anchor')
    for (let i = 0; i < menuItems.length; i++) {
        if (color === 'white') {
            menuItems[i].classList.replace('anchor-black', 'anchor-white') 
        } else {
            menuItems[i].classList.replace('anchor-white', 'anchor-black') 
        }
    }
})

const burgerMenuBtn = document.getElementById('burger-menu-btn')

const changeHeaderPerWhite = (() => {
    if (burgerMenuBtn) burgerMenuBtn.style.color = 'black'
    document.getElementById('header')?.classList.replace('header-transparent', 'header-white')
    document.getElementById('header-mobile')?.classList.replace('header-transparent', 'header-white')
    setMenuItemsColor('black')
})
const changeHeaderPerDefault = (() => {
    if (burgerMenuBtn) burgerMenuBtn.style.color = 'white'
    document.getElementById('header')?.classList.replace('header-white', 'header-transparent')
    document.getElementById('header-mobile')?.classList.replace('header-white', 'header-transparent')
    setMenuItemsColor('white')
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

onMounted(() => {
    handleScroll()
    window.addEventListener('scroll', () => {
        handleScroll()
    })
})

onUnmounted(() => {
    window.removeEventListener('scroll', () => {
        handleScroll()
    })
})
</script>

<style lang="scss" scoped>
@import "../styles/_breakpoints.scss";
.header-white {
    background: white;
    border-bottom: 1px solid rgba(60, 60, 60, .12);
    color: black
}

.header-transparent {
    background: transparent;
    color: white;
}

.header-mobile {
    display: flex;
    position: fixed;
    z-index: 2;
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

.anchor-white {
    color: white;
}

.anchor-white:after {
    background-color: white;
}

.anchor-black {
    color: black;
}

.anchor-black:after {
    background-color: black;
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
    width: 100%;
    height: 100vh;
    background: white;
    visibility: hidden;
    opacity: 0;
    padding: 1rem;
    z-index: 3;
    transition: visibility 0s, opacity 0.5s linear;
}

.burger-menu-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #000;
}

.burger-menu h1 {
    font-family: 'contra-slab-bold';
    font-size: 3rem;
}

.burger-menu .items {
    list-style: none;
    padding-left: 0px;
    font-size: 1.3rem;
}

.close-btn {
    font-size: 2rem;
}

#overlay {
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 4; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}

.cart-content {
    position: fixed;
    width: 30%;
    right: 0;
    height: 100vh;
    background: white;
    visibility: hidden;
    opacity: 0;
    padding: 1rem;
    z-index: 5;
    transition: visibility 0s, opacity 0.5s linear;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .cart-content {
        width: 100%;
    }
}
.cart-content-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #000;
}

.cart-content h1 {
    font-family: 'contra-slab-bold';
    font-size: 3rem;
}

.cart-content-items {
    overflow-y: auto;
    overflow-x: hidden;
}
</style>