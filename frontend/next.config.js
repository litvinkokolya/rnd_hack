/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['127.0.0.1', 'beautyrank.ru', 's3.timeweb.cloud'],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@public'] = path.join(__dirname, 'public');
    return config;
  },
};

module.exports = nextConfig;
