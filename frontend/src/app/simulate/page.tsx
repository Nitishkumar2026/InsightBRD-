"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dna,
    Play,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    TrendingDown,
    TrendingUp,
    Zap,
    Split,
    MessageSquareShare,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockRequirements = [
    { id: "1", text: "Implement SSO Authentication", category: "Security" },
    { id: "2", text: "Subscription Payment Gateway", category: "Functional" },
    { id: "3", text: "Real-time Dashboard Updates", category: "Performance" },
];

export default function SimulatePage() {
    const [selectedReq, setSelectedReq] = useState(mockRequirements[0]);
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [delayWeeks, setDelayWeeks] = useState(4);
    const [notification, setNotification] = useState<string | null>(null);

    const runSimulation = () => {
        setSimulationRunning(true);
        setResult(null);
        setNotification("Calibrating Neural Impact Graph...");

        // Simulate API call delay
        setTimeout(() => {
            const riskValue = 10 + (delayWeeks * 2) + Math.random() * 5;
            setResult({
                affectedCount: Math.floor(delayWeeks / 2) + 2,
                riskDelta: `+${riskValue.toFixed(1)}%`,
                sentimentDelta: `-${(delayWeeks * 0.1).toFixed(1)}`,
                rippleEffect: [
                    "User Profile Data Access",
                    "Session Management timeout",
                    "Mobile App Login Flow",
                    "Third-party Auth Connectors"
                ],
                negotiationProposal: delayWeeks > 6
                    ? "Critical Risk: Delay exceeds safety margins. Recommend immediate scope reduction."
                    : "Phase the rollout: Start with internal users in July, then external in September."
            });
            setSimulationRunning(false);
            setNotification(null);
        }, 1500);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in relative">
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

            <div>
                <div className="flex items-center space-x-2 mb-2">
                    <Dna className="w-5 h-5 text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">What-if Simulator</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Impact Simulation Engine</h1>
                <p className="text-muted-foreground mt-1">Predict the ripple effect of requirement shifts across your project graph.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="space-y-6">
                    <div className="bg-card border rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-bold">1. Select Requirement</h3>
                        <div className="space-y-3">
                            {mockRequirements.map((req) => (
                                <button
                                    key={req.id}
                                    onClick={() => setSelectedReq(req)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl text-left transition-all border-2",
                                        selectedReq.id === req.id
                                            ? "border-primary bg-primary/5 shadow-md"
                                            : "border-transparent bg-secondary/30 hover:bg-secondary/50"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold">{req.text}</span>
                                        <span className="text-[10px] font-black uppercase text-muted-foreground px-2 py-1 bg-background rounded-md">{req.category}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4 pt-4">
                            <h3 className="text-lg font-bold">2. Proposed Change</h3>
                            <div className="p-4 bg-secondary/30 rounded-2xl border border-dashed border-primary/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-muted-foreground uppercase">Parameter</span>
                                    <span className="text-xs font-bold text-primary uppercase">Delay Timeline</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="12"
                                    value={delayWeeks}
                                    onChange={(e) => setDelayWeeks(parseInt(e.target.value))}
                                    className="w-full accent-primary"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-[10px] font-bold">Current: On Track</span>
                                    <span className="text-[10px] font-bold text-rose-500">+{delayWeeks} Weeks Delay</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={runSimulation}
                            disabled={simulationRunning}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center space-x-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                        >
                            {simulationRunning ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Play className="w-4 h-4 fill-white" />
                                    <span>Execute Neural Simulation</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Output Panel */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {!result && !simulationRunning && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full bg-secondary/20 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4"
                            >
                                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
                                    <Zap className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium text-muted-foreground max-w-xs">Enter simulation parameters and run inference to see predicted ripples.</p>
                            </motion.div>
                        )}

                        {simulationRunning && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full bg-card border rounded-3xl p-8 flex flex-col items-center justify-center space-y-6"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 border-8 border-primary/10 border-t-primary rounded-full animate-spin" />
                                    <Dna className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="font-black text-xl tracking-tighter animate-pulse">Analyzing Dependency Graph...</p>
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Weighting Stakeholder Sensitivity</p>
                                </div>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full bg-card border-2 border-primary/20 rounded-3xl p-8 space-y-8 flex flex-col shadow-2xl shadow-primary/5"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-rose-500 uppercase">Risk Increase</span>
                                            <TrendingUp className="w-4 h-4 text-rose-500" />
                                        </div>
                                        <p className="text-3xl font-black text-rose-600 tracking-tighter">{result.riskDelta}</p>
                                    </div>
                                    <div className="p-6 bg-secondary/50 border border-border rounded-2xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Sentiment Shift</span>
                                            <TrendingDown className="w-4 h-4 text-rose-400" />
                                        </div>
                                        <p className="text-3xl font-black text-foreground tracking-tighter">{result.sentimentDelta}</p>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <h4 className="text-sm font-bold flex items-center">
                                        <Split className="w-4 h-4 mr-2 text-primary" />
                                        Impacted Dependency Chain
                                    </h4>
                                    <div className="space-y-3">
                                        {result.rippleEffect.map((item: string, i: number) => (
                                            <div key={i} className="flex items-center space-x-3 text-xs font-semibold p-3 bg-secondary/30 rounded-xl">
                                                <ArrowRight className="w-3 h-3 text-primary" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <MessageSquareShare className="w-12 h-12 text-indigo-500" />
                                    </div>
                                    <h4 className="text-xs font-black uppercase text-indigo-500 mb-2">AI-Driven Compromise Proposal</h4>
                                    <p className="text-xs font-bold leading-relaxed italic">"{result.negotiationProposal}"</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
