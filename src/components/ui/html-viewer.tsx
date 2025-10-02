'use client'

import { cn } from '@/lib/utils'

interface HtmlViewerProps {
  content: string
  className?: string
}

export function HtmlViewer({ content, className }: HtmlViewerProps) {
  if (!content || content.trim() === '') {
    return (
      <div className={cn("text-muted-foreground italic", className)}>
        No description provided
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:font-semibold prose-headings:text-foreground",
        "prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4 prose-p:last:mb-0",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-em:text-foreground prose-em:italic",
        "prose-ul:text-foreground prose-ol:text-foreground prose-ul:list-disc prose-ol:list-decimal",
        "prose-li:text-foreground prose-li:marker:text-foreground prose-li:list-item prose-li:ml-4",
        "prose-blockquote:text-foreground prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-muted/20 prose-blockquote:py-2 prose-blockquote:rounded prose-blockquote:my-4",
        "prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-img:rounded-lg prose-img:shadow-sm",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
