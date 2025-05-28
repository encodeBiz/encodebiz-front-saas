import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {    
    images: {
        domains: ['example.com'], // Add your image domains here
    },
};

export default withNextIntl(nextConfig);;
