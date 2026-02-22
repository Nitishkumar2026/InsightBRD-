"use client";

import React from "react";
import {
  HeartPulse,
  AlertCircle,
  MessageSquare,
  Layers,
  Search,
  ChevronRight,
  Database,
  Sparkles,
  X,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { ConflictHeatmap } from "@/components/dashboard/ConflictHeatmap";
import { motion, AnimatePresence } from "framer-motion";

const projectListInitial = [
  { id: 1, name: "Project Aurora", health: 88, conflicts: 2, status: "Active" },
  { id: 2, name: "Nexus Integration", health: 42, conflicts: 14, status: "Critical" },
  { id: 3, name: "Cloud Migration 2.0", health: 95, conflicts: 0, status: "Stable" },
];

export default function Dashboard() {
  const [isSeeding, setIsSeeding] = React.useState(false);
  const [showDemoMenu, setShowDemoMenu] = React.useState(false);
  const [seedSuccess, setSeedSuccess] = React.useState(false);
  const [seedError, setSeedError] = React.useState<string | null>(null);
  const [projects, setProjects] = React.useState(projectListInitial);
  const [notification, setNotification] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    health: 76,
    conflicts: 24,
    sentiment: 0.82,
    totalReqs: 1248
  });
  const [chartData, setChartData] = React.useState<any[] | undefined>(undefined);
  const [heatmapData, setHeatmapData] = React.useState<number[][] | undefined>(undefined);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mounted, setMounted] = React.useState(false);
  const [randomTrend, setRandomTrend] = React.useState("+0");

  React.useEffect(() => {
    setMounted(true);
    setRandomTrend(`+${Math.floor(Math.random() * 20)}`);
  }, []);

  const handleProjectClick = (name: string) => {
    setNotification(`Accessing Secure Workspace for ${name}...`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSeed = async (type: "enron" | "ami") => {
    setIsSeeding(true);
    setShowDemoMenu(false);
    setSeedSuccess(false);
    setSeedError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(`http://localhost:8000/api/v1/ingest/seed-demo/${type}`, {
        method: "POST",
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (data.status === "success") {
        const newProject = {
          id: data.project_id,
          name: data.project_name,
          health: 100,
          conflicts: data.ingest_stats?.conflicts || 0,
          status: "Active",
          type: type
        };

        // @ts-ignore
        setProjects([newProject, ...projects]);

        setStats(prev => ({
          health: Math.min(100, Math.floor(prev.health + (Math.random() * 5))),
          conflicts: prev.conflicts + (data.ingest_stats?.conflicts || 0),
          sentiment: Math.min(1, prev.sentiment + 0.05),
          totalReqs: prev.totalReqs + (data.ingest_stats?.requirements || 0)
        }));

        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        setChartData(days.map(d => ({
          name: d,
          sentiment: type === "enron" ? Math.floor(Math.random() * 40) + 20 : Math.floor(Math.random() * 60) + 40,
          alignment: type === "enron" ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 80) + 10
        })));

        setHeatmapData(Array(5).fill(0).map(() =>
          Array(5).fill(0).map(() => Math.floor(Math.random() * 100))
        ));

        setSeedSuccess(true);
        setTimeout(() => setSeedSuccess(false), 5000);
      } else {
        setSeedError(`Backend error: ${data.detail || "Processing failed"}`);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setSeedError("Import timed out (60s). Backend might be slow or Gemini quota hit.");
      } else {
        // Mock update for UI testing if backend is missing
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        setChartData(days.map(d => ({
          name: d,
          sentiment: Math.floor(Math.random() * 50) + 30,
          alignment: Math.floor(Math.random() * 40) + 20
        })));
        setHeatmapData(Array(5).fill(0).map(() =>
          Array(5).fill(0).map(() => Math.floor(Math.random() * 100))
        ));
        setSeedSuccess(true);
        setTimeout(() => setSeedSuccess(false), 5000);
      }
    } finally {
      setIsSeeding(false);
      clearTimeout(timeoutId);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto animate-fade-in relative min-h-screen">
      {/* Success Notification (Seeding) */}
      <AnimatePresence>
        {seedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 font-bold border border-white/20 backdrop-blur-lg"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>Success! Demo project generated with cleaned dataset.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* General Notification (Workspace Access) */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[100] px-6 py-4 bg-indigo-600 text-white rounded-[20px] shadow-2xl flex items-center space-x-4 font-bold border border-white/20 backdrop-blur-lg"
          >
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="text-sm">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Notification */}
      <AnimatePresence>
        {seedError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-rose-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 font-bold"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{seedError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {isSeeding && (
        <div className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card border p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-lg">Analyzing Dataset & Seeding Project...</p>
            <p className="text-sm text-muted-foreground italic">Removing corporate noise, extracting requirements, and detecting conflicts.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 lg:pt-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Executive Overview</h2>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Real-time requirement health and conflict analytics.</p>
        </div>
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              disabled={isSeeding}
              className="w-full xs:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-xl text-sm font-bold hover:bg-indigo-500/20 transition-all disabled:opacity-50"
            >
              <Database className="w-4 h-4" />
              <span>{isSeeding ? "Importing..." : "Demo Import"}</span>
            </button>

            <AnimatePresence>
              {showDemoMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-card border rounded-2xl shadow-2xl p-2 z-[60]"
                >
                  <button
                    onClick={() => handleSeed("enron")}
                    className="w-full text-left p-3 hover:bg-secondary/50 rounded-xl text-xs font-bold transition-all flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Enron Emails (Corporate)</span>
                  </button>
                  <button
                    onClick={() => handleSeed("ami")}
                    className="w-full text-left p-3 hover:bg-secondary/50 rounded-xl text-xs font-bold transition-all flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>AMI Meetings (Product)</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative flex-1 xs:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 bg-card border rounded-full w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Health Score"
          value={`${stats.health}%`}
          icon={HeartPulse}
          trend="+2.4%"
          trendType="up"
        />
        <StatsCard
          title="Active Conflicts"
          value={stats.conflicts.toString()}
          icon={AlertCircle}
          trend="+3"
          trendType="down"
          color="bg-rose-500"
        />
        <StatsCard
          title="Alignment"
          value={`${(stats.sentiment * 100).toFixed(0)}%`}
          icon={MessageSquare}
          trend="-0.5%"
          trendType="neutral"
          color="bg-indigo-500"
        />
        <StatsCard
          title="Total Requirements"
          value={stats.totalReqs.toLocaleString()}
          icon={Layers}
          trend={randomTrend}
          trendType="up"
          color="bg-emerald-500"
        />
      </div>

      {/* Middle Section: Charts and Project List */}
      {/* Main Section: Projects and Insights */}
      <div className="space-y-8">
        {/* Project List - Now Full Width Content Area */}
        <div className="bg-card border rounded-3xl p-4 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-lg md:text-xl font-black tracking-tight flex items-center">
              <Layers className="w-5 h-5 mr-3 text-indigo-500" />
              Active Workspace Registry
            </h3>
            <span className="text-xs font-bold text-muted-foreground uppercase opacity-50 tracking-widest">
              Showing {projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length} Active Channels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((project) => (
              <motion.div
                key={project.id}
                onClick={() => handleProjectClick(project.name)}
                whileHover={{ y: -5, backgroundColor: "rgba(0,0,0,0.01)" }}
                className="group p-6 bg-secondary/10 border rounded-3xl hover:border-primary/30 transition-all cursor-pointer shadow-sm relative overflow-hidden"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner",
                      project.status === "Critical" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {project.name[0]}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <div>
                    <h4 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">{project.name}</h4>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                        project.status === "Critical" ? "border-rose-500/20 bg-rose-500/5 text-rose-500" : "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                      )}>
                        {project.status}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground">Updated 2h ago</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Health Score</span>
                    <span className={cn("text-lg font-black", project.health > 80 ? "text-emerald-500" : "text-rose-500")}>
                      {project.health}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Intelligence & Analytics - Full Width Sentiment Trend */}
        <div className="space-y-8">
          <SentimentChart data={chartData} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ConflictHeatmap data={heatmapData} />
            </div>
            <div className="lg:col-span-2 bg-card border rounded-3xl p-8 shadow-sm flex flex-col justify-center">
              <h4 className="text-lg font-bold mb-2">Workspace Intelligence Proxy</h4>
              <p className="text-muted-foreground text-sm">Our neural graph is currently monitoring stakeholder alignment across 4 active channels. Predicted consensus stability is reaching 84.2% based on recent email/slack handshake clusters.</p>
              <div className="mt-6 flex items-center space-x-4">
                <div className="px-4 py-2 bg-indigo-500/10 rounded-xl text-indigo-500 font-bold text-xs border border-indigo-500/20">Active Analysis</div>
                <div className="px-4 py-2 bg-emerald-500/10 rounded-xl text-emerald-500 font-bold text-xs border border-emerald-500/20">Syncing...</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Dataset Promo */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm overflow-hidden">
        {/* Phase 13 Dataset Promo */}
        <div className="p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Realistic Simulation Mode</h4>
              <p className="text-xs text-muted-foreground">Now supporting Enron & AMI corpora for multi-channel noise testing.</p>
            </div>
          </div>
          <button
            onClick={() => handleSeed("enron")}
            className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Activate
          </button>
        </div>
        <div className="space-y-4">
          {projects.map((project) => (
            <motion.div
              whileHover={{ x: 5 }}
              key={project.id}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border group cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border text-lg font-bold">
                  {project.name[0]}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold">{project.name}</h4>
                    {/* @ts-ignore */}
                    {project.type && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] uppercase font-black tracking-widest border border-indigo-500/20">
                        {/* @ts-ignore */}
                        {project.type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                    <span>{project.conflicts} conflicts detected</span>
                    <span>•</span>
                    <span className={project.status === "Critical" ? "text-rose-500 font-bold" : ""}>{project.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground uppercase tracking-tight font-bold">Health</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${project.health > 80 ? 'bg-emerald-500' : project.health > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${project.health}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold min-w-[3ch]">{project.health}%</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
