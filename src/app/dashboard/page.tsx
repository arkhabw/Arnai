"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
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
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // If no user, user can either login or we display preview
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

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/80 border border-border px-3 py-1.5 rounded-2xl">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="text-xs font-bold">{currentUser.name}</span>
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Banner Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 sm:p-8 border border-border mb-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-3 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> Workspace Penguasaan Materi
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
              Halo, <span className="text-primary">{currentUser.name}</span> 👋
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl">
              {currentUser.isDemo ? (
                <span>
                  Anda sedang dalam <strong>Quick Demo Mode (Akun Arkha B. W.)</strong>. Sistem telah memuat 2 dokumen seed kuliah Anda beserta statistik kemajuan belajar.
                </span>
              ) : (
                <span>
                  Selamat datang di ruang kerja Anda! Unggah materi pembelajaran baru untuk langsung berinteraksi dengan AI RAG.
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 relative z-10 shrink-0">
            <div className="glass-card p-4 rounded-2xl border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Flame className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <div className="text-xl font-black text-foreground">{currentUser.streakDays} Hari</div>
                <div className="text-xs font-semibold text-muted-foreground">Belajar Streak</div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-foreground">{currentUser.completedQuizzes} Kuis</div>
                <div className="text-xs font-semibold text-muted-foreground">Telah Diselesaikan</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Phase Notification Header */}
        <div className="mb-6 p-4 rounded-2xl bg-secondary/80 border border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
              ✓
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-foreground">
                Phase 2 (Authentication & Demo Seed Mode) Berhasil di-deploy!
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Sistem login, register, forgot password, validasi Zod, dan seed data berhasil terhubung dengan sempurna.
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-primary hover:underline whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            Lihat Landing Page <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Modules Grid */}
        <h2 className="text-lg font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Modul & Ruang Kerja AI (Siap Dilanjutkan di Phase 3 - 5)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-border flex flex-col justify-between hover:border-primary/50 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Dokumen & RAG Chat</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-4">
                {currentUser.isDemo
                  ? "2 dokumen tersimpan: Machine_Learning_Bab2.pdf & Database_System_Design.pdf."
                  : "Belum ada dokumen diunggah. Unggah PDF/DOCX untuk memulai."}
              </p>
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>RAG Vector Active</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-secondary">Phase 3 & 4</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border flex flex-col justify-between hover:border-primary/50 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">3D Flashcard & SRS</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-4">
                {currentUser.isDemo
                  ? "68 kartu hafalan telah dikuasai dengan sistem Spaced Repetition (Mudah, Sedang, Sulit)."
                  : "Buat flashcard otomatis dari dokumen kuliah Anda dalam hitungan detik."}
              </p>
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-indigo-400">
              <span>3D Flip Animation</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-secondary">Phase 4</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border flex flex-col justify-between hover:border-primary/50 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Quiz & Esai Generator</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-4">
                {currentUser.isDemo
                  ? "14 kuis selesai. Nilai rata-rata Anda: 88/100 (Pembahasan AI aktif)."
                  : "Uji pemahaman Anda dengan soal pilihan ganda maupun esai berpenilaian otomatis."}
              </p>
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-cyan-400">
              <span>AI Grading System</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-secondary">Phase 4</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
