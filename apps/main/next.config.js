/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is no longer needed in Next.js 14 - it's stable now
  },
  images: {
    domains: [
      'images.metmuseum.org',
      'upload.wikimedia.org',
      'uploads7.wikiart.org',
      'www.pexels.com',
      'images.pexels.com',
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Override the default webpack configuration
  webpack: (config) => {
    // See https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'onnxruntime-node$': false,
    };
    return config;
  },
  transpilePackages: [
    '@artloupe/media-display',
    '@artloupe/palette-studio',
    '@artloupe/shared-types',
    '@artloupe/mock-data',
    '@artloupe/logger',
  ], // Example for a monorepo package
};

module.exports = nextConfig;
