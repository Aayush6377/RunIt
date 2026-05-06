"use client";
import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, Code2, Check, ArrowDownToLine, MessageSquarePlus } from "lucide-react";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AiSidebar() {
  const { isAiSidebarOpen, setIsAiSidebarOpen, code, setCode, selectedLanguage, output, snippetId } = usePlaygroundStore();
  const { user } = useAuthStore();
  
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: `Hi! I'm RunIt AI. I see you're writing in ${selectedLanguage.toUpperCase()}. How can I help?` }
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const prevLang = useRef(selectedLanguage);
  const prevUserId = useRef(user?.id);
  const prevSnippetId = useRef(snippetId);

  useEffect(() => {
    const isLanguageChange = prevLang.current !== selectedLanguage;
    const isUserChange = prevUserId.current !== user?.id;
    
    const isProjectSwitch = prevSnippetId.current !== null && prevSnippetId.current !== snippetId;

    if (isLanguageChange || isUserChange || isProjectSwitch) {
      setMessages([{ role: "ai", content: `Hi! I'm RunIt AI. I see you're writing in ${selectedLanguage.toUpperCase()}. How can I help?` }]);
    }

    prevLang.current = selectedLanguage;
    prevUserId.current = user?.id;
    prevSnippetId.current = snippetId;
  }, [selectedLanguage, user?.id, snippetId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading, isAiSidebarOpen]);

  const handleNewChat = () => {
    setMessages([{ role: "ai", content: `Hi! I'm RunIt AI. I see you're writing in ${selectedLanguage.toUpperCase()}. How can I help?` }]);
    toast.success("Started a new chat!");
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userPrompt = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userPrompt }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt, code, language: selectedLanguage, output })
      });
      const data = await res.json();

      if (data.success) {
        setMessages(prev => [...prev, { role: "ai", content: data.data }]);
      } else {
        toast.error("AI encountered an error.");
      }
    } catch {
      toast.error("Failed to connect to AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCode = (newCode: string) => {
    setCode(newCode);
    toast.success("Code replaced successfully!", { icon: <Check className="text-green-500" /> });
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const match = part.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
        const codeString = match ? match[1].trim() : part.replace(/```/g, "").trim();

        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-white/10 bg-[#0a0a0f] shadow-lg">
            <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <Code2 className="text-[#d0bcff]/70" size={12}/>
                <span className="text-[10px] font-mono text-white/50 uppercase">Suggested Code</span>
              </div>
              <button 
                onClick={() => handleApplyCode(codeString)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-[#d0bcff] hover:text-white bg-[#d0bcff]/10 hover:bg-[#d0bcff]/20 px-2 py-1 rounded transition-colors"
              >
                <ArrowDownToLine size={12}/> Replace
              </button>
            </div>
            <div className="p-3 overflow-x-auto text-[11px] font-mono text-white/80 whitespace-pre">
              {codeString}
            </div>
          </div>
        );
      }
      return (
        <p key={index} className="text-sm leading-relaxed whitespace-pre-wrap mb-1">
          {part}
        </p>
      );
    });
  };

  return (
    <div className={`w-[340px] h-full bg-[#110e15] border-r border-white/5 flex flex-col flex-shrink-0 shadow-2xl relative z-20 ${!isAiSidebarOpen ? 'hidden' : ''}`}>
      
      {/* Sidebar Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02] shrink-0">
        <h3 className="font-semibold text-white/90 flex items-center gap-1.5 text-xs">
          <Sparkles className="text-[#d0bcff]" size={14}/> 
          RunIt AI
        </h3>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={handleNewChat} 
            className="text-white/40 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5"
            title="New Chat"
          >
            <MessageSquarePlus size={15}/>
          </button>
          <button 
            onClick={() => setIsAiSidebarOpen(false)} 
            className="text-white/40 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5"
            title="Close Sidebar"
          >
            <X size={16}/>
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            
            <div className={`flex items-center gap-2 mb-1.5 px-1 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.role === "ai" ? (
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#23005c] to-[#d0bcff] flex items-center justify-center shadow-md shrink-0">
                  <Bot className="text-white" size={12}/>
                </div>
              ) : (
                user?.image ? (
                  <img src={user.image} alt="User" className="w-6 h-6 rounded-full border border-white/10 shrink-0 object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/5 shrink-0">
                    <User className="text-white/70" size={12}/>
                  </div>
                )
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                {msg.role === "ai" ? "RunIt Assistant" : "You"}
              </span>
            </div>
            
            <div 
              className={`max-w-[92%] p-3.5 shadow-sm ${
                msg.role === "user" 
                  ? "bg-[#d0bcff]/10 text-[#d0bcff] rounded-2xl rounded-tr-sm border border-[#d0bcff]/20" 
                  : "bg-white/[0.04] text-white/90 rounded-2xl rounded-tl-sm border border-white/5"
              }`}
            >
              {renderMessageContent(msg.content)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start">
             <div className="flex items-center gap-2 mb-1.5 px-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#23005c] to-[#d0bcff] flex items-center justify-center shadow-md animate-pulse shrink-0">
                  <Bot className="text-white" size={12}/>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Thinking...</span>
             </div>
             <div className="bg-white/[0.04] border border-white/5 rounded-2xl rounded-tl-sm p-4 flex gap-1.5 items-center max-w-[100px]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0bcff]/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0bcff]/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0bcff]/50 animate-bounce" style={{ animationDelay: "300ms" }} />
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#110e15] border-t border-white/5 shrink-0 z-10">
        <form onSubmit={handleSend} className="relative flex items-end bg-[#0a0a0f] border border-white/10 rounded-2xl focus-within:border-[#d0bcff]/50 transition-all duration-300 p-1.5 shadow-inner">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder="Ask AI to debug, explain, or write..."
            className="w-full bg-transparent text-sm text-white/90 outline-none resize-none max-h-32 min-h-[40px] py-2 px-3 no-scrollbar"
            rows={1}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="m-0.5 w-8 h-8 flex items-center justify-center bg-[#d0bcff] text-[#23005c] rounded-xl disabled:opacity-50 hover:bg-[#b59cfc] transition-colors shrink-0 shadow-md"
          >
            <Send className="ml-0.5" size={14}/>
          </button>
        </form>
        <p className="text-[9px] text-center text-white/30 mt-3 font-medium">
          AI can make mistakes. Please review code before replacing.
        </p>
      </div>
    </div>
  );
}