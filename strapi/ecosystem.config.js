module.exports = {
  apps: [
    {
      name: 'CasaTudorStrapi',
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      port: 1337,
      max_memory_restart: '512M',
    },
  ],
};
