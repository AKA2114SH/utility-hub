/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for GitHub Pages static hosting
  images: {
    unoptimized: true, // Required because GitHub Pages doesn't support Next.js Image Optimization
  },
  // Update this to your exact repository name
  basePath: '/utility-hub', 
};

export default nextConfig;
