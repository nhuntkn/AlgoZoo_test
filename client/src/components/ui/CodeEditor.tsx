import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  height?: string
  readOnly?: boolean
}

export function CodeEditor({ value, onChange, language, height = '320px', readOnly = false }: CodeEditorProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(next) => onChange(next ?? '')}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  )
}
