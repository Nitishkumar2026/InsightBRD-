"use client";

import React from "react";
import { motion } from "framer-motion";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { TrendingUp, MessageSquare, Mail, MessageCircle, AlertCircle, RefreshCw, Download, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

const channelStats = [
    { name: "Slack", score: 0.72, status: "Positive", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Gmail", score: 0.85, status: "Very Positive", icon: Mail, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Meeting Transcripts", score: 0.65, status: "Neutral", icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
];

const hotTopics = [
    { topic: "Cloud Architecture", sentiment: "Highly Positive", volume: "High" },
    { topic: "Budget Allocation", sentiment: "Neutral/Concerning", volume: "Medium" },
    { topic: "Timeline constraints", sentiment: "Negative", volume: "High" },
    { topic: "User Authentication", sentiment: "Positive", volume: "Low" },
];

export default function SentimentPage() {
    const [notification, setNotification] = React.useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setNotification("Recalculating global sentiment pulse...");
        setTimeout(() => {
            setIsRefreshing(false);
            setNotification(null);
        }, 2000);
    };

    const handleExport = () => {
        setNotification("Generating encrypted PDF sentiment report...");
        setTimeout(() => setNotification(null), 3000);
    };

    const handleChannelClick = (name: string) => {
        setNotification(`Accessing deep-dive analytics for ${name}...`);
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
                    <h1 className="text-3xl font-bold tracking-tight">Sentiment Analysis</h1>
                    <p className="text-muted-foreground mt-1">Real-time stakeholder alignment and emotional tracking across channels.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center space-x-2 px-4 py-2 bg-secondary rounded-xl text-xs font-bold hover:bg-secondary/80 transition-all border"
                    >
                        <RefreshCw className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
                        <span>Refresh Pulse</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:scale-[1.02] transition-all shadow-lg"
                    >
                        <Download className="w-3 h-3" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SentimentChart />
                </div>
                <div className="space-y-6">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                            Channel Health
                        </h3>
                        <div className="space-y-4">
                            {channelStats.map((channel) => (
                                <button
                                    key={channel.name}
                                    onClick={() => handleChannelClick(channel.name)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", channel.bg)}>
                                            <channel.icon className={cn("w-4 h-4", channel.color)} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold">{channel.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{channel.status}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">{(channel.score * 10).toFixed(1)}/10</p>
                                        <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${channel.score * 100}%` }}
                                                className={cn("h-full rounded-full", channel.score > 0.8 ? "bg-emerald-500" : "bg-primary")}
                                            />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 text-rose-500" />
                                Hot Topics
                            </h3>
                            <button className="text-[10px] font-black uppercase text-indigo-500 hover:underline">View Heatmap</button>
                        </div>
                        <div className="space-y-3">
                            {hotTopics.map((item) => (
                                <div key={item.topic} className="flex items-center justify-between p-1">
                                    <span className="text-sm font-medium">{item.topic}</span>
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                        item.sentiment.includes("Positive") ? "bg-emerald-500/10 text-emerald-500" :
                                            item.sentiment.includes("Negative") ? "bg-rose-500/10 text-rose-500" :
                                                "bg-amber-500/10 text-amber-500"
                                    )}>
                                        {item.sentiment}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
