/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          // Basic redirect
          {
            source: '/matches',
            destination: '/',
            permanent: true,
          },
        ]
      },
      experimental: {
        missingSuspenseWithCSRBailout: false,
      },
};

export default nextConfig;
