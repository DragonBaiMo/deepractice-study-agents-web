import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'mdx/types'

// Custom MDX components
import { Alert } from '@/components/mdx/alert'
import { Steps } from '@/components/mdx/steps'
import { CodePlayground } from '@/components/mdx/code-playground'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...docsComponents,
    // Custom components
    Alert,
    Callout: Alert, // Alias for backward compatibility
    Steps,
    CodePlayground,
    CodeRun: CodePlayground, // Alias for backward compatibility
    // Override default components if needed
    ...components,
  }
}
