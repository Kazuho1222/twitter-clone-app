/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
};

export default nextConfig;
