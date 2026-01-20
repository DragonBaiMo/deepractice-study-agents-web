import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../../../mdx-components'
import type { ComponentType, ReactNode } from 'react'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

type DocsPageParams = {
  mdxPath?: string | string[]
}

type PageProps = {
  params?: Promise<DocsPageParams>
  searchParams?: Promise<any>
}

function normalizeMdxPath(mdxPath: DocsPageParams['mdxPath']): string[] | null {
  if (!mdxPath) return null
  if (Array.isArray(mdxPath)) return mdxPath.length > 0 ? mdxPath : null
  return mdxPath.length > 0 ? [mdxPath] : null
}

export async function generateMetadata(props: PageProps) {
  const params = (await props.params) ?? {}
  const mdxPath = normalizeMdxPath(params.mdxPath)
  if (!mdxPath) return {}

  const { metadata } = await importPage(mdxPath)
  return metadata
}

const Wrapper = (getMDXComponents().wrapper ??
  (({ children }: { children: ReactNode }) => <>{children}</>)) as ComponentType<any>

export default async function Page(props: PageProps) {
  const params = (await props.params) ?? {}
  const mdxPath = normalizeMdxPath(params.mdxPath)

  if (!mdxPath) {
    const { redirect } = await import('next/navigation')
    redirect('/docs/learning-map')
  }

  const resolvedMdxPath = mdxPath as string[]

  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode
  } = await importPage(resolvedMdxPath)

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent params={{ ...params, mdxPath: resolvedMdxPath }} />
    </Wrapper>
  )
}
