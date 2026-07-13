"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import confetti from "canvas-confetti";
import {
  Award,
  Trophy,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  BookOpen,
  User as UserIcon,
  LogOut,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers,
  HelpCircle,
  Network,
} from "lucide-react";
import { motion } from "framer-motion";

interface BadgeItem {
  id: string;
  title: string;
  description: string;
  xp: number;
  unlocked: boolean;
  progressPercent?: number;
  icon: string;
  badgeColor: string;
}

const badges: BadgeItem[] = [
  {
    id: "bdg-1",
    title: "🔥 7-Day Study Streak",
    description: "Login dan berinteraksi dengan AI RAG selama 7 hari berturut-turut tanpa terputus.",
    xp: 250,
    unlocked: true,
    icon: "🔥",
    badgeColor: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  },
  {
    id: "bdg-2",
    title: "🃏 Spaced Repetition Master",
    description: "Menandai 20 kartu hafalan sebagai 'Menguasai (Easy)' pada ruang 3D Flashcard.",
    xp: 150,
    unlocked: true,
    icon: "🃏",
    badgeColor: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "bdg-3",
    title: "🏆 UTS Flawless Victory",
    description: "Mendatangkan skor akurasi 100% pada simulasi ujian kuis Machine Learning Bab 2.",
    xp: 300,
    unlocked: true,
    icon: "🏆",
    badgeColor: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  },
  {
    id: "bdg-4",
    title: "🧠 Semantic Mindmap Explorer",
    description: "Mengklik dan mempelajari rumus dari 8 node konsep pada ruang Interactive Mindmap.",
    xp: 100,
    unlocked: true,
    icon: "🧠",
    badgeColor: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  },
  {
    id: "bdg-5",
    title: "⏱️ Deep Work Pomodoro Guru",
    description: "Menyelesaikan total 10 sesi fokus 25 menit di Pomodoro Timer.",
    xp: 500,
    unlocked: false,
    progressPercent: 70,
    icon: "⏱️",
    badgeColor: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  },
  {
    id: "bdg-6",
    title: "📑 RAG Document Pioneer",
    description: "Mengunggah dan mengekstrak vektor dari 5 dokumen PDF/DOCX di perpustakaan materi.",
    xp: 200,
    unlocked: false,
    progressPercent: 40,
    icon: "📑",
    badgeColor: "bg-secondary border-border text-muted-foreground",
  },
];

function AchievementsContent() {
  const { user, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState<"all" | "unlocked" | "locked">("all");

  const currentUser = user || {
    id: "usr-guest",
    name: "Pelajar Tamu",
    email: "tamu@arnai.ai",
    avatar: "",
    role: "Guest Account",
    isDemo: true,
    provider: "demo" as const,
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const filteredBadges = badges.filter((b) => {
    if (activeFilter === "unlocked") return b.unlocked;
    if (activeFilter === "locked") return !b.unlocked;
    return true;
  });

  const totalXP = 1450;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center p-1">
              <Image src="/logo.png" alt="Arnai" width={26} height={26} className="object-contain" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              Arnai<span className="text-primary font-bold">.ai</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              💬 Buka AI Chat
            </Link>

            <div className="flex items-center gap-2 bg-secondary/80 border border-border px-3 py-1.5 rounded-2xl">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="text-xs font-bold">{currentUser.name}</span>
              {currentUser.provider === "google" && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-extrabold">
                  ✓ Google
                </span>
              )}
            </div>

            {user && (
              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border hover:border-red-500/40 text-muted-foreground hover:text-red-500 text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Keluar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Workspace Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-2 border border-primary/20">
                <Award className="w-3.5 h-3.5" /> Pencapaian Akademik & Lencana Gamifikasi
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Pencapaian & Koleksi Lencana
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                Kumpulkan Poin Pengalaman (XP) dari setiap sesi belajar, flashcard, dan kuis untuk naik level!
              </p>
            </div>

            <button
              onClick={handleCelebrate}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95 animate-pulse"
            >
              <span>🎉 Rayakan Lencana Terbuka!</span>
            </button>
          </div>

          {/* HERO XP RANK CARD */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-primary/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-primary/20 text-primary flex items-center justify-center font-black text-3xl border border-primary/40 shrink-0 shadow-inner">
                ⚡
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-primary">Status Peringkat Kognitif</div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
                  Level 4 • AI Master Scholar
                </h2>
                <div className="text-sm font-black text-amber-400 mt-1">
                  🌟 Total Pengalaman: {totalXP.toLocaleString()} XP
                </div>
              </div>
            </div>

            <div className="w-full md:w-80 space-y-2">
              <div className="flex justify-between text-xs font-black">
                <span>Progres ke Level 5 (Grand Tactician)</span>
                <span className="text-primary">85%</span>
              </div>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden border border-border">
                <div className="w-[85%] h-full bg-gradient-to-r from-primary to-blue-400 rounded-full" />
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground text-right">
                Sisa 150 XP lagi untuk naik level berikutnya
              </div>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 bg-secondary p-1.5 rounded-2xl border border-border">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === "all" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua Lencana ({badges.length})
              </button>
              <button
                onClick={() => setActiveFilter("unlocked")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === "unlocked" ? "bg-emerald-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ✓ Terbuka ({badges.filter((b) => b.unlocked).length})
              </button>
              <button
                onClick={() => setActiveFilter("locked")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === "locked" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🔒 Terkunci ({badges.filter((b) => !b.unlocked).length})
              </button>
            </div>
          </div>

          {/* BADGES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map((bdg) => (
              <motion.div
                key={bdg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  bdg.unlocked ? "bg-card border-border shadow-lg hover:border-primary/50" : "bg-secondary/40 border-border/60 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-2xl shadow-inner">
                      {bdg.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1 ${bdg.badgeColor}`}>
                      {bdg.unlocked ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka (+{bdg.xp} XP)
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Terkunci ({bdg.xp} XP)
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-foreground">{bdg.title}</h3>
                  <p className="text-xs font-semibold text-muted-foreground leading-relaxed mt-1.5">
                    {bdg.description}
                  </p>
                </div>

                {!bdg.unlocked && bdg.progressPercent && (
                  <div className="pt-4 mt-4 border-t border-border/60 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                      <span>Progres Lencana</span>
                      <span>{bdg.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border/40">
                      <div className="h-full bg-blue-500" style={{ width: `${bdg.progressPercent}%` }} />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs font-bold text-muted-foreground">
            <span>💡 Raih lebih banyak XP dengan menantang diri Anda di Leaderboard klasemen harian.</span>
            <Link href="/leaderboard" className="text-amber-400 hover:underline flex items-center gap-1">
              <span>👑 Lihat Klasemen Pelajar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center font-extrabold text-primary">Memuat Lencana Pencapaian...</div>}>
      <AchievementsContent />
    </Suspense>
  );
}
