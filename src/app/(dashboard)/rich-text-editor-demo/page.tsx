'use client';

import React, { useState } from 'react';
import { ClientOnlyRichTextEditor } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RichTextEditorDemo() {
  const [content, setContent] = useState('<p>This is a <strong>rich text editor</strong> demo!</p>');
  const [generatedHtml, setGeneratedHtml] = useState('');

  const handleContentChange = (html: string) => {
    setContent(html);
  };

  const handleGenerateHtml = () => {
    setGeneratedHtml(content);
  };

  const handleClear = () => {
    setContent('');
    setGeneratedHtml('');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Rich Text Editor Demo
        </h1>
        <p className="text-gray-600">
          A modular rich text editor built with Tiptap
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Rich Text Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>
              <ClientOnlyRichTextEditor
                content={content}
                onChange={handleContentChange}
                placeholder="Start typing your content here..."
              />
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={handleGenerateHtml}>
                Generate HTML
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated HTML */}
        <Card>
          <CardHeader>
            <CardTitle>Generated HTML</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  HTML Output:
                </h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {generatedHtml || 'Click "Generate HTML" to see the output'}
                </pre>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Rendered Preview:
                </h4>
                <div 
                  className="border p-3 rounded min-h-[100px] bg-white"
                  dangerouslySetInnerHTML={{ __html: generatedHtml }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Text Formatting</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bold text</li>
                <li>• Italic text</li>
                <li>• Underlined text</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Lists</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bullet lists</li>
                <li>• Numbered lists</li>
                <li>• Nested lists</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Links</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add links</li>
                <li>• Remove links</li>
                <li>• Click to edit</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
