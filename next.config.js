/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  experimental: {
    appDir: true
  },
  images: {
    domains: ['links.papareact.com']
  },
  // Tell webpack not to bundle openai — let Node.js require it directly at
  // runtime. This bypasses a Next.js 13 webpack ESM/CJS resolution conflict
  // where webpack picks index.mjs instead of index.js from the exports map.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
        { openai: 'commonjs openai' }
      ];
    }
    return config;
  }
};
