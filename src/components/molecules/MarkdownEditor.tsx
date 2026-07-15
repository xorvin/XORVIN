import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownEditorProps {
  value: string;
  onChange: (value?: string) => void;
  height?: number;
}

export function MarkdownEditor({ value, onChange, height = 400 }: MarkdownEditorProps) {
  return (
    <div data-color-mode="dark" className="markdown-editor-wrapper">
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        className="!bg-[#0f172a] !border-white/10"
      />
      <style>{`
        .markdown-editor-wrapper .w-md-editor {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-radius: 0.5rem;
          border-color: rgba(255, 255, 255, 0.1);
        }
        .markdown-editor-wrapper .w-md-editor-toolbar {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }
        .markdown-editor-wrapper .w-md-editor-preview {
          background-color: transparent !important;
        }
      `}</style>
    </div>
  );
}
