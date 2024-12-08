module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["guardarian.com"],
  },

  reactStrictMode: false,

  webpack(config: any) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};
