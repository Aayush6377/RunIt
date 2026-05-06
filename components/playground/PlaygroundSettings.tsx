"use client";
import { useEffect, useState } from "react";
import { usePlaygroundStore, GLOT_LANGUAGES } from "@/store/usePlaygroundStore";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Users, Trash2, LogOut, Settings as SettingsIcon, 
  Globe, Lock, ShieldAlert, Monitor, Code2, UserMinus, Crown
} from "lucide-react";
import { useRouter } from "next/navigation"; 
import { toast } from "sonner";
import ConfirmModal from "../ui/ConfirmModal"; 
import { CustomSelect } from "../ui/CustomSelect";

const THEME_OPTIONS = [
  { value: "runit-midnight", label: "Midnight Purple" },
  { value: "runit-dark", label: "RunIt Dark" },
  { value: "runit-oled", label: "OLED Black" },
  { value: "vs-dark", label: "VS Dark (Standard)" },
  { value: "vs", label: "VS Light" }, 
  { value: "hc-black", label: "High Contrast Dark" },
  { value: "hc-light", label: "High Contrast Light" },
];

const TERMINAL_OPTIONS = [
  { value: "right", label: "Right Sidebar" },
  { value: "bottom", label: "Bottom Panel" },
  { value: "left", label: "Left Sidebar" },
];

export default function PlaygroundSettings() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { 
    theme, setTheme, vimMode, setVimMode, terminalPosition, setTerminalPosition,
    autoSave, setAutoSave, selectedLanguage, setLanguage,
    visibility, setVisibility, snippetId, resetPlayground
  } = usePlaygroundStore();

  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [owner, setOwner] = useState<any>(null);
  const [userRole, setUserRole] = useState<"OWNER" | "CO_OWNER" | "EDITOR" | "VIEWER" | "NONE">("NONE");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteRole, setInviteRole] = useState("EDITOR");
  const [inviteInput, setInviteInput] = useState("");

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const updateGlobalPreference = async (key: string, value: any, setter: Function) => {
    setter(value); 

    if (isAuthenticated) {
      try {
        const formData = new FormData();
        formData.append(key, String(value));
        await fetch("/api/user/profile", {
          method: "PATCH",
          body: formData,
        });
      } catch (error) {
        console.error("Failed to sync preference", error);
      }
    }
  };

  // Fetch live snippet data (Collaborators, Owner, Role)
  useEffect(() => {
    if (!isAuthenticated || !snippetId) return;

    const fetchSnippetData = async () => {
      setIsLoadingData(true);
      try {
        const res = await fetch(`/api/snippets/${snippetId}`);
        const data = await res.json();
        
        if (data.success) {
          setOwner(data.data.owner); 
          setCollaborators(data.data.collaborators || []);
          setVisibility(data.data.visibility);
          
          if (data.data.ownerId === user?.id) {
            setUserRole("OWNER");
          } else {
            const collab = data.data.collaborators?.find((c: any) => c.userId === user?.id);
            setUserRole(collab ? collab.role : "NONE");
          }
        }
      } catch {
        toast.error("Failed to load snippet settings");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSnippetData();
  }, [snippetId, isAuthenticated, user?.id]);

  // Handlers
  const handleVisibilityChange = async (newVis: string) => {
    if (!snippetId) return setVisibility(newVis);
    
    toast.loading("Updating visibility...", { id: "vis" });
    try {
      const res = await fetch(`/api/snippets/${snippetId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ visibility: newVis })
      });
      const data = await res.json();
      if (data.success) {
        setVisibility(newVis);
        toast.success(data.message, { id: "vis" });
      } else {
        toast.error(data.message, { id: "vis" });
      }
    } catch {
      toast.error("Network error", { id: "vis" });
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snippetId) return toast.warning("Save snippet first!");
    
    setIsInviting(true);
    try {
      const res = await fetch(`/api/invitations/send`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: inviteInput, role: inviteRole, snippetId })
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success("Invitation sent successfully!");
        setInviteInput("");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to send invite");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveCollaborator = async (collabId: string) => {
    try {
      const res = await fetch(`/api/collaborations/${collabId}`, { method: "DELETE" });
      if (res.ok) {
        setCollaborators(collaborators.filter(c => c.id !== collabId));
        toast.success("Collaborator removed");
      }
    } catch {
      toast.error("Failed to remove collaborator");
    }
  };

  const handleLeaveSnippet = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/snippets/${snippetId}/leave`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Left snippet successfully");
        setLeaveModalOpen(false);
        resetPlayground();
        router.push('/playground'); 
      }
    } catch {
      toast.error("Failed to leave snippet");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSnippet = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/snippets/${snippetId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Snippet deleted forever");
        setDeleteModalOpen(false);
        resetPlayground();
        router.push('/playground'); 
      }
    } catch {
      toast.error("Failed to delete snippet");
    } finally {
      setActionLoading(false);
    }
  };

  // Roles Logic
  const isOwnerOrCoOwner = userRole === "OWNER" || userRole === "CO_OWNER";
  const canLeave = userRole !== "NONE" && snippetId;

  return (
    <>
      <ConfirmModal 
        isOpen={leaveModalOpen} 
        onClose={() => setLeaveModalOpen(false)}
        onConfirm={handleLeaveSnippet}
        isLoading={actionLoading}
        title="Leave Snippet?"
        message={userRole === "OWNER" 
          ? "You are the owner. Leaving will transfer ownership to a Co-Owner. If there are no Co-Owners, the snippet will be permanently deleted. Proceed?" 
          : "Are you sure you want to leave this snippet? You will lose access to it."}
        type="warning"
        confirmText="Yes, Leave"
      />

      <ConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteSnippet}
        isLoading={actionLoading}
        title="Delete Snippet?"
        message="This action cannot be undone. This snippet and all its history will be permanently wiped from the servers."
        type="danger"
        confirmText="Delete Forever"
      />

      <div className="w-full h-full bg-[#110e15] p-6 overflow-y-auto text-white no-scrollbar">
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
          
          {/* Global Editor Preferences (Visible to Everyone) */}
          <section>
            <h3 className="text-[#d0bcff]/80 font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
              <SettingsIcon size={14} /> Local Editor Preferences
            </h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 grid gap-4 sm:grid-cols-2 shadow-lg">
              
              <div className="space-y-1.5 relative">
                <label className="text-xs text-white/50">Theme</label>
                <CustomSelect 
                  value={theme} 
                  options={THEME_OPTIONS} 
                  onChange={(val: string) => updateGlobalPreference("theme", val, setTheme)} 
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-xs text-white/50">Terminal Position</label>
                <CustomSelect 
                  value={terminalPosition} 
                  options={TERMINAL_OPTIONS} 
                  onChange={(val: string) => updateGlobalPreference("terminalPosition", val, setTerminalPosition)} 
                />
              </div>

              <div className="flex items-center justify-between bg-black/20 border border-white/5 rounded-lg p-3 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-md"><Monitor size={16} className="text-[#d0bcff]" /></div>
                  <div>
                    <p className="text-sm font-medium text-white/90">Vim Keybindings</p>
                    <p className="text-xs text-white/40">Use classic Vim commands in the editor</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateGlobalPreference("vimMode", !vimMode, setVimMode)} 
                  className={`w-11 h-6 rounded-full transition-colors relative ${vimMode ? 'bg-[#d0bcff]' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${vimMode ? 'translate-x-5 shadow-sm' : ''}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Account Defaults (Logged In Only) */}
          {isAuthenticated && (
            <section>
              <h3 className="text-[#d0bcff]/80 font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                <Code2 size={14} /> Account Defaults
              </h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 grid gap-4 sm:grid-cols-2 shadow-lg">
                <div className="space-y-1.5 relative">
                  <label className="text-xs text-white/50">Default Language</label>
                  <CustomSelect 
                    value={selectedLanguage} 
                    options={GLOT_LANGUAGES.map(l => ({ value: l.id, label: l.label }))} 
                    onChange={(val: string) => updateGlobalPreference("defaultLanguage", val.toUpperCase(), setLanguage)} 
                  />
                </div>

                <div className="flex items-center justify-between bg-black/20 border border-white/5 rounded-lg p-3 mt-1.5">
                  <div>
                    <p className="text-sm font-medium text-white/90">Auto Save</p>
                    <p className="text-[10px] text-white/40">Save automatically while typing</p>
                  </div>
                  <button 
                    onClick={() => updateGlobalPreference("autoSave", !autoSave, setAutoSave)} 
                    className={`w-11 h-6 rounded-full transition-colors relative ${autoSave ? 'bg-[#27c93f]' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${autoSave ? 'translate-x-5 shadow-sm' : ''}`} />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Access & Visibility (Snippet Context - Owner/CoOwner Only) */}
          {isAuthenticated && snippetId && isOwnerOrCoOwner && (
            <section>
              <h3 className="text-[#d0bcff]/80 font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                <Globe size={14} /> Access & Visibility
              </h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-1.5 flex gap-1 shadow-lg">
                {(["PRIVATE", "UNLISTED", "PUBLIC"] as const).map((vis) => (
                  <button 
                    key={vis}
                    onClick={() => handleVisibilityChange(vis)} 
                    className={`flex-1 p-2.5 rounded-lg text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all ${
                      visibility === vis 
                        ? 'bg-[#d0bcff] text-[#23005c] shadow-md' 
                        : 'text-white/40 hover:bg-white/5 hover:text-white/80'
                    }`}
                  >
                    {vis === 'PRIVATE' ? <Lock size={14} /> : <Globe size={14} />} 
                    {vis}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Collaboration Team (Snippet Context - Logged In Members Only) */}
          {isAuthenticated && snippetId && userRole !== "NONE" && (
            <section>
              <h3 className="text-[#d0bcff]/80 font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                <Users size={14} /> Collaboration Team
              </h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-visible shadow-lg">
                
                {/* Invite Form - Owner/CoOwner Only */}
                {isOwnerOrCoOwner && (
                  <form onSubmit={handleInvite} className="p-4 flex flex-col sm:flex-row gap-2 border-b border-white/5 bg-black/20">
                    <input 
                      value={inviteInput}
                      onChange={(e) => setInviteInput(e.target.value)}
                      placeholder="Username or email..." 
                      className="w-full sm:flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d0bcff]/50 transition-colors" 
                      required 
                    />
                    <div className="flex gap-2 w-full sm:w-auto">
                      <div className="flex-1 sm:w-32 relative">
                        <CustomSelect 
                          value={inviteRole}
                          onChange={setInviteRole}
                          options={[
                            { value: "EDITOR", label: "Editor" },
                            { value: "VIEWER", label: "Viewer" },
                            ...(userRole === "OWNER" ? [{ value: "CO_OWNER", label: "Co-Owner" }] : [])
                          ]}
                        />
                      </div>
                      <button type="submit" disabled={isInviting} className="bg-[#d0bcff] hover:bg-[#b59cfc] text-[#23005c] px-4 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 whitespace-nowrap">
                        {isInviting ? "..." : "Invite"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Team List (Visible to all members) */}
                <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto no-scrollbar">
                  {isLoadingData ? (
                    <div className="p-4 text-center text-xs text-white/30">Loading team...</div>
                  ) : (
                    <>
                      {/* Owner Row */}
                      {owner && (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <img src={owner.image || `https://api.dicebear.com/7.x/initials/svg?seed=${owner.name}`} className="w-8 h-8 rounded-full border border-white/10 shrink-0" alt="avatar" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white/90 truncate">{owner.name} {owner.id === user?.id && "(You)"}</p>
                              <p className="text-[10px] text-white/40 truncate">@{owner.username}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#ffbd2e]/10 text-[#ffbd2e] text-[10px] font-bold uppercase tracking-wider border border-[#ffbd2e]/20 shrink-0">
                            <Crown size={12} /> <span className="hidden sm:inline">Owner</span>
                          </div>
                        </div>
                      )}

                      {/* Collaborators Rows */}
                      {collaborators.map((collab) => (
                        <div key={collab.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group">
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <img src={collab.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${collab.user.name}`} className="w-8 h-8 rounded-full border border-white/10 shrink-0" alt="avatar" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white/90 truncate">{collab.user.name} {collab.user.id === user?.id && "(You)"}</p>
                              <p className="text-[10px] text-white/40 truncate">@{collab.user.username}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{collab.role.replace("_", " ")}</span>
                            {isOwnerOrCoOwner && collab.user.id !== user?.id && (
                              <button onClick={() => handleRemoveCollaborator(collab.id)} className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all opacity-100 sm:opacity-0 group-hover:opacity-100 shrink-0">
                                <UserMinus size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Danger Zone */}
          {canLeave && (
            <section>
              <h3 className="text-red-400/80 font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                <ShieldAlert size={14} /> Danger Zone
              </h3>
              <div className="bg-red-500/[0.02] border border-red-500/10 rounded-xl p-4 flex flex-col sm:flex-row gap-3 shadow-lg">
                 <button 
                   onClick={() => setLeaveModalOpen(true)}
                   className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-colors border border-white/10 text-xs font-bold"
                 >
                   <LogOut size={14} /> Leave Snippet
                 </button>
                 
                 {isOwnerOrCoOwner && (
                   <button 
                     onClick={() => setDeleteModalOpen(true)}
                     className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors border border-red-500/20 text-xs font-bold"
                   >
                     <Trash2 size={14} /> Delete Snippet
                   </button>
                 )}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}