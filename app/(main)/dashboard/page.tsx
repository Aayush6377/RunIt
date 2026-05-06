"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { FolderCode, Users, GitCommit, Mail, ArrowRight, Activity, PieChart as PieChartIcon, Code2 } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from "recharts";

const LANG_COLORS: Record<string, string> = {
  JAVASCRIPT: "#f7df1e",
  TYPESCRIPT: "#3178c6",
  PYTHON: "#3776ab",
  JAVA: "#b07219",
  CPP: "#00599C",
  C: "#555555",
  RUST: "#dea584",
  GO: "#00add8",
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(resData => {
        if (resData.success) setData(resData.data);
        else toast.error("Failed to load dashboard data");
      })
      .catch(() => toast.error("An error occurred"))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

  const { stats, languageData, activityData, recentSnippets } = data;

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8 sm:py-12 px-4 sm:px-6 relative z-20 min-h-screen">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Welcome back, <span className="text-[#d0bcff]">{user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-white/40 text-sm mt-2">Here is what's happening in your workspace today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Snippets", value: stats.totalSnippets, icon: FolderCode, color: "text-[#d0bcff]", bg: "bg-[#d0bcff]/10", border: "border-[#d0bcff]/20" },
          { label: "Collaborations", value: stats.collaborations, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
          { label: "Total Commits", value: stats.totalRevisions, icon: GitCommit, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
          { label: "Pending Invites", value: stats.pendingInvites, icon: Mail, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
        ].map((stat, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-[#0a0a0f]/95 border border-white/10 rounded-[24px] p-6 flex items-center gap-4 backdrop-blur-3xl shadow-xl"
          >
            <div className={`p-4 rounded-2xl border ${stat.bg} ${stat.border}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Charts & Lists */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Activity Chart & Recent */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Activity Chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0a0a0f]/95 border border-white/10 rounded-[24px] p-6 shadow-xl backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={18} className="text-[#d0bcff]" />
              <h2 className="text-lg font-bold text-white">Activity Overview (14 Days)</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d0bcff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d0bcff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#110e15', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#d0bcff' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#d0bcff" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Snippets */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0a0a0f]/95 border border-white/10 rounded-[24px] p-6 shadow-xl backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FolderCode size={18} className="text-[#d0bcff]" />
                <h2 className="text-lg font-bold text-white">Recent Snippets</h2>
              </div>
              <Link href="/snippets" className="text-sm text-[#d0bcff] hover:text-white transition-colors flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            
            {recentSnippets.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-sm">No snippets created yet.</div>
            ) : (
              <div className="space-y-3">
                {recentSnippets.map((snippet: any) => (
                  <Link href={`/playground/${snippet.id}`} key={snippet.id} className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#d0bcff]/10 rounded-xl"><Code2 size={16} className="text-[#d0bcff]" /></div>
                      <div>
                        <h3 className="text-white font-semibold text-sm group-hover:text-[#d0bcff] transition-colors">{snippet.title}</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">{snippet.language} • {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(snippet.updatedAt))}</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Language Chart & Actions */}
        <div className="space-y-8">
          
          {/* Language Breakdown */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#0a0a0f]/95 border border-white/10 rounded-[24px] p-6 shadow-xl backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon size={18} className="text-[#d0bcff]" />
              <h2 className="text-lg font-bold text-white">Top Languages</h2>
            </div>
            
            {languageData.length === 0 ? (
              <div className="text-center py-12 text-white/40 text-sm">Create snippets to see data.</div>
            ) : (
              <>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip contentStyle={{ backgroundColor: '#110e15', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }} />
                      <Pie data={languageData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {languageData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={LANG_COLORS[entry.name] || '#d0bcff'} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {languageData.slice(0, 4).map((lang: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LANG_COLORS[lang.name] || '#d0bcff' }} />
                      <span className="truncate">{lang.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#0a0a0f]/95 border border-white/10 rounded-[24px] p-6 shadow-xl backdrop-blur-3xl">
             <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
             <div className="space-y-3">
               <Link href="/playground" className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#d0bcff] hover:bg-[#b59cfc] text-[#23005c] rounded-xl font-bold transition-all active:scale-95">
                 New Snippet
               </Link>
               <Link href="/invitations" className="flex items-center justify-center gap-2 w-full py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all active:scale-95">
                 Check Inbox
               </Link>
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}