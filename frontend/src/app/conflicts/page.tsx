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
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ConflictsPage() {
    const [conflicts, setConflicts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [resolvedIds, setResolvedIds] = React.useState<string[]>([]);
    const [notification, setNotification] = React.useState<{ message: string, type: 'success' | 'info' } | null>(null);

    React.useEffect(() => {
        const fetchConflicts = async () => {
            try {
                // 1. Get first project ID (Prototype logic)
                const pRes = await fetch("http://localhost:8000/api/v1/projects/");
                const projects = await pRes.json();

                if (projects && projects.length > 0) {
                    const projectId = projects[0].id;
                    // 2. Fetch conflicts for this project
                    const cRes = await fetch(`http://localhost:8000/api/v1/conflicts/project/${projectId}`);
                    const data = await cRes.json();
                    setConflicts(data);
                }
            } catch (err) {
                console.error("Error fetching conflicts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConflicts();
    }, []);

    const handleAction = async (id: string, action: string) => {
        try {
            const res = await fetch(`http://localhost:8000/api/v1/conflicts/${id}/resolve?action=${action}`, {
                method: "POST"
            });

            if (res.ok) {
                setResolvedIds(prev => [...prev, id]);

                const messages: Record<string, string> = {
                    apply: "Resolution applied! Requirements synchronized.",
                    deprecate: "Both requirements deprecated and moved to archive.",
                    ignore: "Conflict ignored. It will no longer appear in alerts."
                };

                setNotification({
                    message: messages[action] || "Action completed.",
                    type: action === 'apply' ? 'success' : 'info'
                });

                setTimeout(() => setNotification(null), 3000);
            }
        } catch (err) {
            console.error("Error resolving conflict:", err);
        }
    };

    const activeConflicts = conflicts.filter(c => !resolvedIds.includes(c.id));

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1400px] mx-auto animate-fade-in relative">
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={cn(
                            "fixed top-24 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 font-bold text-white",
                            notification.type === 'success' ? "bg-emerald-500" : "bg-slate-800"
                        )}
                    >
                        {notification.type === 'success' ? <ShieldCheck className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        <span>{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 lg:pt-0">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Conflict Engine</h2>
                    <p className="text-muted-foreground text-sm mt-1">AI detected contradictions between source documents.</p>
                </div>
                <div className="flex items-center space-x-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-full border border-amber-500/20 w-fit">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-xs md:text-sm font-bold">{activeConflicts.length === 0 ? "All Conflicts Resolved" : `${activeConflicts.length} Potential Conflicts Detected`}</span>
                </div>
            </div>

            {/* Conflict List */}
            <div className="space-y-12">
                {activeConflicts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center flex flex-col items-center justify-center space-y-4 bg-emerald-500/5 rounded-[40px] border-2 border-dashed border-emerald-500/20"
                    >
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                            <ShieldCheck className="text-white w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-emerald-900">Workspace Clear</h3>
                        <p className="text-sm text-emerald-700 max-w-xs">All detected contradictions have been resolved or archived.</p>
                    </motion.div>
                ) : (
                    activeConflicts.map((conflict) => (
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
                                    id={conflict.req_a?.id}
                                    text={conflict.req_a?.text}
                                    source={conflict.req_a?.source_ref}
                                    stakeholder={conflict.req_a?.stakeholder?.name || "Stakeholder"}
                                    timestamp={new Date(conflict.req_a?.created_at).toLocaleDateString()}
                                    type={conflict.conflict_type as any}
                                    isPrimary
                                />
                                <ConflictCard
                                    id={conflict.req_b?.id}
                                    text={conflict.req_b?.text}
                                    source={conflict.req_b?.source_ref}
                                    stakeholder={conflict.req_b?.stakeholder?.name || "Stakeholder"}
                                    timestamp={new Date(conflict.req_b?.created_at).toLocaleDateString()}
                                    type={conflict.conflict_type as any}
                                />
                            </div>

                            {/* AI Suggestion Panel */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-indigo-600/5 rounded-2xl border border-indigo-600/10 p-4 md:p-6 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="text-white w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h4 className="font-bold text-indigo-900 dark:text-indigo-400">AI Proposed Resolution</h4>
                                        <p className="text-sm text-indigo-700 dark:text-indigo-300/80 mt-1">{conflict.suggestion}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={() => handleAction(conflict.id, 'apply')}
                                            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs md:text-sm font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform"
                                        >
                                            <GitMerge className="w-4 h-4" />
                                            <span>Apply Resolution</span>
                                        </button>
                                        <button
                                            onClick={() => handleAction(conflict.id, 'deprecate')}
                                            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs md:text-sm font-bold hover:bg-slate-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Deprecate Both</span>
                                        </button>
                                        <button
                                            onClick={() => handleAction(conflict.id, 'ignore')}
                                            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs md:text-sm font-bold hover:bg-slate-50 transition-colors"
                                        >
                                            <EyeOff className="w-4 h-4" />
                                            <span>Ignore Conflict</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
