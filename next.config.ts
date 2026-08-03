import type { NextConfig } from "next";
import { getNextDistDir } from "./lib/next-dist-dir";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // Keep the live development compiler isolated from production builds.
  // Otherwise `next build` can replace assets referenced by a running dev server.
  distDir: getNextDistDir(process.env.NODE_ENV),
};

export default nextConfig;
