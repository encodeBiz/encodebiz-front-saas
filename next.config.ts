import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com','flagpedia.net', 'flagcdn.com', 'example.com', 'placehold.co', 'storage.googleapis.com', 'firebasestorage.googleapis.com'], // Add your image domains here
    },
    env: {
        DEFAULT_TIMEZONE: 'UTC'
    }
};

export default withNextIntl(nextConfig);;
