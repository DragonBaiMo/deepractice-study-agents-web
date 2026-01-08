import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/docs',
  latex: true  // 启用 LaTeX 数学公式支持
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Output for static export (Vercel handles this automatically)
  // output: 'export',

  // Image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },

  // Transpile packages
  transpilePackages: ['@deepractice/ui'],
}

export default withNextra(nextConfig)
