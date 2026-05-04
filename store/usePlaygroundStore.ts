import { create } from "zustand";
import { persist } from "zustand/middleware";

export const GLOT_LANGUAGES = [
  { id: "python", label: "Python", extension: "py", defaultCode: 'print("welcome to RunIt")' },
  { id: "javascript", label: "JavaScript", extension: "js", defaultCode: 'console.log("welcome to RunIt");' },
  { id: "typescript", label: "TypeScript", extension: "ts", defaultCode: 'console.log("welcome to RunIt");' },
  { id: "java", label: "Java", extension: "java", defaultCode: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("welcome to RunIt");\n\t}\n}' },
  { id: "cpp", label: "C++", extension: "cpp", defaultCode: '#include <iostream>\n\nint main() {\n\tstd::cout << "welcome to RunIt" << std::endl;\n\treturn 0;\n}' },
  { id: "c", label: "C", extension: "c", defaultCode: '#include <stdio.h>\n\nint main() {\n\tprintf("welcome to RunIt\\n");\n\treturn 0;\n}' },
  { id: "rust", label: "Rust", extension: "rs", defaultCode: 'fn main() {\n\tprintln!("welcome to RunIt");\n}' },
  { id: "go", label: "Go", extension: "go", defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("welcome to RunIt")\n}' },
];

interface PlaygroundState {
  snippetId: string | null;
  selectedLanguage: string;
  fileName: string;
  code: string;
  userInput: string;
  output: string;
  isExecuting: boolean;
  
  theme: string;
  vimMode: boolean;
  autoSave: boolean;
  isAiSidebarOpen: boolean;
  isSettingsOpen: boolean;
  isHistoryOpen: boolean; 
  visibility: string;
  terminalPosition: "right" | "left" | "bottom";

  setSnippetId: (id: string | null) => void;
  setLanguage: (langId: string) => void;
  setAutoSave: (val: boolean) => void;
  setFileName: (name: string) => void;
  setCode: (code: string) => void;
  setUserInput: (input: string) => void;
  setOutput: (output: string) => void;
  setIsExecuting: (val: boolean) => void;
  setTheme: (theme: string) => void;
  setVimMode: (enabled: boolean) => void;
  setIsAiSidebarOpen: (isOpen: boolean) => void;
  setIsSettingsOpen: (isOpen: boolean) => void;
  setIsHistoryOpen: (isOpen: boolean) => void;
  setVisibility: (vis: string) => void;
  setTerminalPosition: (pos: "right" | "left" | "bottom") => void;
  resetPlayground: () => void;
}

export const usePlaygroundStore = create<PlaygroundState>()(
  persist(
    (set, get) => ({
      snippetId: null,
      selectedLanguage: "python",
      fileName: "main",
      code: 'print("welcome to RunIt")',
      userInput: "",
      output: "",
      isExecuting: false,
      
      theme: "runit-midnight",
      vimMode: false,
      autoSave: true,
      isAiSidebarOpen: false,
      isSettingsOpen: false,
      isHistoryOpen: false,
      visibility: "PRIVATE",
      terminalPosition: "right",

      setSnippetId: (id) => set({ snippetId: id }),
      setLanguage: (langId) => {
        langId = langId.toLowerCase();
        const lang = GLOT_LANGUAGES.find((l) => l.id === langId);
        const name = langId === "java" ? "Main" : "main";
        set({ selectedLanguage: langId, code: lang?.defaultCode || "", fileName: name });
      },
      setAutoSave: (val) => set({ autoSave: val }),
      setFileName: (fileName) => set({ fileName }),
      setCode: (code) => set({ code }),
      setUserInput: (userInput) => set({ userInput }),
      setOutput: (output) => set({ output }),
      setIsExecuting: (isExecuting) => set({ isExecuting }),
      setTheme: (theme) => set({ theme }),
      setVimMode: (vimMode) => set({ vimMode }),
      setIsAiSidebarOpen: (isOpen) => set({ isAiSidebarOpen: isOpen, isHistoryOpen: false, isSettingsOpen: false }),
      setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen, isHistoryOpen: false, isAiSidebarOpen: false }),
      setIsHistoryOpen: (isOpen) => set({ isHistoryOpen: isOpen, isSettingsOpen: false, isAiSidebarOpen: false }),
      setVisibility: (vis) => set({ visibility: vis }),
      setTerminalPosition: (pos) => set({ terminalPosition: pos }),
      resetPlayground: () => {
        const { selectedLanguage } = get();
        const defaultLang = GLOT_LANGUAGES.find((l) => l.id === selectedLanguage) || GLOT_LANGUAGES[0];
        set({
          snippetId: null,
          fileName: selectedLanguage === "java" ? "Main" : "main",
          code: defaultLang.defaultCode,
          userInput: "",
          output: "",
          visibility: "PRIVATE",
          isHistoryOpen: false,
          isSettingsOpen: false,
        });
      }
    }),
    {
      name: "runit-playground-storage",
      partialize: (state) => ({ 
        snippetId: state.snippetId, 
        code: state.code, 
        selectedLanguage: state.selectedLanguage,
        fileName: state.fileName,
        theme: state.theme,
        vimMode: state.vimMode,
        terminalPosition: state.terminalPosition
      }),
    }
  )
);