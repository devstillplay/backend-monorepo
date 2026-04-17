const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Monorepo: silence incorrect workspace-root inference (multiple lockfiles) so dev
  // bundling and chunk URLs resolve consistently with apps/stillPlay-mobile as the app root.
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // Expose widget id to the client if only `DOJAH_WIDGET_ID` is set (e.g. shared root `.env`).
  env: {
    NEXT_PUBLIC_DOJAH_WIDGET_ID:
      process.env.NEXT_PUBLIC_DOJAH_WIDGET_ID || process.env.DOJAH_WIDGET_ID || "",
  },
};

module.exports = nextConfig;
