"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendType?: "up" | "down" | "neutral";
    color?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendType = "neutral", color = "bg-primary" }: StatsCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-card border rounded-2xl p-6 shadow-sm flex items-start justify-between relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />

            <div className="space-y-4 relative">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold">{value}</span>
                        {trend && (
                            <span className={cn(
                                "text-xs font-semibold px-2 py-0.5 rounded-full",
                                trendType === "up" ? "bg-emerald-500/10 text-emerald-500" :
                                    trendType === "down" ? "bg-rose-500/10 text-rose-500" :
                                        "bg-slate-500/10 text-slate-500"
                            )}>
                                {trend}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
