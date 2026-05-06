"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Panel, Group, Separator } from "react-resizable-panels";
import PlaygroundHeader from "./PlaygroundHeader";
import CodeEditor from "./CodeEditor";
import PlaygroundSettings from "./PlaygroundSettings";
import HistorySidebar from "./HistorySidebar";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";
import { Terminal, MessageSquare, Loader2 } from "lucide-react";
import AiSidebar from "./AiSidebar";
import { toast } from "sonner";

function PlaygroundContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Extract URL parameters
  const snippetIdParam = params?.snippetId as string;
  const cloneToken = searchParams?.get("clone");

  const [activeTab, setActiveTab] = useState<"output" | "input">("output");
  const [isMobile, setIsMobile] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const { 
    output, userInput, setUserInput, isAiSidebarOpen,
    isSettingsOpen, isHistoryOpen, terminalPosition,
    setCode, setLanguage, setTitle, setFileName, setVisibility, setSnippetId, resetPlayground 
  } = usePlaygroundStore();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // MASTER INITIALIZATION LOGIC
  useEffect(() => {
    const initializeWorkspace = async () => {
      // SCENARIO 1: Load existing snippet by ID from the URL
      if (snippetIdParam) {
        try {
          const res = await fetch(`/api/snippets/${snippetIdParam}`);
          const data = await res.json();
          
          if (data.success) {
            setLanguage(data.data.language.toLowerCase());
            setCode(data.data.content);
            setTitle(data.data.title || "Untitled");
            setFileName(data.data.fileName || "main"); // <-- Loading fileName
            setVisibility(data.data.visibility);
            setSnippetId(data.data.id);
          } else {
            toast.error("Snippet not found.");
            resetPlayground();
          }
        } catch (err) {
          toast.error("Failed to load snippet.");
        }
      } 
      // SCENARIO 2: Clone from a share token
      else if (cloneToken) {
        try {
          const res = await fetch(`/api/snippets/share/${cloneToken}`);
          const data = await res.json();
          
          if (data.success) {
            setLanguage(data.data.language.toLowerCase());
            setCode(data.data.content);
            setTitle(data.data.title || "Untitled");
            setFileName(data.data.fileName || "main");
            setSnippetId(null); // Keep null so it acts as a fresh clone
            toast.success("Snippet cloned! Ready to edit.");
          } else {
            toast.error("Failed to clone snippet.");
          }
        } catch (err) {
          toast.error("Failed to fetch clone data.");
        }
      }
      // SCENARIO 3: Fresh start (No URL params)
      else {
        resetPlayground(); // Forces the "wipe on refresh" rule
      }
      
      setIsInitializing(false); // Unlock the editor to mount
    };

    initializeWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippetIdParam, cloneToken]);

  // Prevent aggressive autosave by hiding editor until data is populated
  if (isInitializing) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0f] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#d0bcff]" />
        <p className="text-sm font-mono text-white/50">Setting up workspace...</p>
      </div>
    );
  }

  const effectivePosition = isMobile ? "bottom" : terminalPosition;
  const isVertical = effectivePosition === "bottom";
  const isTerminalFirst = effectivePosition === "left";

  const TerminalPanel = (
    <Panel defaultSize={35} minSize={20}>
      <div className="w-full h-full bg-[#0a0a0f] flex flex-col">
        <div className="flex bg-[#050505] border-b border-white/10 overflow-x-auto no-scrollbar shrink-0">
          <button onClick={() => setActiveTab("output")} className={`px-4 py-3 text-[10px] font-bold uppercase transition-colors whitespace-nowrap ${activeTab === "output" ? "text-[#d0bcff] border-b border-[#d0bcff] bg-white/5" : "text-white/40 hover:text-white"}`}><Terminal size={14} className="inline mr-2"/>Output</button>
          <button onClick={() => setActiveTab("input")} className={`px-4 py-3 text-[10px] font-bold uppercase transition-colors whitespace-nowrap ${activeTab === "input" ? "text-[#d0bcff] border-b border-[#d0bcff] bg-white/5" : "text-white/40 hover:text-white"}`}><MessageSquare size={14} className="inline mr-2"/>Input</button>
        </div>
        <div className="flex-1 p-4 font-mono text-sm overflow-auto">
          {activeTab === "output" ? (
            <div className="whitespace-pre-wrap text-white/80">{output || "No output yet."}</div>
          ) : (
            <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Enter inputs here..." className="w-full h-full bg-transparent text-white outline-none resize-none placeholder:text-white/10" />
          )}
        </div>
      </div>
    </Panel>
  );

  const EditorPanel = (
    <Panel defaultSize={65} minSize={30}>
      <CodeEditor />
    </Panel>
  );

  const ResizeHandle = <Separator className={`bg-white/5 hover:bg-[#d0bcff]/50 transition-colors ${isVertical ? "h-1.5 w-full cursor-row-resize" : "w-1.5 h-full cursor-col-resize"}`} />;

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {isHistoryOpen && <HistorySidebar />}
      
      {/* Unconditional render so hidden state trick works for chat history */}
      <AiSidebar />  
      
      {isSettingsOpen ? (
        <div className="w-full h-full">
          <PlaygroundSettings />
        </div>
      ) : (
        <Group orientation={isVertical ? "vertical" : "horizontal"}>
          {isTerminalFirst ? (
            <>{TerminalPanel}{ResizeHandle}{EditorPanel}</>
          ) : (
            <>{EditorPanel}{ResizeHandle}{TerminalPanel}</>
          )}
        </Group>
      )}
    </div>
  );
}

export default function PlaygroundLayout() {
  return (
    <div className="w-full flex-1 flex flex-col bg-[#0f0d15] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
      <PlaygroundHeader />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-[#0a0a0f]"><Loader2 className="w-8 h-8 animate-spin text-[#d0bcff]" /></div>}>
        <PlaygroundContent />
      </Suspense>
    </div>
  );
}