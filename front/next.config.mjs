/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental:
  {
    reactCompiler: {
      compilationMode: "all",
      panicThreshold: "ALL_ERRORS"
    }
  }
};

export default nextConfig;
