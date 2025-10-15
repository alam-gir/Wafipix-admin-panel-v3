import React from 'react';
import { Editor } from '@tiptap/react';
import { TextFormattingToolbar } from './text-formatting-toolbar';
import { EditorContentArea } from './editor-content-area';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  editor: Editor | null;
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  editor,
  placeholder = 'Start typing...',
  className,
  showToolbar = true
}) => {
  if (!editor) return null;

  return (
    <div className={cn('border border-gray-200 rounded-lg bg-white', className)}>
      {showToolbar && <TextFormattingToolbar editor={editor} />}
      <EditorContentArea 
        editor={editor} 
        placeholder={placeholder}
        className="min-h-[200px]"
      />
    </div>
  );
};
