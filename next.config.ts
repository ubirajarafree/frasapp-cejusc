import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => ({
    ...config,
    externals: [
      ...config.externals,
      {
        sharp: "commonjs sharp",
      },
    ],
  }),
};

export default nextConfig;
