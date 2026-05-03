"use client";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";
import { Users, Trash2, LogOut, Settings as SettingsIcon, Globe, Lock, ShieldAlert } from "lucide-react";

export default function PlaygroundSettings() {
  const { theme, setTheme, vimMode, setVimMode, visibility, setVisibility, snippetId } = usePlaygroundStore();

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    if (!snippetId) return alert("Save snippet first!");
    
    await fetch("/api/invitations/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, snippetId })
    });
    alert("Invite sent!");
    e.currentTarget.reset();
  };

  return (
    <div className="w-full h-full bg-[#050505] p-6 overflow-y-auto text-white">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Editor Preferences */}
        <section>
          <h3 className="text-[#d0bcff] font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2"><SettingsIcon size={16} /> Editor Preferences</h3>
          <div className="bg-[#0f0d15] border border-white/10 rounded-xl p-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-white/50 mb-2">Theme</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-[#d0bcff]">
                <option value="vs-dark">VS Dark</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3">
              <div>
                <p className="text-sm">Vim Mode</p>
                <p className="text-xs text-white/40">Enable Vim keybindings</p>
              </div>
              <button onClick={() => setVimMode(!vimMode)} className={`w-10 h-6 rounded-full transition-colors relative ${vimMode ? 'bg-[#d0bcff]' : 'bg-white/20'}`}>
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${vimMode ? 'translate-x-4 bg-[#23005c]' : ''}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Access & Visibility */}
        <section>
          <h3 className="text-[#d0bcff] font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2"><Globe size={16} /> Access & Visibility</h3>
          <div className="bg-[#0f0d15] border border-white/10 rounded-xl p-4">
             <div className="flex gap-4">
                <button onClick={() => setVisibility("PRIVATE")} className={`flex-1 p-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${visibility === 'PRIVATE' ? 'bg-[#d0bcff]/10 border-[#d0bcff] text-[#d0bcff]' : 'border-white/10 text-white/50 hover:bg-white/5'}`}>
                  <Lock size={16} /> Private
                </button>
                <button onClick={() => setVisibility("UNLISTED")} className={`flex-1 p-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${visibility === 'UNLISTED' ? 'bg-[#d0bcff]/10 border-[#d0bcff] text-[#d0bcff]' : 'border-white/10 text-white/50 hover:bg-white/5'}`}>
                  <Globe size={16} /> Unlisted
                </button>
             </div>
          </div>
        </section>

        {/* Collaboration */}
        <section>
          <h3 className="text-[#d0bcff] font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2"><Users size={16} /> Collaboration</h3>
          <div className="bg-[#0f0d15] border border-white/10 rounded-xl p-4 space-y-4">
            <form onSubmit={handleInvite} className="flex gap-2">
              <input name="email" type="email" placeholder="Email or Username to invite..." className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-[#d0bcff]" required />
              <button type="submit" className="bg-[#d0bcff] text-[#23005c] px-4 rounded-lg text-sm font-bold">Invite</button>
            </form>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 mb-2">Current Collaborators</p>
              {/* Map actual collaborators here from API */}
              <div className="text-sm text-white/80 italic">No collaborators yet.</div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h3 className="text-red-400 font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2"><ShieldAlert size={16} /> Danger Zone</h3>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
             <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 text-sm font-bold">
               <LogOut size={16} /> Leave Snippet
             </button>
             <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20 text-sm font-bold">
               <Trash2 size={16} /> Delete Snippet
             </button>
          </div>
        </section>

      </div>
    </div>
  );
}