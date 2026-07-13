"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import confetti from "canvas-confetti";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  Flame,
  Award,
  BookOpen,
  User as UserIcon,
  LogOut,
  ArrowRight,
  Target,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function PomodoroContent() {
  const { user, logout } = useAuth();

  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(3);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active task state
  const [activeTask, setActiveTask] = useState<string>("Mempelajari & membedah Bab 2.3: Gradient Descent");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const currentUser = user || {
    id: "usr-guest",
    name: "Pelajar Tamu",
    email: "tamu@arnai.ai",
    avatar: "",
    role: "Guest Account",
    isDemo: true,
    provider: "demo" as const,
  };

  const durations = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const switchMode = (newMode: "focus" | "shortBreak" | "longBreak") => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMode(newMode);
    setTimeLeft(durations[newMode]);
  };

  // Web Audio API Ambient Binaural Beats Generator
  useEffect(() => {
    if (isActive && soundEnabled && typeof window !== "undefined") {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        if (!oscillatorRef.current) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(196, ctx.currentTime); // 196 Hz Soothing Solfeggio / Binaural Root Frequency
          gain.gain.setValueAtTime(0.04, ctx.currentTime); // Very gentle ambient hum

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();

          oscillatorRef.current = osc;
          gainNodeRef.current = gain;
        }
      } catch (e) {
        console.error("Web Audio API not supported or blocked:", e);
      }
    } else {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {}
        oscillatorRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        try {
          audioCtxRef.current.suspend();
        } catch (e) {}
      }
    }

    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {}
        oscillatorRef.current = null;
      }
    };
  }, [isActive, soundEnabled]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleCompleteSession = () => {
    if (mode === "focus") {
      setSessionsCompleted((prev) => prev + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      alert("🎉 Selamat! Sesi Pomodoro Fokus 25 Menit Selesai! Anda mendapatkan +50 XP!");
    }
  };

  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(durations[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = Math.round(((durations[mode] - timeLeft) / durations[mode]) * 100);

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
                <Clock className="w-3.5 h-3.5" /> Pewaktu Pomodoro & Fokus Belajar
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Pomodoro & Ruang Fokus Belajar
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                Gunakan teknik interval fokus 25 menit untuk menguasai materi tanpa lelah (*Deep Work*).
              </p>
            </div>

            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                soundEnabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-card text-muted-foreground border-border"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? "🔊 Ambient Binaural ON" : "🔇 Suara Hening"}</span>
            </button>
          </div>

          {/* STATS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-card/60 p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black border border-amber-500/20">
                🔥
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Sesi Selesai Hari Ini</div>
                <div className="text-base sm:text-lg font-black text-foreground">{sessionsCompleted} <span className="text-xs font-normal text-muted-foreground">Sesi ({sessionsCompleted * 25}m)</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black border border-primary/20">
                ⚡
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Poin Pengalaman (XP)</div>
                <div className="text-base sm:text-lg font-black text-primary">+{sessionsCompleted * 50} <span className="text-xs font-normal text-muted-foreground">XP</span></div>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-3 bg-secondary/60 p-2.5 rounded-xl border border-border/80">
              <Target className="w-6 h-6 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Target Sesi Harian</div>
                <div className="text-xs font-bold text-foreground truncate">🎯 4 Sesi Deep Work RAG</div>
              </div>
            </div>
          </div>

          {/* MAIN TIMER CARD */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full py-4 space-y-6">
            {/* Mode Pills */}
            <div className="flex items-center p-1.5 rounded-2xl bg-secondary border border-border">
              <button
                onClick={() => switchMode("focus")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  mode === "focus"
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🍅 Fokus (25m)
              </button>
              <button
                onClick={() => switchMode("shortBreak")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  mode === "shortBreak"
                    ? "bg-emerald-600 text-white shadow-md scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ☕ Istirahat Singkat (5m)
              </button>
              <button
                onClick={() => switchMode("longBreak")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  mode === "longBreak"
                    ? "bg-purple-600 text-white shadow-md scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🌙 Istirahat Panjang (15m)
              </button>
            </div>

            {/* Circular / Glowing Display */}
            <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-card border-4 border-border/80 shadow-2xl relative flex flex-col items-center justify-center select-none overflow-hidden">
              {/* Background glowing progress indicator */}
              <div
                className="absolute bottom-0 left-0 w-full bg-primary/10 transition-all duration-500 pointer-events-none"
                style={{ height: `${progressPercent}%` }}
              />

              <span className="text-xs font-extrabold tracking-widest text-muted-foreground uppercase z-10">
                {mode === "focus" ? "🔥 Sesi Deep Work" : "☕ Waktu Jeda Santai"}
              </span>

              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tighter text-foreground my-3 z-10 drop-shadow-md">
                {formatTime(timeLeft)}
              </div>

              <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 z-10">
                {isActive ? "⏱️ Timer Sedang Berjalan" : "⏸️ Siap Dimulai"}
              </span>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-4 w-full justify-center">
              <button
                onClick={toggleTimer}
                className={`py-4 px-10 rounded-2xl font-black text-base shadow-xl flex items-center gap-2.5 transition-all active:scale-95 ${
                  isActive
                    ? "bg-amber-500 hover:bg-amber-600 text-black"
                    : "bg-primary hover:bg-blue-700 text-primary-foreground"
                }`}
              >
                {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isActive ? "Jeda (Pause)" : "Mulai Fokus"}</span>
              </button>

              <button
                onClick={resetTimer}
                className="p-4 rounded-2xl bg-card hover:bg-secondary border border-border text-foreground transition-all active:scale-95 shadow-md"
                title="Reset Timer ke Awal"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* ACTIVE STUDY TASK SELECTOR */}
            <div className="w-full glass-card p-4 rounded-2xl border border-border space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-muted-foreground">
                <span className="flex items-center gap-1.5 text-primary">
                  <Target className="w-3.5 h-3.5" /> Tugas yang Sedang Dikerjakan:
                </span>
              </div>
              <select
                value={activeTask}
                onChange={(e) => setActiveTask(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-secondary border border-border text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="Mempelajari & membedah Bab 2.3: Gradient Descent">
                  📑 Mempelajari & membedah Bab 2.3: Gradient Descent
                </option>
                <option value="Mengerjakan 12 Kartu SRS di Flashcards">
                  🃏 Mengerjakan 12 Kartu SRS di Flashcards
                </option>
                <option value="Latihan Kuis UTS Machine Learning">
                  ⚡ Latihan Kuis UTS Machine Learning
                </option>
                <option value="Eksplorasi Peta Konsep Mindmap">
                  🧠 Eksplorasi Peta Konsep Mindmap
                </option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/40 text-xs font-bold text-muted-foreground">
            <span>💡 Selesai satu sesi Pomodoro otomatis menyumbang +50 XP ke papan klasemen Anda.</span>
            <div className="flex items-center gap-3">
              <Link href="/achievements" className="text-primary hover:underline">
                🏆 Lihat Lencana Saya ➔
              </Link>
              <Link href="/leaderboard" className="text-amber-400 hover:underline">
                👑 Cek Klasemen ➔
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function PomodoroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center font-extrabold text-primary">Memuat Pomodoro Focus Timer...</div>}>
      <PomodoroContent />
    </Suspense>
  );
}
