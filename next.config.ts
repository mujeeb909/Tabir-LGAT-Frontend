// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Also ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  output: 'export',
  images: {
    unoptimized: true,
  }
};

module.exports = nextConfig;
