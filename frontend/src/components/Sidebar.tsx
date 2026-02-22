"use client";

import React from "react";
import {
    LayoutDashboard,
    FileText,
    AlertTriangle,
    Users,
    TrendingUp,
    Settings,
    PlusCircle,
    Inbox,
    Zap,
    Dna,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Inbox, label: "Ingest", href: "/ingest" },
    { icon: FileText, label: "Requirements", href: "/requirements" },
    { icon: AlertTriangle, label: "Conflicts", href: "/conflicts" },
    { icon: TrendingUp, label: "Sentiment", href: "/sentiment" },
    { icon: Zap, label: "Intelligence", href: "/intelligence" },
    { icon: Dna, label: "Simulation", href: "/simulate" },
    { icon: Users, label: "Stakeholders", href: "/stakeholders" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [notification, setNotification] = React.useState<string | null>(null);

    const handleNewProject = async () => {
        setNotification("Initializing Secure Workspace...");
        try {
            const res = await fetch("http://localhost:8000/api/v1/projects/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `Project ${new Date().toLocaleDateString()}`,
                    description: "Created via secure workspace initializer."
                })
            });

            if (res.ok) {
                setNotification("Project created successfully! Reloading...");
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setNotification("Failed to create project.");
            }
        } catch (err) {
            console.error(err);
            setNotification("Network error.");
        }
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="w-64 border-r bg-card/50 backdrop-blur-md h-screen flex flex-col p-4 space-y-8 relative">
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute bottom-24 left-4 right-4 z-[100] px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-xl flex items-center space-x-2 font-bold text-xs"
                    >
                        <ShieldCheck className="w-4 h-4 text-yellow-300" />
                        <span>{notification}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center space-x-2 px-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <FileText className="text-primary-foreground w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold gradient-text">InsightBRD+</h1>
            </div>

            <nav className="flex-1 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-8 border-t space-y-4">
                <button
                    onClick={handleNewProject}
                    className="w-full flex items-center space-x-2 px-4 py-3 rounded-xl bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600/20 transition-all font-semibold"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>New Project</span>
                </button>

                <div className="flex items-center space-x-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Nitish 🔥</span>
                        <span className="text-xs text-muted-foreground">Admin</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
