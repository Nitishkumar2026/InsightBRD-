"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Shield,
    Database,
    Cpu,
    Slack,
    Mail,
    Github,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Save
} from "lucide-react";
import { cn } from "@/lib/utils";

const integrations = [
    { name: "Slack", status: "Connected", icon: Slack, lastSync: "2 mins ago" },
    { name: "Gmail", status: "Connected", icon: Mail, lastSync: "1 hour ago" },
    { name: "GitHub", status: "Disconnected", icon: Github, lastSync: "Never" },
];

const models = [
    { id: "gpt-4", name: "GPT-4o", provider: "OpenAI", speed: "Medium", quality: "Best" },
    { id: "claude-3", name: "Claude 3.5 Sonnet", provider: "Anthropic", speed: "Fast", quality: "High" },
    { id: "llama-3", name: "Llama 3 (Local)", provider: "Ollama", speed: "Variable", quality: "Balanced" },
];

export default function SettingsPage() {
    const [selectedModel, setSelectedModel] = React.useState("claude-3");

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground mt-1">Configure your AI pipeline, security, and external integrations.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    {/* AI Configuration */}
                    <section className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center">
                            <Cpu className="w-5 h-5 mr-2 text-primary" />
                            AI Intelligence Model
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {models.map((model) => (
                                <div
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id)}
                                    className={cn(
                                        "p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02]",
                                        selectedModel === model.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/20"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold">{model.name}</span>
                                        {selectedModel === model.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{model.provider}</p>
                                    <div className="mt-4 flex items-center justify-between text-[10px] font-medium">
                                        <span className="text-muted-foreground">Quality: {model.quality}</span>
                                        <span className="text-muted-foreground">Speed: {model.speed}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Integration Management */}
                    <section className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center">
                            <Database className="w-5 h-5 mr-2 text-indigo-500" />
                            Channel Integrations
                        </h2>
                        <div className="space-y-4">
                            {integrations.map((item) => (
                                <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border group">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-xl bg-card border shadow-sm group-hover:scale-110 transition-transform">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{item.name}</h3>
                                            <p className="text-xs text-muted-foreground">Last sync: {item.lastSync}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter",
                                            item.status === "Connected" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500"
                                        )}>
                                            {item.status}
                                        </span>
                                        <button className="text-muted-foreground hover:text-primary transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    {/* Security & Access */}
                    <section className="bg-card border rounded-2xl p-6 shadow-sm ring-1 ring-primary/10">
                        <h2 className="text-lg font-bold mb-6 flex items-center text-primary">
                            <Shield className="w-5 h-5 mr-2" />
                            Security Policy
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                                <span className="text-xs font-bold">Encrypted Storage</span>
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Access Key (Masked)</p>
                                <code className="text-xs block p-2 bg-card rounded border truncate text-muted-foreground">
                                    sk-ant-api03-Lhk...7jK2
                                </code>
                            </div>
                            <button className="w-full py-3 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                                <Save className="w-4 h-4" />
                                <span>Save Configuration</span>
                            </button>
                        </div>
                    </section>

                    {/* System Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl shadow-slate-950/50">
                        <h3 className="text-sm font-bold mb-4 opacity-50 uppercase tracking-widest">System Architecture</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="opacity-60">Engine Version</span>
                                <span className="font-mono text-emerald-400">v4.2.1-prod</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="opacity-60">Knowledge Graph</span>
                                <span className="font-mono text-indigo-400">Neo4j Cluster 5.0</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-800">
                                <div className="flex items-center space-x-2 text-[10px] font-bold text-rose-500">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>3 Security Patches Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
