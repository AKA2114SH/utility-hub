/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for GitHub Pages static hosting
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js default Image Optimization
  },
  // If your URL is username.github.io/utility-hub/, uncomment the line below:
  // basePath: '/utility-hub', 
};

export default nextConfig;
