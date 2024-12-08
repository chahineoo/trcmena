module.exports = {
  apps : [{
    name: "next-app",
    script: "yarn",
    args: "start",
    cwd: "",
    watch: false,
    env: {
      NODE_ENV: "production",
    }
  }]
};