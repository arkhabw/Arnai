"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  Zap,
  Network,
  Trophy,
} from "lucide-react";

const navItems = [
  { name: "Dashboard Utama", href: "/dashboard", icon: LayoutDashboard, badge: "Aktif" },
  { name: "Materi & Dokumen", href: "/documents", icon: FileText, badge: "Phase 4" },
  { name: "AI Chat RAG", href: "/chat", icon: MessageSquare, badge: "Phase 5" },
  { name: "Ringkasan & Highlight", href: "/study/summary", icon: Sparkles, badge: "Phase 6" },
  { name: "3D Flashcard & SRS", href: "/study/flashcards", icon: Layers, badge: "Phase 7" },
  { name: "AI Quiz Generator", href: "/study/quizzes", icon: HelpCircle, badge: "Phase 8" },
  { name: "Interactive Mindmap", href: "/study/mindmaps", icon: Network, badge: "Phase 9" },
  { name: "Pomodoro Focus Timer", href: "/pomodoro", icon: Clock, badge: "Phase 10" },
  { name: "Pencapaian & Lencana", href: "/achievements", icon: Award, badge: "Phase 10" },
  { name: "Klasemen Pelajar", href: "/leaderboard", icon: Trophy, badge: "Phase 10" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-card/60 backdrop-blur-xl border-r border-border min-h-screen flex flex-col justify-between p-4 hidden md:flex">
      <div>
        {/* Navigation Section */}
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2">
          Ruang Kerja Belajar
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badge === "Aktif"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-secondary text-muted-foreground border border-border"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* RAG Engine Status Widget */}
      <div className="p-3.5 rounded-2xl bg-secondary/80 border border-border mt-6">
        <div className="flex items-center gap-2 text-primary text-xs font-black mb-1">
          <Zap className="w-4 h-4 fill-primary animate-pulse" />
          <span>Arnai AI Engine v2.4</span>
        </div>
        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed mb-3">
          Sistem siap memproses dokumen kuliah Anda menjadi vektor RAG interaktif.
        </p>
        <Link
          href="/"
          className="w-full block py-2 rounded-lg bg-card hover:bg-background border border-border text-center text-xs font-bold text-foreground transition-colors shadow-sm"
        >
          Lihat Landing Page
        </Link>
      </div>
    </aside>
  );
}
