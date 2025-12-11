import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      hostname: 'lh3.googleusercontent.com'
    },
    {
      hostname: 'flagpedia.net'
    },
    {
      hostname: 'flagcdn.com'
    }, {
      hostname: 'example.com'
    }, {
      hostname: 'placehold.co'
    }, {
      hostname: 'storage.googleapis.com'
    }, {
      hostname: 'firebasestorage.googleapis.com'
    }], // Add your image domains here
  },
  env: {
    DEFAULT_TIMEZONE: 'UTC'
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);;
