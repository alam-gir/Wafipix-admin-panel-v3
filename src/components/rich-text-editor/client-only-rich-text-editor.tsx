'use client';

import React, { useState, useEffect } from 'react';
import { RichTextEditorWrapper } from './rich-text-editor-wrapper';

interface ClientOnlyRichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
  editable?: boolean;
}

export const ClientOnlyRichTextEditor: React.FC<ClientOnlyRichTextEditorProps> = ({
  content = '',
  onChange,
  placeholder = 'Start typing...',
  className,
  showToolbar = true,
  editable = true
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className={`border border-gray-200 rounded-lg bg-white ${className}`}>
        <div className="p-4 min-h-[200px] flex items-center justify-center text-gray-500">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <RichTextEditorWrapper
      content={content}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      showToolbar={showToolbar}
      editable={editable}
    />
  );
};
