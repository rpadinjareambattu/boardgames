/** @type {import('next').NextConfig} */
const nextConfig = {
      experimental: {
        missingSuspenseWithCSRBailout: false,
      },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'otboardgames.azurewebsites.net',
            port: '',
            pathname: '/uploads/**',
          },
        ],
      },
};

export default nextConfig;
