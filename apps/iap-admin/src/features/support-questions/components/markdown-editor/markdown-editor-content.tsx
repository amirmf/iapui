import type { Editor } from '@tiptap/core'
import { EditorContent } from '@tiptap/react'

type MarkdownEditorContentProps = {
  editor: Editor | null
}

export function MarkdownEditorContent({ editor }: MarkdownEditorContentProps) {
  return (
    <EditorContent
      editor={editor}
      className='min-h-36 px-3 py-2 text-[13px] [&_.tiptap]:min-h-32 [&_.tiptap]:outline-none [&_.tiptap_h1]:my-3 [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-semibold [&_.tiptap_h2]:my-3 [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-semibold [&_.tiptap_h3]:my-3 [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold [&_.tiptap_h4]:my-2 [&_.tiptap_h4]:text-base [&_.tiptap_h4]:font-semibold [&_.tiptap_h5]:my-2 [&_.tiptap_h5]:text-sm [&_.tiptap_h5]:font-semibold [&_.tiptap_h6]:my-2 [&_.tiptap_h6]:text-xs [&_.tiptap_h6]:font-semibold [&_.tiptap_img]:my-3 [&_.tiptap_img]:max-w-full [&_.tiptap_ol]:my-3 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:ps-6 [&_.tiptap_p]:my-2 [&_.tiptap_ul]:my-3 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:ps-6'
    />
  )
}
