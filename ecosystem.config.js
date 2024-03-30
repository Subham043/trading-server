module.exports = {
  apps: [
    {
      name: "trading_api",
      script: "./build/index.js",
      exec_mode: "cluster",
      port: 8080,
      watch: true,
    },
  ],
};
