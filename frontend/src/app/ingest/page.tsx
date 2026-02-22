"use client";

import React, { useState } from "react";
import {
    Upload,
    File,
    CheckCircle,
    AlertCircle,
    Loader2,
    FileText,
    Inbox,
    ArrowRight,
    ShieldCheck,
    Zap,
    ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function IngestPage() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<{ requirements: number, conflicts: number } | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [connections, setConnections] = useState<{ slack: boolean, google: boolean }>({ slack: false, google: false });
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    React.useEffect(() => {
        // 1. Load persisted state from localStorage first
        const saved = localStorage.getItem("insightbrd_connections");
        let localConnections = saved ? JSON.parse(saved) : { slack: false, google: false };

        // 2. Check URL params for fresh redirect from OAuth
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("status") === "success") {
            const provider = urlParams.get("provider");
            setNotification(`${provider ? provider.toUpperCase() : 'Account'} successfully connected! Secure tunnel established.`);

            if (provider === "slack") {
                localConnections = { ...localConnections, slack: true };
            } else if (provider === "gmail" || provider === "google") {
                localConnections = { ...localConnections, google: true };
            }

            // Persist to localStorage
            localStorage.setItem("insightbrd_connections", JSON.stringify(localConnections));
            window.history.replaceState({}, document.title, window.location.pathname);
            setTimeout(() => setNotification(null), 5000);
        }

        // 3. Apply local state immediately so UI shows connected right away
        setConnections(localConnections);

        // 4. Fetch backend status and MERGE (don't overwrite) with local state
        fetch("http://localhost:8000/auth/status")
            .then(res => res.json())
            .then(backendData => {
                setConnections(prev => ({
                    slack: prev.slack || backendData.slack,
                    google: prev.google || backendData.google,
                }));
            })
            .catch(err => console.error("Error fetching connection status:", err));

        // 5. Fetch projects
        fetch("http://localhost:8000/api/v1/projects/")
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                if (data.length > 0) setSelectedProjectId(data[0].id);
            });
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus("idle");
        }
    };

    const handleConnect = (source: string) => {
        if (source === "Slack") {
            window.location.href = "http://localhost:8000/auth/slack/login";
        } else if (source === "Gmail") {
            window.location.href = "http://localhost:8000/auth/google/login";
        } else {
            setNotification(`Initiating secure handshake with ${source}...`);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleRealIngest = async (type: "gmail" | "slack") => {
        if (!selectedProjectId) {
            setNotification("Please create a project first!");
            return;
        }

        setStatus("processing");
        try {
            const config = type === "gmail" ? { query: "label:inbox" } : { channel_id: "general" };
            const res = await fetch(`http://localhost:8000/api/v1/ingest/${selectedProjectId}/channel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, config })
            });

            if (res.ok) {
                const data = await res.json();
                setResults({
                    requirements: data.requirements || 0,
                    conflicts: data.conflicts || 0
                });
                setStatus("complete");
                setNotification(`Successfully ingested real data from ${type.toUpperCase()}!`);
            } else {
                const error = await res.json();
                setNotification(`Error: ${error.detail || 'Failed to fetch data'}`);
                setStatus("error");
            }
        } catch (err) {
            console.error(err);
            setNotification("Network error during ingestion.");
            setStatus("error");
        }
    };

    const simulateIngestion = async () => {
        if (!file) return;

        setStatus("uploading");
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 20) {
            setProgress(i);
            await new Promise(r => setTimeout(r, 200));
        }

        setStatus("processing");
        // Simulate AI extraction delay
        await new Promise(r => setTimeout(r, 2000));

        setResults({
            requirements: Math.floor(Math.random() * 8) + 4,
            conflicts: Math.floor(Math.random() * 3)
        });
        setStatus("complete");
    };

    return (
        <div className="p-8 space-y-8 max-w-[1000px] mx-auto animate-fade-in relative">
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

            <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Multi-Channel Ingestion</h2>
                <p className="text-muted-foreground text-lg">Upload document, connect Gmail, or post meeting transcripts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center space-y-6 transition-all",
                            status === "idle" ? "bg-card border-slate-200 hover:border-primary/50 hover:bg-primary/5" :
                                status === "complete" ? "bg-emerald-500/5 border-emerald-500/30" : "bg-card border-slate-200 opacity-50 pointer-events-none"
                        )}
                    >
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Upload className="w-10 h-10 text-primary" />
                        </div>

                        <div className="text-center space-y-1">
                            <p className="text-xl font-bold">{file ? file.name : "Select or Drop File"}</p>
                            <p className="text-sm text-muted-foreground">PDF, DOCX, MD or TXT supported (Max 20MB)</p>
                        </div>

                        <input
                            type="file"
                            className="hidden"
                            id="file-upload"
                            onChange={handleFileChange}
                            accept=".pdf,.docx,.txt,.md"
                        />

                        <label
                            htmlFor="file-upload"
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-primary/25"
                        >
                            Choose File
                        </label>
                    </div>

                    <AnimatePresence>
                        {(status === "uploading" || status === "processing") && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                        <span className="font-bold">{status === "uploading" ? "Uploading Stream..." : "AI Requirement Extraction..."}</span>
                                    </div>
                                    <span className="text-sm font-mono text-muted-foreground">{status === "uploading" ? `${progress}%` : "Extracting Features"}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: status === "uploading" ? `${progress}%` : "90%" }}
                                        transition={{ ease: "easeInOut" }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {status === "complete" && results && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 space-y-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <CheckCircle className="text-white w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-emerald-900 dark:text-emerald-400">Processing Success</h4>
                                        <p className="text-emerald-700 dark:text-emerald-300/80">The document has been fully analyzed.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-emerald-200/50 flex flex-col center items-center justify-center shadow-inner">
                                        <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{results.requirements}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800/60 dark:text-emerald-400/60 mt-1">Requirements</span>
                                    </div>
                                    <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-emerald-200/50 flex flex-col center items-center justify-center shadow-inner">
                                        <span className="text-3xl font-bold text-rose-600 dark:text-rose-400">{results.conflicts}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-800/60 dark:text-rose-400/60 mt-1">Conflicts</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.location.href = "/"}
                                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-emerald-600/20 active:scale-95"
                                >
                                    <span>Go to Project Dashboard</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={simulateIngestion}
                        disabled={!file || status !== "idle"}
                        className="w-full py-5 bg-indigo-600 text-white border-2 border-indigo-400/20 rounded-2xl font-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-indigo-600/30 group uppercase tracking-wider"
                    >
                        <span className="text-lg">Start AI Processing</span>
                        <Zap className="w-6 h-6 fill-current text-yellow-300 group-hover:animate-pulse" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h5 className="font-bold flex items-center space-x-2 mb-4 text-indigo-600">
                            <Inbox className="w-5 h-5" />
                            <span>Direct Connect</span>
                        </h5>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleConnect("Gmail")}
                                    className={cn(
                                        "w-full p-3 rounded-xl border hover:bg-slate-50 text-left text-sm font-medium flex items-center justify-between group transition-all",
                                        connections.google && "border-emerald-500 bg-emerald-500/5"
                                    )}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>{connections.google ? "Gmail Connected" : "Connect Gmail"}</span>
                                        {connections.google && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                    </div>
                                    {!connections.google && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />}
                                </button>
                                {connections.google && (
                                    <button
                                        onClick={() => handleRealIngest("gmail")}
                                        className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                                    >
                                        Ingest Real Emails ✉️
                                    </button>
                                )}
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => handleConnect("Slack")}
                                    className={cn(
                                        "w-full p-3 rounded-xl border hover:bg-slate-50 text-left text-sm font-medium flex items-center justify-between group transition-all",
                                        connections.slack && "border-emerald-500 bg-emerald-500/5"
                                    )}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>{connections.slack ? "Slack Connected" : "Connect Slack channel"}</span>
                                        {connections.slack && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                    </div>
                                    {!connections.slack && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />}
                                </button>
                                {connections.slack && (
                                    <button
                                        onClick={() => handleRealIngest("slack")}
                                        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                                    >
                                        Ingest Slack Messages 💬
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => handleConnect("Meeting Transcript")}
                                className="w-full p-3 rounded-xl border hover:bg-slate-50 text-left text-sm font-medium flex items-center justify-between group transition-all"
                            >
                                <span>Meeting Transcript URL</span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-indigo-600/5 border border-indigo-600/10 rounded-2xl p-6">
                        <h5 className="font-bold mb-2 text-slate-900 dark:text-white">How it works</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Our AI pipeline scans your documents, extracts individual feature requirements, assigns priority scores based on stakeholder mention frequency, and builds a dependency map in our Neo4j graph database.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
