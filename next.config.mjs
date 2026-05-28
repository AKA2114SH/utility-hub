/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Manually force the repository name here
  basePath: '/utility-hub',
  assetPrefix: '/utility-hub/', 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
