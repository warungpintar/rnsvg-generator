module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = true;
      config.resolve.fallback.path = true;
    }

    return config;
  },
};
