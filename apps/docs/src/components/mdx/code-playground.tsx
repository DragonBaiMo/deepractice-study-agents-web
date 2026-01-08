'use client'

import { useState, useCallback } from 'react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

interface CodePlaygroundProps {
  code: string
  language?: 'javascript' | 'typescript'
  title?: string
  editable?: boolean
}

export function CodePlayground({
  code: initialCode,
  language = 'javascript',
  title,
  editable = true,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode.trim())
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runCode = useCallback(async () => {
    setIsRunning(true)
    setError(null)
    setOutput('')

    // Artificial delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      // Capture console.log output
      const logs: string[] = []
      const originalLog = console.log
      console.log = (...args) => {
        logs.push(args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '))
      }

      // Execute the code
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      const fn = new AsyncFunction(code)
      const result = await fn()

      // Restore console.log
      console.log = originalLog

      // Set output
      const outputLines = [...logs]
      if (result !== undefined) {
        outputLines.push(`→ ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`)
      }
      setOutput(outputLines.join('\n') || '(no output)')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsRunning(false)
    }
  }, [code])

  const resetCode = useCallback(() => {
    setCode(initialCode.trim())
    setOutput('')
    setError(null)
  }, [initialCode])

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm ring-1 ring-surface-200 transition-shadow duration-300 hover:shadow-md dark:border-surface-700 dark:bg-surface-100/50 dark:ring-surface-700">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-200 bg-surface-50/50 px-4 py-3 backdrop-blur-sm dark:border-surface-700 dark:bg-surface-100/30">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
            <span className="h-3 w-3 rounded-full bg-red-400 shadow-sm" />
            <span className="h-3 w-3 rounded-full bg-amber-400 shadow-sm" />
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-sm" />
          </div>
          {title && (
            <span className="ml-2 text-sm font-medium text-text-secondary">
              {title}
            </span>
          )}
        </div>
        <span className="rounded-md bg-surface-200/50 px-2 py-0.5 text-xs font-medium text-text-tertiary ring-1 ring-surface-300/20 dark:bg-surface-300/20">
          {language}
        </span>
      </div>

      {/* Code Editor */}
      <div className="relative group">
        <textarea
          value={code}
          onChange={(e) => editable && setCode(e.target.value)}
          readOnly={!editable}
          className={clsx(
            'block w-full resize-none bg-[#1e1e1e] p-5 font-mono text-sm leading-relaxed text-gray-100',
            'focus:outline-none focus:ring-0',
            !editable && 'cursor-default'
          )}
          rows={Math.min(Math.max(code.split('\n').length, 5), 15)}
          spellCheck={false}
        />
        {editable && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
             <span className="text-xs text-gray-500 bg-[#1e1e1e]/80 px-2 py-1 rounded">Editable</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-surface-200 bg-surface-50 px-4 py-3 dark:border-surface-700 dark:bg-surface-100/30">
        <div className="flex gap-2">
          <button
            onClick={runCode}
            disabled={isRunning}
            className={clsx(
              'group inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all active:scale-95',
              'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400',
              'disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100'
            )}
          >
            {isRunning ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="opacity-90">运行中...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                运行代码
              </>
            )}
          </button>

          {editable && (
            <button
              onClick={resetCode}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-200 hover:text-text-primary dark:hover:bg-surface-700"
              title="重置代码"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Output */}
      <AnimatePresence>
        {(output || error) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-surface-200 dark:border-surface-700 overflow-hidden"
          >
            <div className="bg-surface-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-tertiary dark:bg-surface-100/20">
              Output
            </div>
            <pre
              className={clsx(
                'max-h-64 overflow-auto p-5 font-mono text-sm leading-relaxed',
                error
                  ? 'bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-300'
                  : 'bg-[#1e1e1e] text-gray-100'
              )}
            >
              {error || output}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
