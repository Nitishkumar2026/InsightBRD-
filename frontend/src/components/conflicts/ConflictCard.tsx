"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, User, ExternalLink, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConflictCardProps {
    id: string;
    text: string;
    source: string;
    stakeholder: string;
    timestamp: string;
    type: "timeline" | "logic" | "scope";
    isPrimary?: boolean;
}

export function ConflictCard({ id, text, source, stakeholder, timestamp, type, isPrimary }: ConflictCardProps) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={cn(
                "p-6 rounded-2xl border bg-card shadow-sm space-y-4 relative overflow-hidden group transition-all",
                isPrimary ? "border-primary/20 bg-primary/5" : "border-slate-200"
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        type === "timeline" ? "bg-amber-500" : type === "logic" ? "bg-rose-500" : "bg-blue-500"
                    )} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{type} Conflict</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">ID: {id}</span>
            </div>

            <p className="text-sm font-medium leading-relaxed">"{text}"</p>

            <div className="pt-4 border-t flex flex-wrap gap-4">
                <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                    <User className="w-3.5 h-3.5" />
                    <span>{stakeholder}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                    <Inbox className="w-3.5 h-3.5" />
                    <span>{source}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timestamp}</span>
                </div>
            </div>

            <button className="absolute bottom-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
