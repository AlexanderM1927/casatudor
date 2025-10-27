'use strict';

const controllers = require('./controllers');
const routes = require('./routes');

module.exports = {
  controllers,
  routes,
  register({ strapi }) {
    // Registro del plugin
  },
  bootstrap({ strapi }) {
    // Inicialización del plugin
  },
};
