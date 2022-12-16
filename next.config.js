/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode:false,
  swcMinify: false,
  images:{
    domains:["images.unsplash.com"]
  },
  assetPrefix:"/"
}

module.exports = nextConfig