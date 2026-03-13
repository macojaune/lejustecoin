/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["img.leboncoin.fr"],
  },
};

export default nextConfig;
