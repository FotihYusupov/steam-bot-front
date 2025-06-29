module.exports = {
  apps: [
    {
      name: 'NuxtAppName',
      port: '4450',
      exec_mode: 'cluster',
      instances: 1,
      script: './.output/server/index.mjs'
    }
  ]
}
