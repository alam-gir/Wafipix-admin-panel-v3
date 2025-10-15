import React from 'react';
import { Editor } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';
import { cn } from '@/lib/utils';

interface EditorContentAreaProps {
  editor: Editor | null;
  placeholder?: string;
  className?: string;
}

export const EditorContentArea: React.FC<EditorContentAreaProps> = ({
  editor,
  placeholder = 'Start typing...',
  className
}) => {
  if (!editor) return null;

  return (
    <div className={cn('min-h-[200px] p-4', className)}>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};
