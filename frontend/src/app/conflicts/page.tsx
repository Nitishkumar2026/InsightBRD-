"use client";

import React from "react";
import {
    GitMerge,
    Trash2,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Zap
} from "lucide-react";
import { ConflictCard } from "@/components/conflicts/ConflictCard";
import { motion } from "framer-motion";

const conflicts = [
    {
        id: "CF-2401",
        type: "timeline",
        severity: 85,
        reqA: {
            id: "REQ-01",
            text: "System must be production-ready and deployed by the end of Q3 2026.",
            source: "Project Charter.pdf",
            stakeholder: "CEO (S. Gupta)",
            timestamp: "2026-02-15"
        },
        reqB: {
            id: "REQ-14",
            text: "Third-party security audit and certification will take 5 months, starting in August (Q3).",
            source: "Meeting Transcript",
            stakeholder: "CISO (M. Ross)",
            timestamp: "2026-02-18"
        },
        suggestion: "Adjust deployment date to mid-Q4 or fast-track audit with parallel certification tracks."
    }
];

export default function ConflictsPage() {
    return (
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Conflict Engine</h2>
                    <p className="text-muted-foreground mt-1">AI detected contradictions between source documents.</p>
                </div>
                <div className="flex items-center space-x-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-full border border-amber-500/20">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">12 Potential Conflicts Detected</span>
                </div>
            </div>

            {/* Conflict List */}
            <div className="space-y-12">
                {conflicts.map((conflict) => (
                    <div key={conflict.id} className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <span className="bg-slate-900 text-white px-3 py-1 rounded-md text-xs font-bold">Conflict {conflict.id}</span>
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                            <div className="flex items-center space-x-2 text-sm font-bold text-rose-500">
                                <span>Severity: {conflict.severity}%</span>
                                <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500" style={{ width: `${conflict.severity}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-xl">
                                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                            </div>

                            <ConflictCard
                                {...conflict.reqA}
                                type={conflict.type as any}
                                isPrimary
                            />
                            <ConflictCard
                                {...conflict.reqB}
                                type={conflict.type as any}
                            />
                        </div>

                        {/* AI Suggestion Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-indigo-600/5 rounded-2xl border border-indigo-600/10 p-6 flex items-start space-x-4"
                        >
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                                <ShieldCheck className="text-white w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h4 className="font-bold text-indigo-900 dark:text-indigo-400">AI Proposed Resolution</h4>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300/80 mt-1">{conflict.suggestion}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform">
                                        <GitMerge className="w-4 h-4" />
                                        <span>Apply Resolution</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                        <span>Deprecate Both</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors">
                                        <EyeOff className="w-4 h-4" />
                                        <span>Ignore Conflict</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
}
