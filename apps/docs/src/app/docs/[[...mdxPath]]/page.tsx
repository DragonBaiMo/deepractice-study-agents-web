import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

interface PageProps {
  params: Promise<{ mdxPath?: string[] }>
}

const Wrapper = useMDXComponents().wrapper!

export default async function Page(props: PageProps) {
  const params = await props.params
  const { default: MDXContent, toc, metadata } = await importPage(params.mdxPath)

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
