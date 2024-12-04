module.exports = {
  apps: [{
    name: "reddit-metrics-cron",
    script: "./scripts/cron.ts",
    interpreter: "ts-node.cmd",
    watch: false,
    autorestart: true,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
};