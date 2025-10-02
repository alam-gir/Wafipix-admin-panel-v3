"use client";

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Tell us about your project...",
  className 
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'text-primary/80',
          },
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        listItem: {
          HTMLAttributes: {},
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary pl-4 italic bg-muted/20 py-2 rounded my-4',
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-semibold',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-neutral dark:prose-invert max-w-none focus:outline-none',
        style: 'min-height: 200px; height: 100%; width: 100%;',
      },
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor || !isMounted) {
    return (
      <div className={cn("border border-border/20 rounded-lg overflow-hidden", className)}>
        <div className="flex flex-wrap items-center gap-1 p-3 bg-card/50 border-b border-border/20">
          <div className="h-8 w-8 bg-primary/20 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-primary/20 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-primary/20 rounded animate-pulse"></div>
        </div>
        <div className="p-4 min-h-[200px] bg-card/50">
          <div className="h-4 bg-primary/20 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-primary/20 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-primary/20 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

     return (
     <div className={cn("border border-border/20 rounded-lg overflow-hidden flex flex-col", className)}>
       {/* Toolbar */}
       <div className="flex flex-wrap items-center gap-1 p-3 bg-card/50 border-b border-border/20">
                 <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().toggleBold().run()}
           className={cn(
             "h-8 w-8 p-0",
             editor.isActive('bold') && "bg-primary/20 text-primary"
           )}
         >
           <Bold className="w-4 h-4" />
         </Button>
         
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().toggleItalic().run()}
           className={cn(
             "h-8 w-8 p-0",
             editor.isActive('italic') && "bg-primary/20 text-primary"
           )}
         >
           <Italic className="w-4 h-4" />
         </Button>
         
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={() => editor.chain().focus().toggleUnderline().run()}
           className={cn(
             "h-8 w-8 p-0",
             editor.isActive('underline') && "bg-primary/20 text-primary"
           )}
         >
           <UnderlineIcon className="w-4 h-4" />
         </Button>

        <div className="w-px h-6 bg-border/30 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('bulletList') && "bg-primary/20 text-primary"
          )}
        >
          <List className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('orderedList') && "bg-primary/20 text-primary"
          )}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('blockquote') && "bg-primary/20 text-primary"
          )}
        >
          <Quote className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border/30 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: 'left' }) && "bg-primary/20 text-primary"
          )}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: 'center' }) && "bg-primary/20 text-primary"
          )}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: 'right' }) && "bg-primary/20 text-primary"
          )}
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border/30 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={editor.isActive('link') ? addLink : setLink}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('link') && "bg-primary/20 text-primary"
          )}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div 
        className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto cursor-text flex-1 bg-card/30 focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-20"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent 
          editor={editor} 
          className="w-full h-full"
        />
      </div>
    </div>
  );
} 