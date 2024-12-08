module.exports = {
  apps : [{
    name: "nestjs-app",
    script: "./dist/main.js",
    cwd: "",
    watch: false,
    env: {
      NODE_ENV: "production",
    }
  }]
};