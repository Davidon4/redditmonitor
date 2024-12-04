var config = {
    apps: [{
            name: "reddit-metrics-cron",
            script: "scripts/cron.ts",
            interpreter: "node",
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
module.exports = config;
