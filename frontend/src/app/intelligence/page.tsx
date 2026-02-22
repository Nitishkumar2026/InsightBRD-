"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    Target,
    TrendingUp,
    AlertTriangle,
    ShieldCheck,
    History,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const stabilityData = [
    { day: "Mon", stability: 82, changes: 4 },
    { day: "Tue", stability: 85, changes: 2 },
    { day: "Wed", stability: 78, changes: 12 },
    { day: "Thu", stability: 72, changes: 8 },
    { day: "Fri", stability: 65, changes: 15 },
];

export default function IntelligencePage() {
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<string | null>(null);
    const [metrics, setMetrics] = useState({
        alignment: 78.4,
        stability: 65.2,
        risk: { score: 38.5, status: "Medium" }
    });

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleViewTimeline = () => {
        setNotification("Generating comprehensive project evolution report...");
        setTimeout(() => setNotification(null), 3000);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="space-y-4 text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-bold text-muted-foreground animate-pulse">Running Neural Inference...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in max-w-[1600px] mx-auto relative">
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-24 left-1/2 z-[100] px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center space-x-3 font-bold"
                    >
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span>{notification}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Intelligence Layer v2.0</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Project Risk & Alignment</h1>
                    <p className="text-muted-foreground mt-1">Predictive analysis of project health based on stakeholder interactions.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-xs font-bold text-rose-500 tracking-tight">System Alert: High Volatility Detected</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border-2 border-primary/10 rounded-3xl p-8 relative overflow-hidden group shadow-xl shadow-primary/5"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-bold text-muted-foreground uppercase">Alignment Score</span>
                            <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-5xl font-black text-primary tracking-tighter">{metrics.alignment}%</span>
                            <span className="text-xs font-bold text-emerald-500 flex items-center">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                +2.1%
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 leading-relaxed font-medium">
                            Consensus levels are stable. Minor friction detected between **Security** and **Dev Ops** regarding R42.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card border-2 border-amber-500/10 rounded-3xl p-8 relative overflow-hidden group shadow-xl shadow-amber-500/5"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-bold text-muted-foreground uppercase">Stability Index</span>
                            <Activity className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-5xl font-black text-amber-500 tracking-tighter">{metrics.stability}%</span>
                            <span className="text-xs font-bold text-rose-500 flex items-center">
                                <ArrowDownRight className="w-3 h-3 mr-1" />
                                -12.4%
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 leading-relaxed font-medium">
                            **Caution**: 15 revisions in last 48h indicate scope instability in the **Authentication Module**.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-950 border border-slate-800 rounded-3xl p-8 relative overflow-hidden text-white shadow-2xl shadow-slate-950/20"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                    <div className="relative flex flex-col h-full justify-between">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Risk Forecast</span>
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                            <div className="flex items-baseline space-x-2 mb-2">
                                <span className="text-6xl font-black text-white tracking-tighter">{metrics.risk.score}%</span>
                            </div>
                            <div className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-widest border border-rose-500/30">
                                {metrics.risk.status} Risk Level
                            </div>
                        </div>
                        <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-medium text-slate-400">Recommendation: Freeze Requirements for 7 days.</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold">Requirement Volatility</h3>
                            <p className="text-xs text-muted-foreground mt-1">Movement of Stability vs. Revision Frequency.</p>
                        </div>
                        <div className="flex items-center space-x-2 text-xs font-bold text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>Stability Chart</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stabilityData}>
                                <defs>
                                    <linearGradient id="colorStab" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={"var(--primary)"} stopOpacity={0.1} />
                                        <stop offset="95%" stopColor={"var(--primary)"} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={10} />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="stability" stroke={"var(--primary)"} strokeWidth={3} fillOpacity={1} fill="url(#colorStab)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border rounded-3xl p-8 shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                        <History className="w-5 h-5 mr-2 text-primary" />
                        Evolution Log
                    </h3>
                    <div className="flex-1 space-y-6">
                        {[
                            { time: "2h ago", user: "CTO", action: "Simplified", target: "Auth Workflow", color: "text-blue-500" },
                            { time: "5h ago", user: "PM", action: "Extended", target: "Reporting Engine", color: "text-emerald-500" },
                            { time: "1d ago", user: "AI", action: "Flagged", target: "Data Retention", color: "text-rose-500" },
                            { time: "2d ago", user: "Dev Lead", action: "Refined", target: "API Specs", color: "text-amber-500" },
                        ].map((log, i) => (
                            <div key={i} className="flex items-start space-x-4 border-l-2 border-secondary pl-4 py-1 relative">
                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-border" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">{log.time}</span>
                                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary", log.color)}>{log.action}</span>
                                    </div>
                                    <p className="text-xs font-bold">{log.target}</p>
                                    <p className="text-[10px] text-muted-foreground">Modified by {log.user}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleViewTimeline}
                        className="w-full mt-8 py-3 bg-secondary rounded-2xl text-xs font-bold hover:bg-secondary/80 transition-all flex items-center justify-center space-x-2"
                    >
                        <Clock className="w-4 h-4" />
                        <span>View Full Evolution Timeline</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
