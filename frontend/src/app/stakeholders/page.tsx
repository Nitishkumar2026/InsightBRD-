"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Search, Mail, Filter, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const stakeholders = [
    { id: 1, name: "Dr. Sarah Chen", role: "CTO", email: "sarah.c@enterprise.com", influence: 0.95, alignment: 0.82, status: "Active" },
    { id: 2, name: "Marcus Thorne", role: "Product Manager", email: "m.thorne@enterprise.com", influence: 0.88, alignment: 0.65, status: "Active" },
    { id: 3, name: "Elena Rodriguez", role: "Security Lead", email: "e.rodriguez@enterprise.com", influence: 0.92, alignment: 0.45, status: "Conflict" },
    { id: 4, name: "David Kim", role: "Dev Team Lead", email: "d.kim@enterprise.com", influence: 0.75, alignment: 0.90, status: "Active" },
    { id: 5, name: "Jessica Walsh", role: "Sales Director", email: "j.walsh@enterprise.com", influence: 0.85, alignment: 0.55, status: "Concerning" },
];

export default function StakeholdersPage() {
    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Stakeholder Explorer</h1>
                    <p className="text-muted-foreground mt-1">Manage influence, alignment, and communication across the project.</p>
                </div>
                <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                    <UserPlus className="w-4 h-4" />
                    <span>Add Stakeholder</span>
                </button>
            </div>

            <div className="flex items-center justify-between bg-card border rounded-2xl p-4 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search stakeholders by name or role..."
                        className="w-full pl-10 pr-4 py-2 bg-secondary/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors border">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <div className="h-6 w-[1px] bg-border mx-2" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">Sort by</span>
                    <select className="bg-transparent text-sm font-bold outline-none cursor-pointer">
                        <option>Influence</option>
                        <option>Alignment</option>
                        <option>Name</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stakeholders.map((person) => (
                    <motion.div
                        key={person.id}
                        whileHover={{ y: -5 }}
                        className="bg-card border rounded-2xl p-6 shadow-sm group relative overflow-hidden"
                    >
                        <div className={cn(
                            "absolute top-0 right-0 w-24 h-24 blur-3xl -mr-12 -mt-12 transition-colors",
                            person.status === "Conflict" ? "bg-rose-500/20" :
                                person.status === "Concerning" ? "bg-amber-500/20" :
                                    "bg-emerald-500/20"
                        )} />

                        <div className="flex items-start justify-between relative">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                                    {person.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{person.name}</h3>
                                    <p className="text-xs text-muted-foreground">{person.role}</p>
                                </div>
                            </div>
                            <div className={cn(
                                "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                                person.status === "Conflict" ? "bg-rose-500/10 text-rose-500" :
                                    person.status === "Concerning" ? "bg-amber-500/10 text-amber-500" :
                                        "bg-emerald-500/10 text-emerald-500"
                            )}>
                                {person.status}
                            </div>
                        </div>

                        <div className="mt-6 space-y-4 relative">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Influence Score</span>
                                <span className="font-bold">{(person.influence * 10).toFixed(1)}/10</span>
                            </div>
                            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${person.influence * 100}%` }} />
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Project Alignment</span>
                                <div className="flex items-center space-x-1">
                                    {person.alignment > 0.8 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
                                    <span className={cn("font-bold", person.alignment > 0.8 ? "text-emerald-500" : person.alignment < 0.5 ? "text-rose-500" : "text-amber-500")}>
                                        {(person.alignment * 100).toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center space-x-2 pt-4 border-t relative">
                            <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-xs font-bold">
                                <Mail className="w-3 h-3" />
                                <span>Contact</span>
                            </button>
                            <button className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
