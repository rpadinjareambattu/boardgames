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
};

export default nextConfig;
