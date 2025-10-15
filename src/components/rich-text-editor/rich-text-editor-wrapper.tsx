import React from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { RichTextEditor } from './rich-text-editor';

interface RichTextEditorWrapperProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
  editable?: boolean;
}

export const RichTextEditorWrapper: React.FC<RichTextEditorWrapperProps> = ({
  content = '',
  onChange,
  placeholder = 'Start typing...',
  className,
  showToolbar = true,
  editable = true
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Keep the default list functionality but add our custom styling
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside ml-6',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside ml-6',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'mb-1',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Underline,
    ],
    content,
    editable,
    immediatelyRender: false, // Fix SSR hydration mismatch
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  // Update editor content when content prop changes
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <RichTextEditor
      editor={editor}
      placeholder={placeholder}
      className={className}
      showToolbar={showToolbar}
    />
  );
};
