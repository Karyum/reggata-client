/** @type {import('next').NextConfig} */
module.exports = {
  pageExtensions: ['page.tsx'],
  productionBrowserSourceMaps: true,
  compress: false,
  reactStrictMode: true,
  images: {
    domains: ['localhost']
  },
  transpilePackages: ['rc-util', '@ant-design', 'leva', 'antd', 'rc-pagination', 'rc-picker']
}
