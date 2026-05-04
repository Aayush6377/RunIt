"use client";
import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";

export default function CodeEditor() {
  const { snippetId, selectedLanguage, code, setCode, theme, vimMode, autoSave } = usePlaygroundStore();
  
  const vimModeRef = useRef<any>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!autoSave || !snippetId || !code) return;
    const timer = setTimeout(async () => {
      try {
        await fetch(`/api/snippets/${snippetId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: code })
        });
        console.log("Autosaved!");
      } catch (e) {
        console.error("Autosave failed", e);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [code, autoSave, snippetId]);

  const setupVimMode = async () => {
    if (vimMode && editorRef.current && statusBarRef.current && !vimModeRef.current) {
      const { initVimMode } = await import("monaco-vim");
      vimModeRef.current = initVimMode(editorRef.current, statusBarRef.current);
    } else if (!vimMode && vimModeRef.current) {
      vimModeRef.current.dispose();
      vimModeRef.current = null;
    }
  };

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('runit-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#050505',
        'editor.lineHighlightBackground': '#110e15', 
        'editorLineNumber.foreground': '#555555',
        'editorCursor.foreground': '#d0bcff',
        'editor.selectionBackground': '#d0bcff30', 
      }
    });

    monaco.editor.defineTheme('runit-midnight', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'd0bcff' }, 
        { token: 'comment', foreground: '6b5a8e', fontStyle: 'italic' }, 
      ],
      colors: {
        'editor.background': '#0a0812', 
        'editor.lineHighlightBackground': '#161224',
        'editorLineNumber.foreground': '#6b5a8e',
        'editorCursor.foreground': '#d0bcff',
        'editor.selectionBackground': '#23005c80',
      }
    });

    monaco.editor.defineTheme('runit-oled', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#000000',
        'editor.lineHighlightBackground': '#111111', 
        'editorLineNumber.foreground': '#444444',
        'editorCursor.foreground': '#ffffff',
        'editor.selectionBackground': '#333333',
      }
    });
  };

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    setupVimMode();
  };

  useEffect(() => {
    setupVimMode();
    return () => {
      if (vimModeRef.current) {
        vimModeRef.current.dispose();
        vimModeRef.current = null;
      }
    };
  }, [vimMode]);

  return (
    <div className="w-full h-full bg-[#050505] flex flex-col relative">
      <Editor
        height="100%"
        theme={theme}
        language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage}
        value={code}
        onChange={(val) => setCode(val || "")}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          minimap: { enabled: false },
          automaticLayout: true,
          padding: { top: 16 },
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
        }}
      />
      {vimMode && (
        <div 
          ref={statusBarRef} 
          className="absolute bottom-0 left-0 right-0 bg-[#d0bcff] text-[#23005c] px-2 text-[10px] font-mono z-50 h-5 flex items-center" 
        />
      )}
    </div>
  );
}