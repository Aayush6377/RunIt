"use client";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Copy, Check, Terminal, Code2, AlertTriangle, ArrowRight, Keyboard } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Loader from "../ui/Loader";
import ErrorState from "../ui/ErrorState";

interface SharedSnippetClientProps {
  token: string;
}

export default function SharedSnippetClient({ token }: SharedSnippetClientProps) {
  const [snippet, setSnippet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [output, setOutput] = useState<string>("");
  const [customInput, setCustomInput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const res = await fetch(`/api/snippets/share/${token}`);
        const data = await res.json();

        if (data.success) {
          setSnippet(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to load snippet. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [token]);

  const handleCopy = () => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    if (!snippet) return;
    setIsRunning(true);
    setOutput("Executing code...\n");

    const getExecutionFileName = (language: string) => {
      const extMap: Record<string, string> = {
        javascript: "main.js",
        typescript: "main.ts",
        python: "main.py",
        java: "Main.java",
        cpp: "main.cpp",
        c: "main.c",
        rust: "main.rs",
        go: "main.go"
      };
      return extMap[language?.toLowerCase()] || `main.${language?.toLowerCase()}`;
    };
    
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: snippet.content, 
          language: snippet.language,
          fileName: getExecutionFileName(snippet.language), 
          stdin: customInput 
        })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.error) {
          setOutput(`Error:\n${data.error}\n\n${data.stderr ? `Stderr:\n${data.stderr}` : ''}`);
        } else if (data.stderr) {
          setOutput(`Stderr:\n${data.stderr}`);
        } else {
          setOutput(data.stdout || "Program finished with no output.");
        }
      } else {
        setOutput(`Error:\n${data.message || "Execution failed."}`);
      }
    } catch (err) {
      setOutput("Error: Failed to connect to execution server.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('runit-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0a0a0f',
        'editor.lineHighlightBackground': '#110e15', 
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#050505] flex items-center justify-center text-white">
        <Loader />
      </div>
    );
  }

  if (error || !snippet) {
    return (
    <ErrorState 
      title={error ? "Access Denied" : "Snippet Missing"}
      message={error || "The shared snippet link is invalid or has reached its expiration date."}
      type={error ? "access" : "error"}
    />
  );
  }

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      
      {/* Header Area */}
      <header className="h-16 border-b border-white/5 bg-white/[0.02] backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Code2 className="text-[#d0bcff]" /> RunIt
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <h1 className="text-sm font-semibold text-white/90">{snippet.title || "Untitled Snippet"}</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">{snippet.language}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-white/10">
            <img 
              src={snippet.owner?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${snippet.owner?.name}`} 
              alt="Author" 
              className="w-7 h-7 rounded-full border border-white/10 object-cover"
            />
            <span className="text-xs text-white/60 hidden sm:block">@{snippet.owner?.username || "anonymous"}</span>
          </div>
          <Link href={`/playground?clone=${token}`} target="_blank" className="flex items-center gap-2 bg-[#d0bcff] hover:bg-[#b59cfc] text-[#23005c] px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-[0_0_15px_rgba(208,188,255,0.15)]">
            Fork to Playground <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Main Content (Bento Grid Style) */}
      <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* The Editor showcase */}
        <section className="lg:col-span-2 flex flex-col bg-[#110e15] border border-white/5 rounded-2xl shadow-2xl overflow-hidden relative">
          
          {/* Mac Window Header */}
          <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] shadow-sm" />
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/5"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />} 
              {copied ? "Copied" : "Copy Code"}
            </button>
          </div>

          {/* Monaco Editor (Read Only) */}
          <div className="flex-1 bg-[#0a0a0f] p-2 min-h-[400px]">
            <Editor
              height="100%"
              theme="runit-dark"
              language={snippet.language === "cpp" ? "cpp" : snippet.language?.toLowerCase()}
              value={snippet.content}
              beforeMount={handleEditorWillMount}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                domReadOnly: true,
                cursorBlinking: "solid"
              }}
            />
          </div>
        </section>

        {/* Right Column: Execution Panel */}
        <section className="flex flex-col gap-6">
          
          {/* Run Control Box */}
          <div className="bg-[#110e15] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col items-center">
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#d0bcff]/10 flex items-center justify-center mb-3 border border-[#d0bcff]/20">
                <Play size={24} className="text-[#d0bcff] ml-1" />
              </div>
              <h3 className="text-white font-bold mb-1">Execute Snippet</h3>
              <p className="text-white/40 text-xs px-4">Run this code in our secure cloud environment.</p>
            </div>

            {/* Custom Input Field */}
            <div className="w-full mb-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1.5">
                <Keyboard size={12} /> Custom Input (stdin)
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter input values separated by spaces or newlines..."
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-3 text-sm text-white/80 outline-none focus:border-[#d0bcff]/50 transition-colors resize-none h-24 font-mono placeholder:text-white/20 shadow-inner no-scrollbar"
              />
            </div>
            
            <button 
              onClick={handleRun}
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-2 bg-[#27c93f]/10 hover:bg-[#27c93f]/20 text-[#27c93f] border border-[#27c93f]/20 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(39,201,63,0.1)]"
            >
              {isRunning ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Run Code <Play size={16} className="fill-current" /></>
              )}
            </button>
          </div>

          {/* Output Terminal */}
          <div className="flex-1 bg-[#110e15] border border-white/5 rounded-2xl shadow-xl flex flex-col overflow-hidden min-h-[300px]">
            <div className="h-10 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2 shrink-0">
              <Terminal size={14} className="text-white/40" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Output</span>
            </div>
            <div className="flex-1 bg-[#000000] p-4 overflow-y-auto font-mono text-sm text-white/80 whitespace-pre-wrap shadow-inner">
              {output || <span className="text-white/20">Ready to execute...</span>}
            </div>
          </div>
          
        </section>
      </main>
    </div>
  );
}