"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { StudyChart } from "@/components/dashboard/StudyChart";
import {
  BookOpen,
  LogOut,
  Sparkles,
  CheckCircle2,
  FileText,
  HelpCircle,
  Layers,
  ArrowRight,
  User as UserIcon,
  Zap,
  Flame,
  Plus,
  ArrowUpRight,
  Clock,
  AlertCircle,
  UploadCloud,
  PlayCircle,
  Search,
  Bell,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const continueLearningSubjects = [
  {
    id: "sub-1",
    title: "Machine Learning & Artificial Intelligence",
    file: "Machine_Learning_Bab2.pdf",
    progress: 75,
    mastered: "12 / 16 Konsep Dikuasai",
    color: "from-blue-600 to-indigo-600",
    badgeColor: "bg-blue-500/10 text-primary border-primary/20",
    lastStudy: "2 jam yang lalu",
  },
  {
    id: "sub-2",
    title: "Database System Design & Normalization",
    file: "Database_System_Design.pdf",
    progress: 40,
    mastered: "8 / 20 Konsep Dikuasai",
    color: "from-indigo-600 to-purple-600",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    lastStudy: "Kemarin",
  },
  {
    id: "sub-3",
    title: "Kalkulus Lanjut & Aljabar Vektor",
    file: "Kalkulus_Vektor_Summary.pdf",
    progress: 90,
    mastered: "18 / 20 Konsep Dikuasai",
    color: "from-cyan-600 to-blue-600",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    lastStudy: "3 hari yang lalu",
  },
];

const recentFiles = [
  {
    name: "Machine_Learning_Bab2.pdf",
    size: "3.2 MB",
    uploaded: "12 Juli 2026",
    status: "🟢 RAG Ready & Indexed",
    chunks: "42 Vector Chunks",
    isReady: true,
  },
  {
    name: "Database_System_Design.pdf",
    size: "5.1 MB",
    uploaded: "11 Juli 2026",
    status: "🟢 RAG Ready & Indexed",
    chunks: "64 Vector Chunks",
    isReady: true,
  },
  {
    name: "Jurnal_Neural_Networks_2025.pdf",
    size: "1.8 MB",
    uploaded: "10 Juli 2026",
    status: "🟢 RAG Ready & Indexed",
    chunks: "28 Vector Chunks",
    isReady: true,
  },
  {
    name: "Catatan_Kuliah_Pertemuan_4.docx",
    size: "450 KB",
    uploaded: "Baru saja",
    status: "🟡 Sinkronisasi CHAT AI",
    chunks: "Menunggu ekstraksi...",
    isReady: false,
  },
];

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentUser = user || {
    id: "usr-guest",
    name: "Pelajar Tamu",
    email: "tamu@arnai.ai",
    avatar: "",
    role: "Guest Account",
    isDemo: false,
    streakDays: 0,
    completedQuizzes: 0,
    masteredFlashcards: 0,
    xp: 100,
    level: 1,
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
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

          {/* Search bar inside header */}
          <div className="hidden md:flex items-center gap-2 max-w-sm w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-1.5 focus-within:border-primary transition-colors">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Cari materi, flashcard, atau dokumen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="p-2 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </button>

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
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-extrabold flex items-center gap-1">
                  ✓ Google
                </span>
              )}
              {currentUser.isDemo && (
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-primary border border-primary/20 text-[10px] font-extrabold">
                  ⚡ Seed Demo
                </span>
              )}
            </div>

            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:border-red-500/40 text-muted-foreground hover:text-red-500 text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Keluar
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm"
              >
                Masuk / Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Workspace Flex Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          {/* Greeting Card & Streak Counter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-border relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-3 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" /> Analisis Belajar & Dasbor Progres
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
                Halo, <span className="text-primary">{currentUser.name}</span> 👋
              </h1>
              <div className="flex items-center gap-3.5 mb-4 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[10px] tracking-wider uppercase shrink-0 shadow-sm">
                  ✨ Level {currentUser.level || 1}
                </span>
                <div className="w-48 h-2 rounded-full bg-secondary border border-border overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((currentUser.xp || 100) % 500) / 5)}%` }}
                  />
                </div>
                <span className="text-xs font-black text-foreground shrink-0">
                  {currentUser.xp || 100} XP
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                {currentUser.provider === "google" ? (
                  <span>
                    Anda masuk melalui akun <strong>Google OAuth Terverifikasi ({currentUser.email})</strong>. Selamat belajar dengan asisten AI!
                  </span>
                ) : currentUser.isDemo ? (
                  <span>
                    Anda sedang dalam <strong>Quick Demo Mode (Akun Arkha B. W.)</strong>. Sistem memuat statistik real-time, grafik durasi belajar mingguan, dan riwayat dokumen RAG.
                  </span>
                ) : (
                  <span>
                    Selamat datang di ruang kerja Anda! Lihat kemajuan belajar Anda, analisis durasi fokus, dan lanjutkan penguasaan materi dari titik terakhir.
                  </span>
                )}
              </p>

              {/* Quick Actions CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <Link
                  href="/documents"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground font-bold text-xs shadow-sm transition-all active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" /> Unggah Dokumen RAG
                </Link>
                <Link
                  href="/study/quizzes"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground font-bold text-xs transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-cyan-400" /> Mulai Kuis Cepat
                </Link>
                <Link
                  href="/study/flashcards"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground font-bold text-xs transition-all"
                >
                  <Layers className="w-4 h-4 text-indigo-400" /> Latihan Flashcard
                </Link>
              </div>
            </div>

            {/* Streak & Mastery Stats Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 relative z-10 w-full lg:w-auto shrink-0">
              <div className="glass-card p-4 rounded-2xl border border-border flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-foreground">
                    {currentUser.streakDays || 7} <span className="text-xs font-bold text-muted-foreground">Hari</span>
                  </div>
                  <div className="text-[11px] font-bold text-muted-foreground">Belajar Streak</div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-border flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-foreground">
                    {currentUser.completedQuizzes || 14}
                  </div>
                  <div className="text-[11px] font-bold text-muted-foreground">Kuis Diselesaikan</div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-border flex items-center gap-3.5 col-span-2 sm:col-span-1 lg:col-span-2">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-foreground">
                    {currentUser.masteredFlashcards || 68} <span className="text-xs font-bold text-muted-foreground">Kartu</span>
                  </div>
                  <div className="text-[11px] font-bold text-muted-foreground">Flashcard Dikuasai (SRS)</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Study Analytics Chart Section */}
          <StudyChart isDemo={currentUser.isDemo} />

          {/* Continue Learning Progress Bars */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                  Lanjutkan Penguasaan Materi
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Materi yang sedang Anda pelajari beserta kemajuan pemahaman dari RAG AI.
                </p>
              </div>
              <Link
                href="/documents"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {continueLearningSubjects.map((sub) => (
                <div
                  key={sub.id}
                  className="glass-card rounded-3xl p-5 border border-border flex flex-col justify-between hover:border-primary/50 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${sub.badgeColor}`}>
                        {sub.mastered}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {sub.lastStudy}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug mb-1.5">
                      {sub.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mb-4 truncate">
                      <FileText className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <span className="truncate">{sub.file}</span>
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-muted-foreground">Kemajuan RAG</span>
                      <span className="text-primary">{sub.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${sub.progress}%` }}
                      />
                    </div>

                    <Link
                      href="/chat"
                      className="w-full py-2.5 rounded-xl bg-secondary group-hover:bg-primary group-hover:text-primary-foreground text-foreground font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>Lanjutkan Belajar</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Files & AI Processing Status */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-primary" /> Daftar Dokumen & Status RAG Vektor
                </h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  Dokumen yang telah diunggah dan diindeks oleh mesin pemahaman AI Arnai.
                </p>
              </div>

              <Link
                href="/documents"
                className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground font-bold text-xs shadow-sm self-start sm:self-auto transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Tambah Dokumen Baru
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Dokumen</th>
                    <th className="py-3 px-4">Ukuran</th>
                    <th className="py-3 px-4">Tanggal Unggah</th>
                    <th className="py-3 px-4">Status Pemrosesan AI</th>
                    <th className="py-3 px-4">Vector Chunks</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs font-semibold">
                  {recentFiles.map((file, idx) => (
                    <tr key={idx} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-foreground flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="truncate max-w-xs">{file.name}</span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{file.size}</td>
                      <td className="py-4 px-4 text-muted-foreground">{file.uploaded}</td>
                      <td className="py-4 px-4">
                        <span className="font-extrabold">{file.status}</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-primary">{file.chunks}</td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href="/chat"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-bold transition-all shadow-sm"
                        >
                          <span>Chat AI</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
