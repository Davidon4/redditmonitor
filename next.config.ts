import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'oauth.reddit.com', 'www.reddit.com',
      'lh3.googleusercontent.com', 'avatars.githubusercontent.com'
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'utf-8-validate': false,
        'bufferutil': false,
        'node-fetch': false
      };
    }
    return config;
  }
};

export default nextConfig;