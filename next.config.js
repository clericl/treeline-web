/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Fixes warning Critical dependency: the request of a dependency is an expression
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
  },
}

module.exports = nextConfig
