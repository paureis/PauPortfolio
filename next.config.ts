import type { NextConfig } from "next";

// The site is a static export served by Azure Static Web Apps. Nothing here
// may depend on a Node server at request time.
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
