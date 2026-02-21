"use client";

import React from "react";
import { motion } from "framer-motion";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { TrendingUp, MessageSquare, Mail, MessageCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sentiment Analysis</h1>
                    <p className="text-muted-foreground mt-1">Real-time stakeholder alignment and emotional tracking across channels.</p>
                </div>
                <div className="flex items-center space-x-2 bg-card border rounded-full px-4 py-2 text-sm font-medium shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real-time Monitoring Active</span>
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
                                <div key={channel.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className={cn("p-2 rounded-lg", channel.bg)}>
                                            <channel.icon className={cn("w-4 h-4", channel.color)} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{channel.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{channel.status}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">{(channel.score * 10).toFixed(1)}/10</p>
                                        <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1">
                                            <div className={cn("h-full rounded-full", channel.score > 0.8 ? "bg-emerald-500" : "bg-primary")} style={{ width: `${channel.score * 100}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 text-rose-500" />
                            Hot Topics
                        </h3>
                        <div className="space-y-3">
                            {hotTopics.map((item) => (
                                <div key={item.topic} className="flex items-center justify-between">
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
