import pluginId from './pluginId.js';

const plugin = {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: () => '📊',
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Data Exporter',
      },
      Component: async () => {
        const { default: component } = await import('./pages/HomePage');
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

export default plugin;
