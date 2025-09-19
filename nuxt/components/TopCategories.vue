<template>
  <section v-if="!isLoading" class="second-container bg-white">
    <h2 class="title">{{ texts.top_categories }}</h2>
    <div class="top-categories">
      <div
        v-for="category in categories"
        :key="category.id"
        class="top-categories__category"
        :style="`background-image: url(${category.image})`"
        @click="navigateTo('/items?c=' + category.id)"
      >
        <div class="top-categories__category-name">
          {{ category.name }}
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import texts from "@/config/texts.json";
import TopCategoryService from "@/services/TopCategoryService";
import type { ICategory } from "~/types/Category";

const appConfig = useRuntimeConfig();
const topCategoryService = new TopCategoryService(appConfig);
const isLoading: Ref<Boolean> = ref(true);
const categories: Ref<[ICategory] | []> = ref([]);

const getTopCategories = async () => {
  isLoading.value = true;
  try {
    const { data: dataFromRequest }: any = await topCategoryService.getTopCategories();
    const topCategory = dataFromRequest[0];
    if (!topCategory) return;
    const { data } = topCategory.attributes.categories;
    if (!data) return;
    categories.value = data.map(({ id, attributes }: { id: number; attributes: any }) => {
      const categorie: ICategory = {
        ...attributes,
        image: useImageFromStrapi(attributes?.image?.data?.attributes?.url),
        id: id,
      };
      return categorie;
    });
  } catch (e) {
    console.log(e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getTopCategories();
});
</script>
<style scoped lang="scss">


.top-categories {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 1rem;
}

.top-categories__category {
  width: 50%;
  aspect-ratio: 1/1;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  cursor: pointer;
  box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.14), 0 0px 1rem 0 rgba(0, 0, 0, 0.12),
    0 0.1rem 0.2rem -0.1rem rgba(0, 0, 0, 0.3);
}

@media only screen and (max-width: $grid-breakpoints-sm) {
  .top-categories__category {
    width: 100%;
  }
}

@media only screen and (max-width: $grid-breakpoints-sm) {
  .top-categories {
    flex-direction: column;
  }
}

.top-categories__category-name {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.32);
  color: white;
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
