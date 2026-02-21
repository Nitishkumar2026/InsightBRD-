"use client";

import React, { useState } from "react";
import {
    Filter,
    Search,
    ArrowUpDown,
    MoreHorizontal,
    Link as LinkIcon,
    MessageSquare,
    Shield,
    Zap,
    Tag
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const mockRequirements = [
    {
        id: "REQ-01",
        text: "The system must support Single Sign-On (SSO) authentication for all enterprise users using OAuth2.",
        category: "Functional",
        priority: 9.5,
        sentiment: 0.8,
        source: "Project Charter.pdf",
        tags: ["Auth", "Security"]
    },
    {
        id: "REQ-02",
        text: "Average API response time must be under 200ms for 95th percentile of requests under peak load.",
        category: "Non-Functional",
        priority: 8.2,
        sentiment: 0.2,
        source: "Tech Spec",
        tags: ["Performance"]
    },
    {
        id: "REQ-03",
        text: "Requirement extraction pipeline needs to support parallel processing of multi-channel ingestion streams.",
        category: "Functional",
        priority: 7.8,
        sentiment: 0.5,
        source: "Slack (PM: Gupta)",
        tags: ["AI", "Core"]
    },
    {
        id: "REQ-04",
        text: "Database infrastructure must ensure 99.99% availability with multi-region failover support.",
        category: "Non-Functional",
        priority: 9.8,
        sentiment: -0.1,
        source: "CISO Requirements",
        tags: ["Infra", "Reliability"]
    }
];

export default function RequirementsPage() {
    const [search, setSearch] = useState("");

    const getPriorityColor = (score: number) => {
        if (score > 9) return "bg-rose-500";
        if (score > 7) return "bg-amber-500";
        return "bg-emerald-500";
    };

    return (
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Requirement Repository</h2>
                    <p className="text-muted-foreground mt-1">Foundational blocks extracted from your communication channels.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-card border rounded-xl hover:bg-slate-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-semibold">Filters</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        <Zap className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">Rescan All</span>
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search requirements, categories, or tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-card border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <button className="p-3 bg-card border rounded-2xl hover:bg-slate-50 transition-colors">
                    <ArrowUpDown className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4">
                {mockRequirements.map((req) => (
                    <motion.div
                        whileHover={{ x: 5 }}
                        key={req.id}
                        className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center space-x-3">
                                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">{req.id}</span>
                                    <div className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                        req.category === "Functional" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-purple-50 text-purple-600 border-purple-100"
                                    )}>
                                        {req.category}
                                    </div>
                                    {req.tags.map(tag => (
                                        <div key={tag} className="flex items-center space-x-1 text-muted-foreground">
                                            <Tag className="w-3 h-3" />
                                            <span className="text-[10px] font-medium">{tag}</span>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-lg font-medium leading-relaxed group-hover:text-primary transition-colors">
                                    {req.text}
                                </p>

                                <div className="flex items-center space-x-6 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full", getPriorityColor(req.priority))}
                                                style={{ width: `${req.priority * 10}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">Priority: {req.priority}</span>
                                    </div>

                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span className="font-medium">Source: {req.source}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end space-y-4">
                                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                                </button>
                                <div className="flex items-center space-x-1.5 text-xs">
                                    <Shield className={cn("w-3.5 h-3.5", req.sentiment > 0 ? "text-emerald-500" : "text-amber-500")} />
                                    <span className="font-bold underline cursor-help">Evidence Locked</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
