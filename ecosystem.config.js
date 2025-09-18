module.exports = {
  apps: [
    {
      name: "arlekino",
      script: "npm",
      args: "start",
      cwd: "/var/www/arlekino",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
}
