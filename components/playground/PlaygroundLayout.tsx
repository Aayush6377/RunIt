"use client";
import React, { useState, useEffect } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import PlaygroundHeader from "./PlaygroundHeader";
import CodeEditor from "./CodeEditor";
import PlaygroundSettings from "./PlaygroundSettings";
import HistorySidebar from "./HistorySidebar";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";
import { Terminal, MessageSquare } from "lucide-react";
import AiSidebar from "./AiSidebar";

export default function PlaygroundLayout() {
  const [activeTab, setActiveTab] = useState<"output" | "input">("output");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { 
    output, userInput, setUserInput, isAiSidebarOpen,
    isSettingsOpen, isHistoryOpen, terminalPosition 
  } = usePlaygroundStore();

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return null;

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
    <div className="w-full flex-1 flex flex-col bg-[#0f0d15] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
      <PlaygroundHeader />
      
      <div className="flex-1 flex overflow-hidden relative">
        {isHistoryOpen && <HistorySidebar />}
        {isAiSidebarOpen && <AiSidebar/>  }
        
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
    </div>
  );
}