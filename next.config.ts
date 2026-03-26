const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // 明确指定项目根目录为当前目录
    root: path.join(__dirname),
  },
};

module.exports = nextConfig;