"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import {
  Trophy,
  Award,
  Flame,
  User as UserIcon,
  LogOut,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Medal,
  Crown,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: string;
  streak: number;
  badgesCount: number;
  quizAccuracy: string;
  isCurrentUser?: boolean;
}

const leaderboardDataMap: Record<"weekly" | "monthly" | "allTime", LeaderboardUser[]> = {
  weekly: [
    {
      rank: 1,
      name: "Sarah Jenkins",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      xp: 480,
      level: "Level 5 • RAG Specialist",
      streak: 7,
      badgesCount: 10,
      quizAccuracy: "98%",
    },
    {
      rank: 2,
      name: "Anda (Pelajar Aktif)",
      avatar: "",
      xp: 450,
      level: "Level 4 • AI Master Scholar",
      streak: 7,
      badgesCount: 4,
      quizAccuracy: "96%",
      isCurrentUser: true,
    },
    {
      rank: 3,
      name: "Arka Bayu (Top Global)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arka",
      xp: 420,
      level: "Level 6 • Grand RAG Tactician",
      streak: 6,
      badgesCount: 12,
      quizAccuracy: "94%",
    },
    {
      rank: 4,
      name: "David Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      xp: 390,
      level: "Level 5 • RAG Specialist",
      streak: 5,
      badgesCount: 9,
      quizAccuracy: "92%",
    },
    {
      rank: 5,
      name: "Budi Santoso",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
      xp: 310,
      level: "Level 3 • Deep Learner",
      streak: 4,
      badgesCount: 4,
      quizAccuracy: "88%",
    },
    {
      rank: 6,
      name: "Elena Rostova",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      xp: 260,
      level: "Level 3 • Deep Learner",
      streak: 3,
      badgesCount: 3,
      quizAccuracy: "85%",
    },
    {
      rank: 7,
      name: "Ahmad Zaky",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zaky",
      xp: 190,
      level: "Level 2 • Novice Scholar",
      streak: 2,
      badgesCount: 2,
      quizAccuracy: "80%",
    },
  ],
  monthly: [
    {
      rank: 1,
      name: "David Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      xp: 1850,
      level: "Level 5 • RAG Specialist",
      streak: 15,
      badgesCount: 9,
      quizAccuracy: "95%",
    },
    {
      rank: 2,
      name: "Arka Bayu (Top Global)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arka",
      xp: 1720,
      level: "Level 6 • Grand RAG Tactician",
      streak: 14,
      badgesCount: 12,
      quizAccuracy: "96%",
    },
    {
      rank: 3,
      name: "Anda (Pelajar Aktif)",
      avatar: "",
      xp: 1450,
      level: "Level 4 • AI Master Scholar",
      streak: 12,
      badgesCount: 4,
      quizAccuracy: "92%",
      isCurrentUser: true,
    },
    {
      rank: 4,
      name: "Sarah Jenkins",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      xp: 1390,
      level: "Level 5 • RAG Specialist",
      streak: 11,
      badgesCount: 10,
      quizAccuracy: "94%",
    },
    {
      rank: 5,
      name: "Budi Santoso",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
      xp: 1120,
      level: "Level 3 • Deep Learner",
      streak: 8,
      badgesCount: 4,
      quizAccuracy: "89%",
    },
    {
      rank: 6,
      name: "Elena Rostova",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      xp: 980,
      level: "Level 3 • Deep Learner",
      streak: 6,
      badgesCount: 3,
      quizAccuracy: "86%",
    },
    {
      rank: 7,
      name: "Ahmad Zaky",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zaky",
      xp: 820,
      level: "Level 2 • Novice Scholar",
      streak: 5,
      badgesCount: 2,
      quizAccuracy: "83%",
    },
  ],
  allTime: [
    {
      rank: 1,
      name: "Arka Bayu (Top Global)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arka",
      xp: 2850,
      level: "Level 6 • Grand RAG Tactician",
      streak: 14,
      badgesCount: 12,
      quizAccuracy: "98%",
    },
    {
      rank: 2,
      name: "Sarah Jenkins",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      xp: 2410,
      level: "Level 5 • RAG Specialist",
      streak: 11,
      badgesCount: 10,
      quizAccuracy: "96%",
    },
    {
      rank: 3,
      name: "David Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      xp: 2190,
      level: "Level 5 • RAG Specialist",
      streak: 9,
      badgesCount: 9,
      quizAccuracy: "94%",
    },
    {
      rank: 4,
      name: "Anda (Pelajar Aktif)",
      avatar: "",
      xp: 1450,
      level: "Level 4 • AI Master Scholar",
      streak: 7,
      badgesCount: 4,
      quizAccuracy: "90%",
      isCurrentUser: true,
    },
    {
      rank: 5,
      name: "Budi Santoso",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
      xp: 1320,
      level: "Level 3 • Deep Learner",
      streak: 5,
      badgesCount: 4,
      quizAccuracy: "88%",
    },
    {
      rank: 6,
      name: "Elena Rostova",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      xp: 1180,
      level: "Level 3 • Deep Learner",
      streak: 4,
      badgesCount: 3,
      quizAccuracy: "85%",
    },
    {
      rank: 7,
      name: "Ahmad Zaky",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zaky",
      xp: 980,
      level: "Level 2 • Novice Scholar",
      streak: 3,
      badgesCount: 2,
      quizAccuracy: "82%",
    },
  ],
};

function LeaderboardContent() {
  const { user, logout } = useAuth();
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "allTime">("weekly");

  const currentUser = user || {
    id: "usr-guest",
    name: "Pelajar Tamu",
    email: "tamu@arnai.ai",
    avatar: "",
    role: "Guest Account",
    isDemo: true,
    provider: "demo" as const,
  };

  const currentList = leaderboardDataMap[timeframe];
  const topThree = currentList.slice(0, 3);
  const remaining = currentList.slice(3);

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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-2 border border-primary/20">
                <Trophy className="w-3.5 h-3.5" /> Phase 10: Student Leaderboard & Ranking
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Klasemen & Peringkat Pelajar
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                Kompeteisi sehat berdasarkan akumulasi Poin Pengalaman (XP) dan ketekunan belajar mingguan.
              </p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center p-1.5 rounded-2xl bg-secondary border border-border">
              <button
                onClick={() => setTimeframe("weekly")}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                  timeframe === "weekly" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🔥 Mingguan (Weekly)
              </button>
              <button
                onClick={() => setTimeframe("monthly")}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                  timeframe === "monthly" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🏆 Bulanan (Monthly)
              </button>
              <button
                onClick={() => setTimeframe("allTime")}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                  timeframe === "allTime" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                👑 Sepanjang Masa
              </button>
            </div>
          </div>

          {/* TOP 3 PODIUM HERO SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 sm:pt-8 items-end max-w-4xl mx-auto w-full">
            {/* RANK 2 (SILVER) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="order-2 sm:order-1 glass-card p-6 rounded-3xl border border-slate-400/40 text-center flex flex-col items-center shadow-xl relative"
            >
              <div className="absolute -top-5 px-3 py-1 rounded-full bg-slate-300 text-slate-900 font-black text-xs shadow-md border border-white">
                🥈 #2 Silver
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-500/20 border-2 border-slate-400 flex items-center justify-center overflow-hidden mb-3">
                <img src={topThree[1].avatar} alt={topThree[1].name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-black text-sm text-foreground truncate w-full">{topThree[1].name}</h3>
              <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{topThree[1].level}</p>
              <div className="mt-3 py-1.5 px-4 rounded-xl bg-secondary/80 border border-border text-xs font-mono font-black text-slate-300 w-full">
                {topThree[1].xp.toLocaleString()} XP
              </div>
            </motion.div>

            {/* RANK 1 (GOLD PODIUM - TALLER) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="order-1 sm:order-2 glass-card p-8 rounded-3xl border-2 border-amber-500/60 bg-amber-500/10 text-center flex flex-col items-center shadow-2xl relative sm:-translate-y-6"
            >
              <div className="absolute -top-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs shadow-lg border border-white flex items-center gap-1">
                <Crown className="w-4 h-4 fill-current" /> #1 Champion
              </div>
              <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center overflow-hidden mb-3 shadow-inner">
                <img src={topThree[0].avatar} alt={topThree[0].name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-black text-base text-foreground truncate w-full">{topThree[0].name}</h3>
              <p className="text-xs font-bold text-amber-300 mt-0.5">{topThree[0].level}</p>
              <div className="mt-4 py-2 px-5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-sm font-mono font-black text-amber-400 w-full shadow-inner">
                🔥 {topThree[0].xp.toLocaleString()} XP
              </div>
            </motion.div>

            {/* RANK 3 (BRONZE) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="order-3 sm:order-3 glass-card p-6 rounded-3xl border border-amber-700/40 text-center flex flex-col items-center shadow-xl relative"
            >
              <div className="absolute -top-5 px-3 py-1 rounded-full bg-amber-700 text-white font-black text-xs shadow-md border border-white">
                🥉 #3 Bronze
              </div>
              <div className="w-16 h-16 rounded-full bg-amber-700/20 border-2 border-amber-600 flex items-center justify-center overflow-hidden mb-3">
                <img src={topThree[2].avatar} alt={topThree[2].name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-black text-sm text-foreground truncate w-full">{topThree[2].name}</h3>
              <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{topThree[2].level}</p>
              <div className="mt-3 py-1.5 px-4 rounded-xl bg-secondary/80 border border-border text-xs font-mono font-black text-amber-500 w-full">
                {topThree[2].xp.toLocaleString()} XP
              </div>
            </motion.div>
          </div>

          {/* FULL RANKINGS LIST TABLE (#4 to #10) */}
          <div className="glass-card rounded-3xl border border-border overflow-hidden shadow-xl">
            <div className="bg-secondary/60 p-4 sm:px-6 border-b border-border flex items-center justify-between text-xs font-black text-muted-foreground uppercase tracking-wider">
              <span>Peringkat & Pelajar</span>
              <div className="flex items-center gap-8 sm:gap-12">
                <span className="hidden sm:inline">Streak</span>
                <span className="hidden sm:inline">Akurasi Kuis</span>
                <span>Total XP</span>
              </div>
            </div>

            <div className="divide-y divide-border/60">
              {remaining.map((usr) => (
                <div
                  key={usr.rank}
                  className={`p-4 sm:px-6 flex items-center justify-between transition-colors ${
                    usr.isCurrentUser ? "bg-primary/15 border-l-4 border-l-primary font-black" : "hover:bg-secondary/40 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 text-center text-sm font-black ${usr.isCurrentUser ? "text-primary" : "text-muted-foreground"}`}>
                      #{usr.rank}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                      {usr.avatar ? (
                        <img src={usr.avatar} alt={usr.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-foreground flex items-center gap-2">
                        <span>{usr.name}</span>
                        {usr.isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black">
                            ⭐ Anda
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-medium">{usr.level}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 sm:gap-12 text-xs font-bold">
                    <span className="hidden sm:inline text-amber-400">🔥 {usr.streak}x</span>
                    <span className="hidden sm:inline text-emerald-400">{usr.quizAccuracy}</span>
                    <span className={`font-mono font-black text-sm ${usr.isCurrentUser ? "text-primary" : "text-foreground"}`}>
                      {usr.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs font-bold text-muted-foreground">
            <span>💡 Selesaikan sesi Pomodoro atau 3D Flashcard untuk menyalip posisi #3!</span>
            <Link href="/pomodoro" className="text-primary hover:underline flex items-center gap-1">
              <span>⏱️ Mulai Pomodoro Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center font-extrabold text-primary">Memuat Papan Klasemen...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}
