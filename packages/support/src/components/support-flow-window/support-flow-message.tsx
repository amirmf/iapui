import { Link } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import {
  markdownEditorTextStylePattern,
  normalizeMarkdownEditorTextStyles,
  parseMarkdownEditorTextStyleAttributes,
} from './markdown-editor-text-style'

type SupportFlowMessageProps = {
  message?: string
}

function transformUrl(url: string): string {
  if (getInternalRouteHref(url)) return url

  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:'
      ? parsedUrl.toString()
      : ''
  } catch {
    return ''
  }
}

function getInternalRouteHref(value: string | undefined): string | null {
  if (!value || value.startsWith('//')) return null
  if (value.startsWith('/')) return value
  if (typeof window === 'undefined') return null

  try {
    const url = new URL(value)
    if (url.origin !== window.location.origin) return null

    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return null
  }
}

const editorStyleTagName = 'support-text-style'
const editorStyleAttributeName = 'data-editor-style'

type MarkdownNode = {
  children?: MarkdownNode[]
  type: string
  value?: string
}

type MarkdownTree = MarkdownNode & {
  children: MarkdownNode[]
}

type MarkdownHastElement = {
  children: MarkdownHastNode[]
  properties: {
    dataEditorStyle?: string | number | boolean | null | undefined
  }
  tagName: string
  type: 'element'
}

type MarkdownHastNode = MarkdownHastElement | { type: string }

type MarkdownHastTree = {
  children: MarkdownHastNode[]
}

function transformEditorTextStyles(message: string): string {
  return normalizeMarkdownEditorTextStyles(message).replace(
    markdownEditorTextStylePattern,
    (_match, styleAttributes: string, content: string) => {
      const style = parseMarkdownEditorTextStyleAttributes(styleAttributes)
      if (!style) return _match

      return `<${editorStyleTagName} ${editorStyleAttributeName}="${encodeURIComponent(styleAttributes)}">${content}</${editorStyleTagName}>`
    }
  )
}

function getEditorTextStyleFromAttribute(value: string) {
  try {
    return parseMarkdownEditorTextStyleAttributes(decodeURIComponent(value))
  } catch {
    return null
  }
}

function isEditorStyleTag(value: string): boolean {
  const escapedTagName = editorStyleTagName.replace('-', '\\-')
  const escapedAttributeName = editorStyleAttributeName.replace(/-/g, '\\-')
  const openTagPattern = new RegExp(
    `^<${escapedTagName}\\s+${escapedAttributeName}=(?:"[^"]*"|'[^']*')\\s*>$`,
    'i'
  )
  const closeTagPattern = new RegExp(`^</${escapedTagName}\\s*>$`, 'i')

  return openTagPattern.test(value) || closeTagPattern.test(value)
}

function removeRawHtmlExceptEditorStyleTags() {
  return (tree: MarkdownTree) => {
    tree.children = removeUnsupportedHtmlNodes(tree.children)
  }
}

function removeUnsupportedHtmlNodes(nodes: MarkdownNode[]): MarkdownNode[] {
  return nodes.flatMap((node) => {
    if (node.type === 'html') {
      return isEditorStyleTag(node.value ?? '') ? [node] : []
    }

    if (node.children) {
      node.children = removeUnsupportedHtmlNodes(node.children)
    }

    return [node]
  })
}

function convertEditorStyleElements() {
  return (tree: MarkdownHastTree) => {
    for (const node of tree.children) {
      convertEditorStyleElement(node)
    }
  }
}

function convertEditorStyleElement(node: MarkdownHastNode): void {
  if (!isMarkdownHastElement(node)) return

  if (node.tagName === editorStyleTagName) {
    const styleValue = node.properties.dataEditorStyle
    node.tagName = 'span'
    node.properties =
      typeof styleValue === 'string' ? { dataEditorStyle: styleValue } : {}
  }

  for (const child of node.children) {
    convertEditorStyleElement(child)
  }
}

function isMarkdownHastElement(
  node: MarkdownHastNode
): node is MarkdownHastElement {
  return node.type === 'element' && 'tagName' in node
}

export function SupportFlowMessage(props: SupportFlowMessageProps) {
  const { message } = props
  if (!message) return null

  return (
    <div className='motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 flex h-full w-full flex-1 flex-grow-0 flex-col pt-0.5'>
      <div className='[&_a]:text-primary [&_td]:border-border [&_th]:border-border [&_th]:bg-muted flex flex-1 flex-col overflow-auto rounded-lg border border-slate-200/80 bg-white/[0.92] px-3.5 py-2.5 text-sm leading-6 text-slate-700 shadow-sm ring-1 ring-slate-200/80 backdrop-blur [scrollbar-width:thin] sm:px-4 sm:py-3 sm:leading-7 dark:border-white/10 dark:bg-white/[0.07] dark:text-slate-100 dark:ring-white/10 [&_a]:underline [&_h1]:my-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-semibold [&_img]:my-3 [&_img]:max-w-full [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:ps-6 [&_p]:my-2 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-6'>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, convertEditorStyleElements]}
          remarkPlugins={[
            remarkGfm,
            remarkBreaks,
            removeRawHtmlExceptEditorStyleTags,
          ]}
          urlTransform={transformUrl}
          components={{
            a: ({ href, children }) => {
              const internalRouteHref = getInternalRouteHref(href)

              return internalRouteHref ? (
                <Link
                  to={internalRouteHref}
                  target={
                    internalRouteHref.endsWith('.mp4') ? '_blank' : '_self'
                  }
                >
                  {children}
                </Link>
              ) : (
                <a href={href} target='_blank' rel='noreferrer'>
                  {children}
                </a>
              )
            },
            span: ({ children, node }) => {
              const styleValue = node?.properties.dataEditorStyle
              const style =
                typeof styleValue === 'string'
                  ? getEditorTextStyleFromAttribute(styleValue)
                  : null

              return style ? <span style={style}>{children}</span> : children
            },
            img: ({ src, alt }) =>
              src ? <img src={src} alt={alt ?? ''} loading='lazy' /> : null,
          }}
        >
          {transformEditorTextStyles(message)}
        </ReactMarkdown>
      </div>
    </div>
  )
}
