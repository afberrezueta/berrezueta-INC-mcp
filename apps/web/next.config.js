/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      // berrezuetainc.com (the company domain) is served by this same project and shows the company page.
      beforeFiles: [
        { source: "/", has: [{ type: "host", value: "(www\\.)?berrezuetainc\\.com" }], destination: "/company" },
      ],
    };
  },
};

export default nextConfig;
