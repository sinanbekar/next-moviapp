/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ["*.themoviedb.org", "*.tmdb.org", "*.googleusercontent.com"],
  },
};
