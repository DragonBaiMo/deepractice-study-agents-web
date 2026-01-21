import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/docs',
  latex: true  // 启用 LaTeX 数学公式支持
})

const basePathRaw = process.env.NEXT_PUBLIC_BASE_PATH || ''
// Allow setting NEXT_PUBLIC_BASE_PATH to '/' to mean "no basePath" (useful for custom domains).
const basePath = basePathRaw === '/' ? '' : basePathRaw
const isGithubPages = process.env.GITHUB_PAGES === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isGithubPages ? { output: 'export', trailingSlash: true } : {}),
  ...(isGithubPages && basePath ? { basePath, assetPrefix: basePath } : {}),

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
