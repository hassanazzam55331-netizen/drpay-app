/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wifi.e-misr.com',
      },
    ],
  },
  // Disable strict mode for easier dev
  reactStrictMode: false,
};

export default nextConfig;
