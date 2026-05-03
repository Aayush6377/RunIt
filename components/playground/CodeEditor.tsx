"use client";
import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";
import { initVimMode } from "monaco-vim";

export default function CodeEditor() {
  const { snippetId, selectedLanguage, code, setCode, theme, vimMode, autoSave } = usePlaygroundStore();
  const vimModeRef = useRef<any>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);

  // Autosave API Link
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
    }, 3000); // Save after 3 seconds of inactivity

    return () => clearTimeout(timer);
  }, [code, autoSave, snippetId]);

  const handleEditorMount = (editor: any) => {
    if (vimMode && statusBarRef.current) {
      vimModeRef.current = initVimMode(editor, statusBarRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (vimModeRef.current) vimModeRef.current.dispose();
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
        <div ref={statusBarRef} className="absolute bottom-0 left-0 right-0 bg-[#d0bcff] text-[#23005c] px-2 text-[10px] font-mono z-50 h-5 flex items-center" />
      )}
    </div>
  );
}