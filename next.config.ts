import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  transpilePackages: ["remotion", "@remotion/player"],
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, unknown>),
      "@remotion/bundler": false,
      "@remotion/renderer": false,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      child_process: false,
      worker_threads: false,
    };
    return config;
  },
};

export default nextConfig;
