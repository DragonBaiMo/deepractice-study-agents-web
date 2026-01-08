import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { motion } from 'framer-motion'
import { Wrapper } from './wrapper'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

interface PageProps {
  params: Promise<{ mdxPath?: string[] }>
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const { default: MDXContent } = await importPage(params.mdxPath)

  return (
    <Wrapper>
      <MDXContent />
    </Wrapper>
  )
}
