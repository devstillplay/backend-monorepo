const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Monorepo: silence incorrect workspace-root inference (multiple lockfiles) so dev
  // bundling and chunk URLs resolve consistently with apps/stillPlay-mobile as the app root.
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

module.exports = nextConfig;
