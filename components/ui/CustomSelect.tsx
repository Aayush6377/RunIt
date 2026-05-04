import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CustomSelect({ value, options, onChange, className = "" }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o: any) => o.value === value)?.label || value;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-black/40 border border-white/10 hover:border-white/20 rounded-lg p-2.5 text-sm text-white/90 outline-none transition-colors"
      >
        <span className="truncate capitalize">{selectedLabel}</span>
        <ChevronDown size={14} className={`text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-[#1e1b24] border border-white/10 rounded-lg shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-48 overflow-y-auto no-scrollbar">
            {options.map((opt: any) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-white/10 capitalize ${value === opt.value ? 'text-[#d0bcff] bg-[#d0bcff]/5' : 'text-white/80'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}