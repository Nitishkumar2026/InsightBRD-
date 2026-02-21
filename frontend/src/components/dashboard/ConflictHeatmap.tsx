"use client";

import React from "react";
import { motion } from "framer-motion";

const stakeholders = ["CTO", "PM", "Dev Team", "Sales", "Security"];
const sources = ["Gmail", "Slack", "Transcripts", "Tech Doc", "Market Spec"];

// Mock data: score 0-100 for conflict severity
const generateData = () => {
    return stakeholders.map(() => sources.map(() => Math.floor(Math.random() * 100)));
};

const data = generateData();

export function ConflictHeatmap() {
    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="mb-6">
                <h3 className="text-lg font-bold">Conflict Heatmap</h3>
                <p className="text-sm text-muted-foreground">Severity of contradictions by source and stakeholder</p>
            </div>

            <div className="grid grid-cols-6 gap-2">
                {/* Header row */}
                <div />
                {sources.map((source) => (
                    <div key={source} className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground text-center">
                        {source}
                    </div>
                ))}

                {/* Rows */}
                {stakeholders.map((stakeholder, i) => (
                    <React.Fragment key={stakeholder}>
                        <div className="text-xs font-bold flex items-center">{stakeholder}</div>
                        {data[i].map((severity, j) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (i * 5 + j) * 0.02 }}
                                key={`${i}-${j}`}
                                className="aspect-square rounded-md flex items-center justify-center text-[10px] font-bold transition-all relative group cursor-pointer"
                                style={{
                                    backgroundColor: severity > 70 ? 'rgba(244, 63, 94, 0.2)' :
                                        severity > 40 ? 'rgba(245, 158, 11, 0.2)' :
                                            'rgba(16, 185, 129, 0.2)',
                                    color: severity > 70 ? '#f43f5e' : severity > 40 ? '#f59e0b' : '#10b981',
                                    border: `1px solid ${severity > 70 ? '#f43f5e33' : severity > 40 ? '#f59e0b33' : '#10b98133'}`
                                }}
                            >
                                {severity}
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md transition-opacity" />
                            </motion.div>
                        ))}
                    </React.Fragment>
                ))}
            </div>

            <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/30" />
                        <span>Low Conflict</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/30" />
                        <span>Moderate</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-sm bg-rose-500/20 border border-rose-500/30" />
                        <span>High Severity</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
