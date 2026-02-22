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
    Tag,
    ArrowRight,
    Database,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [requirements, setRequirements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchRequirements = async () => {
            try {
                // In a real app, we'd use the project ID from the context or URL
                const response = await fetch("http://localhost:8000/api/v1/requirements/");
                const data = await response.json();
                if (Array.isArray(data)) {
                    setRequirements(data);
                } else {
                    console.error("API did not return an array:", data);
                    setRequirements([]); // Fallback to empty if not an array
                }
            } catch (error) {
                console.error("Failed to fetch requirements:", error);
                // Fallback to mock for demo stability if API fails
                setRequirements(mockRequirements);
            } finally {
                setLoading(false);
            }
        };
        fetchRequirements();
    }, []);

    const filteredRequirements = Array.isArray(requirements) ? requirements.filter(req => {
        const matchesSearch = (req.text || "").toLowerCase().includes(search.toLowerCase()) ||
            (req.id && req.id.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = selectedCategory === "All" || req.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }) : [];

    const [isSeeding, setIsSeeding] = useState(false);
    const [seedSuccess, setSeedSuccess] = useState(false);

    const handleSeed = async (type: "enron" | "ami") => {
        setIsSeeding(true);
        try {
            const response = await fetch(`http://localhost:8000/api/v1/ingest/seed-demo/${type}`, {
                method: "POST"
            });
            const data = await response.json();
            if (data.status === "success") {
                setSeedSuccess(true);
                // Refresh data
                const refreshResponse = await fetch("http://localhost:8000/api/v1/requirements/");
                const refreshData = await refreshResponse.json();
                if (Array.isArray(refreshData)) setRequirements(refreshData);
                setTimeout(() => setSeedSuccess(false), 5000);
            }
        } catch (error) {
            console.error("Seeding failed:", error);
        } finally {
            setIsSeeding(false);
        }
    };

    const getPriorityColor = (score: number) => {
        if (score > 9) return "bg-rose-500";
        if (score > 7) return "bg-amber-500";
        return "bg-emerald-500";
    };

    const categories = ["All", "Functional", "Non-Functional", "Constraint"];

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1400px] mx-auto animate-fade-in relative">
            {/* Success Notification */}
            <AnimatePresence>
                {seedSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 font-bold"
                    >
                        <Sparkles className="w-5 h-5" />
                        <span>Success! Requirements generated.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading Overlay */}
            {isSeeding && (
                <div className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-card border p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="font-bold text-lg text-foreground">Extracting Requirements...</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-4 lg:pt-0">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Requirement Repository</h2>
                    <p className="text-muted-foreground text-sm mt-1">Foundational blocks extracted from your communication channels.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex bg-card border rounded-xl p-1 overflow-x-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all whitespace-nowrap",
                                    selectedCategory === cat ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary text-muted-foreground"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => handleSeed("enron")}
                        disabled={isSeeding}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50 h-fit"
                    >
                        <Zap className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">{isSeeding ? "Syncing..." : "Rescan All"}</span>
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search requirements..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                    />
                </div>
                <button className="hidden sm:block p-2.5 bg-card border rounded-2xl hover:bg-slate-50 transition-colors">
                    <ArrowUpDown className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-medium text-muted-foreground">Loading requirements...</p>
                    </div>
                ) : filteredRequirements.length === 0 ? (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 px-6 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/20 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800"
                        >
                            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-8 relative">
                                <Database className="w-12 h-12 text-indigo-500" />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-indigo-400 rounded-full"
                                />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-3">Repository is Empty</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 text-lg leading-relaxed">
                                No requirements found. You can either import a demo dataset or upload your own project documentation.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={() => handleSeed("ami")}
                                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center space-x-3 shadow-xl shadow-indigo-600/20 active:scale-95 group"
                                >
                                    <Sparkles className="w-5 h-5 fill-current text-yellow-300" />
                                    <span>Seed Demo Project</span>
                                </button>
                                <button
                                    onClick={() => window.location.href = "/ingest"}
                                    className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-black hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
                                >
                                    <span>Ingest Documents</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Quick Add Form Section (User Requested "Inputs") */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border-2 border-indigo-500/10 rounded-[32px] p-10 shadow-xl shadow-indigo-500/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Zap className="w-32 h-32 text-indigo-500" />
                            </div>
                            <div className="relative space-y-8">
                                <div className="flex items-center space-x-3">
                                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                    <h3 className="tracking-tight text-xl font-black text-slate-800 dark:text-slate-200">Draft New Requirement</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Requirement Statement</label>
                                        <input
                                            type="text"
                                            id="new-req-text"
                                            placeholder="The system must support..."
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-5 font-bold text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Classification</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            <select
                                                id="new-req-cat"
                                                className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-5 font-bold text-slate-700 dark:text-slate-300 focus:border-indigo-500 outline-none transition-all"
                                            >
                                                <option value="Functional">Functional</option>
                                                <option value="Non-Functional">Non-Functional</option>
                                                <option value="Constraint">Constraint</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const textInput = document.getElementById('new-req-text') as HTMLInputElement;
                                        const catInput = document.getElementById('new-req-cat') as HTMLSelectElement;
                                        if (textInput?.value) {
                                            const newReq = {
                                                id: `REQ-${Math.floor(Math.random() * 9000) + 1000}`,
                                                text: textInput.value,
                                                category: catInput.value,
                                                priority_score: 5.0,
                                                status: 'draft',
                                                tags: ['Manual'],
                                                source_type: 'Manual Entry'
                                            };
                                            setRequirements(prev => [newReq, ...prev]);
                                            textInput.value = '';
                                            setSeedSuccess(true);
                                            setTimeout(() => setSeedSuccess(false), 3000);
                                        }
                                    }}
                                    className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-lg hover:scale-[1.01] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center space-x-3 group"
                                >
                                    <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    <span>Register Requirement</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    filteredRequirements.map((req) => (
                        <motion.div
                            whileHover={{ x: 5 }}
                            key={req.id}
                            className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">{req.id || 'REQ-XX'}</span>
                                        <div className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                            req.category === "Functional" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-purple-50 text-purple-600 border-purple-100"
                                        )}>
                                            {req.category || 'Extracting...'}
                                        </div>
                                        {req.tags && req.tags.map((tag: string) => (
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
                                                    className={cn("h-full rounded-full", getPriorityColor(req.priority_score || 5))}
                                                    style={{ width: `${(req.priority_score || 5) * 10}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">Priority: {req.priority_score?.toFixed(1) || '5.0'}</span>
                                        </div>

                                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span className="font-medium">Source: {req.source_type || 'Manual'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end space-y-4">
                                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                    <div className="flex items-center space-x-1.5 text-xs">
                                        <Shield className={cn("w-3.5 h-3.5", (req.sentiment_score || 0) >= 0 ? "text-emerald-500" : "text-rose-500")} />
                                        <span className="font-bold underline cursor-help">Evidence Locked</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
