'use client'

import { PageTransition } from '@/components/app/page-transition'
import { ReactNode } from 'react'

export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
