<template>
  <div v-if="!isLoading">
    <template v-if="type === 'xs'">
      <div
        id="header-mobile"
        :class="`header-mobile ${
          route.name === 'index' ? 'header-transparent' : 'header-secondary'
        }`"
      >
        <div id="burger-menu-btn" class="burger-menu-btn">
          <Icon name="iconamoon:menu-burger-horizontal-fill" @click="openBurger" />
        </div>
        <div class="company-name" @click="goToHome()">
          <NuxtImg
            :alt="appConfig.public.storeName"
            :title="appConfig.public.storeName"
            src="/img/logo.png"
          />
        </div>
        <div class="menu-icon">
          <div class="menu-items__product">
            <span v-show="cartProducts.length > 0" class="menu-items__product-text">{{
              cartProducts.length
            }}</span>
            <Icon name="material-symbols:garden-cart-outline" @click="openCart" />
          </div>
          <div>
            <Icon name="material-symbols:favorite" @click="openFavoritesModal" />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        id="header"
        :class="`header ${
          route.name === 'index' ? 'header-transparent' : 'header-secondary'
        }`"
      >
        <div class="company-name" @click="goToHome()">
          <NuxtImg
            :alt="appConfig.public.storeName"
            :title="appConfig.public.storeName"
            src="/img/logo.png"
          />
        </div>
        <ul class="menu-items">
          <li>
            <NuxtLink
              :title="texts.pages.index"
              :class="`menu-items-anchor anchor anchor-opacity anchor-underline ${
                route.name === 'index' ? 'anchor-secondary' : 'anchor-primary'
              }`"
              to="/"
              >{{ texts.pages.index }}</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              :title="texts.pages.store"
              :class="`menu-items-anchor anchor anchor-opacity anchor-underline ${
                route.name === 'index' ? 'anchor-secondary' : 'anchor-primary'
              }`"
              to="/items"
              >{{ texts.pages.store }}</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              :title="texts.pages.posts"
              :class="`menu-items-anchor anchor anchor-opacity anchor-underline ${
                route.name === 'index' ? 'anchor-secondary' : 'anchor-primary'
              }`"
              to="/posts"
              >{{ texts.pages.posts }}</NuxtLink
            >
          </li>
          <li class="subnav" v-for="(page, index) in pages" :key="index" v-show="page.isHeaderLink">
            <NuxtLink
              :title="page.urlTitle"
              :class="`menu-items-anchor anchor anchor-opacity anchor-underline ${
                route.name === 'index' ? 'anchor-secondary' : 'anchor-primary'
              }`"
              :to="`/pages/${page.urlId}`"
              >{{ page.urlTitle }}</NuxtLink
            >
          </li>
          <li v-if="!user">
            <NuxtLink
              :title="texts.pages.login"
              :class="`menu-items-anchor anchor anchor-opacity anchor-underline ${
                route.name === 'index' ? 'anchor-secondary' : 'anchor-primary'
              }`"
              to="/login"
              >{{ texts.pages.login }}</NuxtLink
            >
          </li>
          <li v-if="user">
            <NuxtLink
              title="Mis Pedidos"
              :class="`menu-items-anchor anchor anchor-opacity anchor-underline ${
                route.name === 'index' ? 'anchor-secondary' : 'anchor-primary'
              }`"
              to="/orders"
              >Mis Pedidos</NuxtLink
            >
          </li>
          <li v-if="user">
            <a
              title="Logout"
              :class="`menu-items-anchor anchor anchor-opacity anchor-underline ${
                route.name === 'index' ? 'anchor-secondary' : 'anchor-primary'
              }`"
              @click="handleLogout"
              href="#"
              >Logout</a
            >
          </li>
          <li>
            <div class="menu-icon">
              <div class="menu-items__product">
                <span v-show="cartProducts.length > 0" class="menu-items__product-text">{{
                  cartProducts.length
                }}</span>
                <Icon name="material-symbols:garden-cart-outline" @click="openCart" />
              </div>
              <div>
                <Icon name="material-symbols:favorite" @click="openFavoritesModal" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
    
    <!-- Subnavigation menu - appears below main header -->
    <div 
      v-if="type !== 'xs' && currentPageWithSubpages && currentPageWithSubpages.subpages?.data?.length > 0"
      :class="subnavBarClasses"
    >
      <div class="subnav-container">
        <ul class="subnav-items">
          <li v-for="(subpage, index) in currentPageWithSubpages.subpages.data" :key="index">
            <NuxtLink
              :class="`subnav-link anchor anchor-opacity anchor-underline ${
                route.path.includes(`/subpages/${subpage.urlId}`) ? 'subnav-link-active' : ''
              }`"
              :to="`/subpages/${subpage.urlId}`"
              :title="subpage.urlTitle"
            >
              {{ subpage.urlTitle }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    
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
        />
      </div>
      <ul class="items">
        <li>
          <NuxtLink :title="texts.pages.index" class="anchor anchor-third burger-menu-link" to="/">{{
            texts.pages.index
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :title="texts.pages.store" class="anchor anchor-third burger-menu-link" to="/items">{{
            texts.pages.store
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :title="texts.pages.posts" class="anchor anchor-third burger-menu-link" to="/posts">{{
            texts.pages.posts
          }}</NuxtLink>
        </li>
        <li v-for="(page, index) in pages" :key="index" v-show="page.isHeaderLink">
          <div v-if="page.subpages && page.subpages.data && page.subpages.data.length > 0">
            <!-- Page with subpages - clickable to toggle -->
            <a
              class="anchor anchor-third burger-menu-link burger-menu-parent"
              @click="toggleSubpages(page.id)"
              href="#"
              :title="page.urlTitle"
            >
              {{ page.urlTitle }}
              <Icon 
                name="material-symbols:keyboard-arrow-down" 
                :class="{ 'rotated': expandedPages.has(page.id) }"
                class="arrow-icon"
              />
            </a>
            <!-- Subpages list - shown/hidden based on parent state -->
            <ul v-show="expandedPages.has(page.id)" class="subpages-list">
              <li v-for="(subpage, subIndex) in page.subpages.data" :key="subIndex">
                <NuxtLink
                  class="anchor anchor-third burger-menu-link subpage-link"
                  :to="`/subpages/${subpage.urlId}`"
                  :title="subpage.urlTitle"
                >
                  {{ subpage.urlTitle }}
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div v-else>
            <!-- Page without subpages - direct link -->
            <NuxtLink
              class="anchor anchor-third burger-menu-link"
              :to="`/pages/${page.urlId}`"
              :title="page.urlTitle"
            >
              {{ page.urlTitle }}
            </NuxtLink>
          </div>
        </li>
        <li v-if="!user">
          <NuxtLink class="anchor anchor-third burger-menu-link" to="/login" :title="texts.pages.login">{{
            texts.pages.login
          }}</NuxtLink>
        </li>
        <li v-if="user">
          <NuxtLink class="anchor anchor-third burger-menu-link" to="/orders" title="Mis Pedidos"
            >Mis Pedidos</NuxtLink
          >
        </li>
        <li v-if="user">
          <a title="Logout" class="anchor anchor-third burger-menu-link" @click="handleLogout" href="#"
            >Logout</a
          >
        </li>
      </ul>
      <SocialMediaLinks :data="data" :color="'black'"></SocialMediaLinks>
    </div>
    <TheCart :data="data" :isCartOpen="isCartOpen" @closeCart="closeCart()"></TheCart>
    <TheFavoritesModal
      :isFavoritesModalOpen="isFavoritesModalOpen"
      @closeFavoritesModal="closeFavoritesModal()"
    ></TheFavoritesModal>
  </div>
</template>

<script setup lang="ts">
import PageService from "@/services/PageService";
import { useBreakpoints } from "@/composables/useBreakpoints";
import SocialMediaLinks from "./SocialMediaLinks.vue";
import texts from "@/config/texts.json";
import type { IPage } from "@/types/Page";
defineProps({
  data: {
    type: Object,
  },
});
const route = useRoute();

const { type } = useBreakpoints();
const cartState = useCartStore();
const appConfig = useRuntimeConfig();
const { user, logout } = useAuth()
const cartStoreComputed = storeToRefs(cartState);
const cartProducts = cartStoreComputed.getProductsCart;

const burgerMenu: Ref<HTMLDivElement | undefined> = ref();
const isCartOpen: Ref<boolean> = ref(false);
const isFavoritesModalOpen: Ref<boolean> = ref(false);
const pages: Ref<[IPage]> = ref([
  {
    id: 0,
    urlId: "",
    urlTitle: "",
    title: "",
    content: "",
    subpages: {},
  },
]);
const isLoading: Ref<boolean> = ref(false);
const productNameSearch: Ref<String> = ref("");
const expandedPages: Ref<Set<number>> = ref(new Set());

const searchItem = () => {
  navigateTo("/items?q=" + productNameSearch.value);
};

const toggleSubpages = (pageId: number) => {
  if (expandedPages.value.has(pageId)) {
    expandedPages.value.delete(pageId);
  } else {
    expandedPages.value.add(pageId);
  }
};

// Computed property to check if current route matches a page that has subpages
const currentPageWithSubpages = computed(() => {
  // Check if we're on a main page that has subpages
  const mainPage = pages.value.find(page => 
    route.path.includes(`/pages/${page.urlId}`) && 
    page.subpages?.data && 
    page.subpages.data.length > 0
  );
  
  if (mainPage) return mainPage;
  
  // Check if we're on a subpage, then find its parent page
  for (const page of pages.value) {
    if (page.subpages?.data && page.subpages.data.length > 0) {
      const isOnSubpage = page.subpages.data.some(subpage => 
        route.path.includes(`/subpages/${subpage.urlId}`)
      );
      if (isOnSubpage) {
        return page;
      }
    }
  }
  
  return null;
});

// Computed property for subnav bar classes
const subnavBarClasses = computed(() => {
  return `subnav-bar ${route.name === 'index' ? 'subnav-bar-transparent' : ''}`;
});

// Add body class when subnav is visible
const updateBodyPadding = () => {
  if (typeof document === 'undefined') return;
  
  const body = document.body;
  const hasSubnav = currentPageWithSubpages.value && currentPageWithSubpages?.value?.subpages?.data?.length > 0;
  
  if (hasSubnav && type.value !== 'xs') {
    body.classList.add('has-subnav');
  } else {
    body.classList.remove('has-subnav');
  }
};

const pageService = new PageService(appConfig);

const getPages = async () => {
  isLoading.value = true;
  const { data }: any = await pageService.getPages();
  pages.value = data.map(({ id, attributes }: { id: number; attributes: any }) => {
    const page: IPage = {
      ...attributes,
      id: id,
    };
    if (attributes.subpages && attributes.subpages.data.length > 0) {
      page.subpages.data = attributes.subpages.data.map(
        ({ id, attributes }: { id: number; attributes: any }) => {
          return {
            ...attributes,
            id: id,
          };
        }
      );
    }
    return page;
  });
  isLoading.value = false;
};

watch(
  () => route.name,
  () => {
    handleScroll();
    closeBurger();
    // Force update subnav positioning after route change
    nextTick(() => {
      handleScroll();
    });
  }
);

watch(
  () => currentPageWithSubpages.value,
  () => {
    // When the subpage visibility changes, update positioning
    nextTick(() => {
      handleScroll();
      updateBodyPadding();
    });
  }
);

const goToHome = () => {
  navigateTo("/");
};

const handleLogout = async () => {
  await logout()
  cartState.clearCart()
  navigateTo('/login')
};

const openCart = () => {
  isCartOpen.value = true;
};

const closeCart = () => {
  isCartOpen.value = false;
};

const openFavoritesModal = () => {
  isFavoritesModalOpen.value = true;
};

const closeFavoritesModal = () => {
  isFavoritesModalOpen.value = false;
};

const closeBurger = () => {
  if (burgerMenu.value) {
    burgerMenu.value.style.opacity = "0";
    burgerMenu.value.style.left = "-70%";
  }
  // Reset expanded pages when closing burger menu
  expandedPages.value.clear();
};

const openBurger = () => {
  if (burgerMenu.value) {
    burgerMenu.value.style.opacity = "1";
    burgerMenu.value.style.left = "0px";
  }
};

const setMenuItemsColor = (color: String) => {
  const menuItems = document.getElementsByClassName("menu-items-anchor");
  const elemntsModalWithBgWhite = document.getElementsByClassName("subnav-content");
  for (let i = 0; i < menuItems.length; i++) {
    if (color === "primary") {
      // Cambiar a primary (color oscuro para header blanco)
      menuItems[i].classList.replace("anchor-secondary", "anchor-primary");
    } else {
      // Cambiar a secondary (color blanco para header transparente)
      menuItems[i].classList.replace("anchor-primary", "anchor-secondary");
    }
  }
  for (let i = 0; i < elemntsModalWithBgWhite.length; i++) {
    if (color === "primary") {
      elemntsModalWithBgWhite[i]?.classList.replace(
        "ct-bg-transparent",
        "ct-bg-secondary"
      );
    } else {
      elemntsModalWithBgWhite[i]?.classList.replace(
        "ct-bg-secondary",
        "ct-bg-transparent"
      );
    }
  }
};

const burgerMenuBtn = typeof document !== 'undefined' ? document.getElementById("burger-menu-btn") : null;
const setPositionsFixed = () => {
  if (typeof document === 'undefined') return;
  const headerHTML = document.getElementById("header");
  const headerMobileHTML = document.getElementById("header-mobile");
  const burgerMenuHTML = document.getElementById("burger-menu");
  const subnavBar = document.querySelector(".subnav-bar") as HTMLElement;
  
  if (headerHTML) {
    headerHTML.style.position = "fixed";
  }
  if (headerMobileHTML) {
    headerMobileHTML.style.position = "fixed";
  }
  if (burgerMenuHTML) {
    burgerMenuHTML.style.position = "fixed";
  }
  if (subnavBar) {
    subnavBar.style.top = "7rem"; // Fixed position below header
    subnavBar.style.position = "fixed";
    subnavBar.style.zIndex = "2"; // Ensure it's below main header
  }
};
const setPositionsAbsolute = () => {
  if (typeof document === 'undefined') return;
  const headerHTML = document.getElementById("header");
  const headerMobileHTML = document.getElementById("header-mobile");
  const burgerMenuHTML = document.getElementById("burger-menu");
  const subnavBar = document.querySelector(".subnav-bar") as HTMLElement;
  
  if (headerHTML) {
    headerHTML.style.position = "absolute";
  }
  if (headerMobileHTML) {
    headerMobileHTML.style.position = "absolute";
  }
  if (burgerMenuHTML) {
    burgerMenuHTML.style.position = "absolute";
  }
  if (subnavBar) {
    subnavBar.style.top = "7rem"; // Maintain position below header
    subnavBar.style.position = "absolute"; // Change to absolute when main header is absolute
    subnavBar.style.zIndex = "2";
  }
};
const changeHeaderPerWhite = () => {
  if (typeof document === 'undefined') return;
  const headerHTML = document.getElementById("header");
  const headerMobileHTML = document.getElementById("header-mobile");
  if (burgerMenuBtn) burgerMenuBtn.style.color = "black";
  headerHTML?.classList.replace("header-transparent", "header-secondary");
  headerMobileHTML?.classList.replace("header-transparent", "header-secondary");
  setMenuItemsColor("primary"); // Cambia a anchor-primary (color oscuro)
};
const changeHeaderPerDefault = () => {
  if (typeof document === 'undefined') return;
  const headerHTML = document.getElementById("header");
  const headerMobileHTML = document.getElementById("header-mobile");
  if (burgerMenuBtn) burgerMenuBtn.style.color = "white";
  headerHTML?.classList.replace("header-secondary", "header-transparent");
  headerMobileHTML?.classList.replace("header-secondary", "header-transparent");
  setMenuItemsColor("secondary"); // Cambia a anchor-secondary (color blanco)
};

const handleScroll = () => {
  const bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (bodyScrollTop > 100) {
    changeHeaderPerWhite();
    setPositionsFixed();
  } else {
    if (route.name === "index") {
      changeHeaderPerDefault();
      setPositionsAbsolute();
    } else {
      changeHeaderPerWhite();
      setPositionsAbsolute();
    }
  }
  
  // Ensure subnav positioning is always correct
  nextTick(() => {
    const subnavBar = document.querySelector(".subnav-bar") as HTMLElement;
    if (subnavBar) {
      subnavBar.style.top = "7rem";
      subnavBar.style.zIndex = "2";
      if (bodyScrollTop > 100) {
        subnavBar.style.position = "fixed";
      } else {
        subnavBar.style.position = route.name === "index" ? "absolute" : "absolute";
      }
    }
  });
};

onMounted(() => {
  getPages();
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      handleScroll();
      updateBodyPadding();
      window.addEventListener("scroll", () => {
        handleScroll();
      });
    }, 200);
  }
});

// Watch for route changes to update subnav
watch(() => route.path, () => {
  nextTick(() => {
    setTimeout(() => {
      handleScroll();
      updateBodyPadding();
    }, 100);
  });
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener("scroll", () => {
      handleScroll();
    });
  }
  // Clean up body class
  if (typeof document !== 'undefined') {
    document.body.classList.remove('has-subnav');
  }
});
</script>

<style lang="scss" scoped>



.header-secondary,
.ct-bg-secondary {
  background: $headerBackground;
  border-bottom: 1px solid rgba(60, 60, 60, 0.12);
  color: $headerTextColor;
}

.header-transparent,
.ct-bg-transparent {
  background: transparent;
  color: white;
}

.header-mobile {
  display: flex;
  position: absolute;
  top: 0px;
  z-index: 3;
  font-size: 1.5rem;
  padding: 0rem 1rem;
  vertical-align: middle;
  width: 100%;
  place-items: center;
  justify-content: space-between;
  font-family: "Inter";
  font-weight: 700;
}

.header-mobile .burger-menu-btn {
  display: flex;
  align-items: center;
}

.header {
  position: absolute;
  display: flex;
  font-size: 1.5rem;
  padding-left: 4rem;
  padding-right: 4rem;
  width: 100%;
  justify-content: space-between;
  z-index: 3;
  top: 0px;
}

.company-name {
  cursor: pointer;
  font-family: "Inter";
}

.company-name img {
  height: 7rem;
  width: auto;
}

.header .menu-items {
  font-family: "Inter";
  display: flex;
  gap: 1rem;
  list-style: none;
  font-size: 1rem;
  margin-bottom: 0;
  align-items: center;
  font-weight: 700;
}

.subnav-bar {
  position: fixed;
  top: 7rem; /* Position below the main header */
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid rgba(60, 60, 60, 0.12);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  transition: all 0.3s ease;
  width: 100%;
}

.subnav-bar-transparent {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.subnav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.subnav-items {
  display: flex;
  justify-content: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 1rem 0;
  font-family: "Inter";
  font-weight: 600;
}

.subnav-link {
  color: $headerTextColor;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  font-size: 0.95rem;
}

.subnav-link:hover {
  color: $headerTextColor;
}

.subnav-link-active {
  color: $headerTextColor;
  font-weight: 700;
}

.subnav-link:after {
  background-color: $headerTextColor;
}

@media only screen and (max-width: $grid-breakpoints-md) {
  .subnav-container {
    padding: 0 1rem;
  }
  
  .subnav-items {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .subnav-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}

@media only screen and (max-width: $grid-breakpoints-sm) {
  .subnav-bar {
    display: none; /* Hide subnav on mobile - use burger menu instead */
  }
}

// Global styles for pages with subnav
:global(.first-container-with-subnav) {
  padding-top: 12rem !important; /* Extra padding for subnav */
}

@media only screen and (max-width: $grid-breakpoints-sm) {
  :global(.first-container-with-subnav) {
    padding-top: 8rem !important; /* Less padding on mobile since subnav is hidden */
  }
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
  color: #FFF;
}

.anchor-secondary:after {
  background-color: #FFF;
}

.anchor-third {
  color: black;
}

.anchor-third:after {
  background-color: black;
}

.anchor-primary {
  color: $headerTextColor;
}

.anchor-primary:after {
  background-color: $headerTextColor;
}

.anchor-underline {
  display: inline-block;
  position: relative;
}

.anchor-underline:after {
  content: "";
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
  background: hsla(0, 0%, 100%, 0.95);
  left: -70%;
  opacity: 0;
  padding: 1rem;
  z-index: 3;
  transition: all 0.3s ease;
  top: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.burger-menu-header {
  display: flex;
  justify-content: space-between;
  color: $primary;
  padding: 1rem;
}

.burger-menu h1 {
  margin-bottom: 0;
  font-family: "Inter";
  font-weight: 700;
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

.menu-items__product {
  position: relative;
}

.menu-items__product-text {
  position: absolute;
  right: -0.3rem;
  top: -0.1rem;
  background: $cartItemsQuantityHeaderBackground;
  color: white;
  border-radius: 50%;
  height: 0.5rem;
  width: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3rem;
  font-size: 0.7rem;
  border: 1px solid $cartItemsQuantityHeaderBackground;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
  .menu-items__product-text {
    top: -0.1rem;
    right: -0.3rem;
    padding: 0.5rem;
    font-size: 1rem;
  }
}

.burger-menu-link {
  display: block;
  width: 100%;
  transition: background-color 0.2s ease, padding-left 0.2s ease;
  display: flex;
  align-items: center;
}

.burger-menu-parent {
  justify-content: space-between;
  cursor: pointer;
}

.arrow-icon {
  transition: transform 0.3s ease;
  font-size: 1.2rem;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

.subpages-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.subpages-list li {
  border-bottom: 1px solid #f0f0f0;
  border-top: none;
}

.subpage-link {
  padding-left: 1rem;
  font-size: 1.1rem;
}

:global(body.has-subnav .first-container) {
  padding-top: 12rem !important; /* 10rem (header) + 2rem (subnav) */
}

@media only screen and (max-width: $grid-breakpoints-sm) {
  :global(body.has-subnav .first-container) {
    padding-top: 10rem !important; /* Normal padding on mobile since subnav is hidden */
  }
}

/* Transition for smooth spacing changes */
:global(.first-container) {
  transition: padding-top 0.3s ease;
}
</style>
