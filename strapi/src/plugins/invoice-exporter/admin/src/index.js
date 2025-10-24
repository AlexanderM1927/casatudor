const pluginId = require('./pluginId');

module.exports = {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: () => '📊',
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Invoice Exporter',
      },
      Component: async () => {
        const component = await import('./pages/HomePage');
        return component;
      },
      permissions: [], // Sin permisos = accesible para todos los admins
    });

    app.registerPlugin({
      id: pluginId,
      name: pluginId,
    });
  },
  bootstrap() {},
};
