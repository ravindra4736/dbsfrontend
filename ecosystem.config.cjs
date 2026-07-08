module.exports = {
  apps: [
    {
      name: "dbs_front",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_APP_ENV: "production"
      },
      env_staging: {
        NODE_ENV: "production",
        NEXT_PUBLIC_APP_ENV: "staging"
      },
      env_local: {
        NODE_ENV: "development",
        NEXT_PUBLIC_APP_ENV: "local"
      }
    }
  ]
};
