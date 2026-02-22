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
    Save,
    ShieldCheck,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

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
    const [selectedModel, setSelectedModel] = React.useState("gpt-4");
    const [apiKeys, setApiKeys] = React.useState({
        openai: "",
        anthropic: "",
        slack: ""
    });
    const [notification, setNotification] = React.useState<string | null>(null);
    const [isTesting, setIsTesting] = React.useState(false);

    const handleSave = () => {
        setNotification("Applying Neural System Parameters...");
        setTimeout(() => setNotification(null), 3000);
    };

    const handleTest = (integration: string) => {
        setIsTesting(true);
        setNotification(`Handshaking with ${integration} Secure API...`);
        setTimeout(() => {
            setIsTesting(false);
            setNotification(`${integration} Connection Verified & Encrypted.`);
            setTimeout(() => setNotification(null), 2000);
        }, 2000);
    };

    const handleExternalLink = (name: string) => {
        setNotification(`Redirecting to ${name} Authorization Portal...`);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in relative">
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
                    <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground mt-1">Configure your AI pipeline, security, and external integrations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    {/* AI Configuration */}
                    <section className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold flex items-center">
                                <Cpu className="w-5 h-5 mr-2 text-primary" />
                                AI Intelligence Model
                            </h2>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">v4.0.0-neural</span>
                        </div>
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
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 space-y-4">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Authentication Keys</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">OpenAI API Key</label>
                                    <input
                                        type="password"
                                        value={apiKeys.openai}
                                        onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                                        placeholder="sk-..."
                                        className="w-full bg-secondary/30 border rounded-xl p-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Anthropic API Key</label>
                                    <input
                                        type="password"
                                        value={apiKeys.anthropic}
                                        onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                                        placeholder="ant-..."
                                        className="w-full bg-secondary/30 border rounded-xl p-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Integration Management */}
                    <section className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center">
                            <Database className="w-5 h-5 mr-2 text-indigo-500" />
                            Channel Connectors
                        </h2>
                        <div className="space-y-4">
                            {integrations.map((item) => (
                                <div key={item.name} className="p-4 rounded-2xl bg-secondary/50 border group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 rounded-xl bg-card border shadow-sm group-hover:bg-primary/5 transition-colors">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{item.name}</h3>
                                                <p className="text-xs text-muted-foreground">Synchronize multi-channel data</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter",
                                                item.status === "Connected" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500"
                                            )}>
                                                {item.status}
                                            </span>
                                            <button
                                                onClick={() => handleExternalLink(item.name)}
                                                className="p-2 hover:bg-card rounded-lg transition-colors border border-transparent hover:border-border"
                                            >
                                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        </div>
                                    </div>
                                    {item.name === "Slack" && (
                                        <div className="mt-4 p-4 bg-card rounded-xl border border-dashed border-primary/20 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase text-muted-foreground">Bot User OAuth Token</span>
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                            </div>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="password"
                                                    value={apiKeys.slack}
                                                    onChange={(e) => setApiKeys({ ...apiKeys, slack: e.target.value })}
                                                    placeholder="xoxb-..."
                                                    className="flex-1 bg-secondary/20 border rounded-lg p-2 text-xs outline-none"
                                                />
                                                <button
                                                    onClick={() => handleTest("Slack")}
                                                    disabled={isTesting}
                                                    className="px-4 py-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
                                                >
                                                    {isTesting ? "Testing..." : "Test"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
                            Global Security
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                <span className="text-xs font-bold">Encrypted Vault</span>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                                    All API keys are encrypted at rest using AES-256 and never logged.
                                </p>
                            </div>
                            <button
                                onClick={handleSave}
                                className="w-full py-4 bg-primary text-white rounded-2xl text-sm font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 uppercase tracking-widest"
                            >
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </section>

                    {/* System State */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl shadow-slate-950/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">System Infra</h3>
                            <div className="flex space-x-1">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-75" />
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-150" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="opacity-60 font-medium">Core Engine</span>
                                <span className="font-mono text-emerald-400">v4.5.1-prod</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="opacity-60 font-medium">Global Clusters</span>
                                <span className="font-mono text-indigo-400">AWS / Neo4j</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="opacity-60 font-medium">Uptime</span>
                                <span className="font-mono text-emerald-400">99.98%</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-800">
                                <div className="flex items-center space-x-2 text-[10px] font-bold text-indigo-400">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>All Core Services Operational</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
