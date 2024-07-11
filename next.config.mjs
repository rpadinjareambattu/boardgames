/** @type {import('next').NextConfig} */
const nextConfig = {
      experimental: {
        missingSuspenseWithCSRBailout: false,
      },
      images: {
        remotePatterns: [
          {
            protocol: process.env.NEXT_PUBLIC_IMAGE_PROTOCOL,
            hostname: process.env.NEXT_PUBLIC_IMAGE_HOST,
            port: process.env.NEXT_PUBLIC_IMAGE_PORT,
            pathname: '/uploads/**',
          },
        ],
      },
};

export default nextConfig;
