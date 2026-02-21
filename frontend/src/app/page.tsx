"use client";

import React from "react";
import {
  HeartPulse,
  AlertCircle,
  MessageSquare,
  Layers,
  Search,
  ChevronRight
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { ConflictHeatmap } from "@/components/dashboard/ConflictHeatmap";
import { motion } from "framer-motion";

const projectList = [
  { id: 1, name: "Project Aurora", health: 88, conflicts: 2, status: "Active" },
  { id: 2, name: "Nexus Integration", health: 42, conflicts: 14, status: "Critical" },
  { id: 3, name: "Cloud Migrastion 2.0", health: 95, conflicts: 0, status: "Stable" },
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Executive Overview</h2>
          <p className="text-muted-foreground mt-1">Real-time requirement health and conflict analytics.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 bg-card border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Health Score"
          value="76%"
          icon={HeartPulse}
          trend="+5.2%"
          trendType="up"
          color="bg-emerald-500"
        />
        <StatsCard
          title="Active Conflicts"
          value="24"
          icon={AlertCircle}
          trend="+8"
          trendType="down"
          color="bg-rose-500"
        />
        <StatsCard
          title="Avg Sentiment"
          value="0.82"
          icon={MessageSquare}
          trend="+0.1"
          trendType="up"
          color="bg-indigo-500"
        />
        <StatsCard
          title="Total Requirements"
          value="1,248"
          icon={Layers}
          trend="+124"
          trendType="up"
          color="bg-slate-700"
        />
      </div>

      {/* Middle Section: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SentimentChart />
        </div>
        <div className="lg:col-span-1">
          <ConflictHeatmap />
        </div>
      </div>

      {/* Bottom Section: Project List */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Priority Projects</h3>
          <button className="text-primary text-sm font-semibold hover:underline">View all</button>
        </div>

        <div className="space-y-4">
          {projectList.map((project) => (
            <motion.div
              whileHover={{ x: 5 }}
              key={project.id}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 group cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border text-lg font-bold">
                  {project.name[0]}
                </div>
                <div>
                  <h4 className="font-bold">{project.name}</h4>
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
                    <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
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
