import type { Attribute, Schema } from '@strapi/strapi';

export interface VariantsSize extends Schema.Component {
  collectionName: 'components_variants_sizes';
  info: {
    displayName: 'Size';
  };
  attributes: {
    name: Attribute.String;
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
    name: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'variants.size': VariantsSize;
      'variants.variant': VariantsVariant;
    }
  }
}
