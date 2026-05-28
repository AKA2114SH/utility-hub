/** @type {import('next').NextConfig} */

// Detect if the build is running on GitHub Actions
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  // Required for GitHub Pages static hosting
  output: 'export', 
  
  // Only apply the sub-path prefix when on GitHub
  // This prevents breaking your Vercel deployment (which uses root /)
  basePath: isGithubActions ? '/utility-hub' : '',
  
  // Asset prefix ensures CSS/JS load from the correct folder
  assetPrefix: isGithubActions ? '/utility-hub/' : '',

  images: {
    // Mandatory for 'output: export' as there is no server-side optimization
    unoptimized: true, 
  },
};

export default nextConfig;
