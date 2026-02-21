"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Mon", sentiment: 40, alignment: 24 },
    { name: "Tue", sentiment: 30, alignment: 13 },
    { name: "Wed", sentiment: 20, alignment: 98 },
    { name: "Thu", sentiment: 27, alignment: 39 },
    { name: "Fri", sentiment: 18, alignment: 48 },
    { name: "Sat", sentiment: 23, alignment: 38 },
    { name: "Sun", sentiment: 34, alignment: 43 },
];

export function SentimentChart() {
    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm h-[400px]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold">Stakeholder Sentiment Trend</h3>
                    <p className="text-sm text-muted-foreground">Aggregated analysis from Slack and Gmail</p>
                </div>
                <div className="flex items-center space-x-4 text-sm font-medium">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                        <span>Sentiment</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-purple-400" />
                        <span>Alignment</span>
                    </div>
                </div>
            </div>

            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorAlignment" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="sentiment"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorSentiment)"
                        />
                        <Area
                            type="monotone"
                            dataKey="alignment"
                            stroke="#a855f7"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAlignment)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
