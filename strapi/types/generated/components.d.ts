import type { Attribute, Schema } from '@strapi/strapi';

export interface ProductsProducts extends Schema.Component {
  collectionName: 'components_products_products';
  info: {
    description: '';
    displayName: 'products';
  };
  attributes: {
    product: Attribute.Relation<
      'products.products',
      'oneToOne',
      'api::product.product'
    >;
    quantity: Attribute.Integer;
    selectedVariants: Attribute.JSON;
  };
}

export interface TopCategoriesTopCategories extends Schema.Component {
  collectionName: 'components_top_categories_top_categories';
  info: {
    displayName: 'topCategories';
  };
  attributes: {
    category: Attribute.Relation<
      'top-categories.top-categories',
      'oneToOne',
      'api::category.category'
    >;
    image: Attribute.Media<'images' | 'files' | 'videos' | 'audios', true>;
    urlForRedirect: Attribute.String;
  };
}

export interface VariantsSize extends Schema.Component {
  collectionName: 'components_variants_sizes';
  info: {
    description: '';
    displayName: 'Size';
  };
  attributes: {
    name: Attribute.String;
    quantity: Attribute.Integer;
  };
}

export interface VariantsVariant extends Schema.Component {
  collectionName: 'components_variants_variants';
  info: {
    description: '';
    displayName: 'color';
  };
  attributes: {
    hexadecimal: Attribute.String;
    image: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Attribute.String;
    quantity: Attribute.Integer;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'products.products': ProductsProducts;
      'top-categories.top-categories': TopCategoriesTopCategories;
      'variants.size': VariantsSize;
      'variants.variant': VariantsVariant;
    }
  }
}
