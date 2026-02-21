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
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function IngestPage() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<{ requirements: number, conflicts: number } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus("idle");
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
        <div className="p-8 space-y-8 max-w-[1000px] mx-auto animate-fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold tracking-tight">Multi-Channel Ingestion</h2>
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
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-100 flex flex-col center items-center justify-center">
                                        <span className="text-3xl font-bold">{results.requirements}</span>
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Requirements</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-100 flex flex-col center items-center justify-center">
                                        <span className="text-3xl font-bold">{results.conflicts}</span>
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Conflicts</span>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2">
                                    <span>Go to Project Dashboard</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={simulateIngestion}
                        disabled={!file || status !== "idle"}
                        className="w-full py-4 bg-slate-950 text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 shadow-xl"
                    >
                        <span>Start AI Processing</span>
                        <Zap className="w-5 h-5 fill-current" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h5 className="font-bold flex items-center space-x-2 mb-4 text-indigo-600">
                            <Inbox className="w-5 h-5" />
                            <span>Direct Connect</span>
                        </h5>
                        <div className="space-y-3">
                            <button className="w-full p-3 rounded-xl border hover:bg-slate-50 text-left text-sm font-medium flex items-center justify-between group transition-all">
                                <span>Connect Gmail</span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                            </button>
                            <button className="w-full p-3 rounded-xl border hover:bg-slate-50 text-left text-sm font-medium flex items-center justify-between group transition-all">
                                <span>Connect Slack channel</span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                            </button>
                            <button className="w-full p-3 rounded-xl border hover:bg-slate-50 text-left text-sm font-medium flex items-center justify-between group transition-all">
                                <span>Meeting Transcript URL</span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-indigo-600/5 border border-indigo-600/10 rounded-2xl p-6">
                        <h5 className="font-bold mb-2">How it works</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Our AI pipeline scans your documents, extracts individual feature requirements, assigns priority scores based on stakeholder mention frequency, and builds a dependency map in our Neo4j graph database.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Missing Lucide components added for the prompt
import { Zap, ChevronRight } from "lucide-react";
