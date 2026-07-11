"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  MessageSquare,
  FileText,
  RotateCcw,
  Zap,
} from "lucide-react";

export function HeroSection() {
  const [flippedCard, setFlippedCard] = useState(false);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[90px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-bold text-xs sm:text-sm mb-6 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "6s" }} />
            <span>Notion + Quizlet + ChatGPT + Coursera dalam 1 Aplikasi</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Belajar Lebih Cepat, <br className="hidden sm:inline" />
            Paham Lebih Dalam dengan <span className="gradient-text">Arnai AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground font-medium max-w-2xl mb-10 leading-relaxed"
          >
            Cukup unggah materi pelajaranmu (PDF, PPT, DOCX, atau catatan). AI otomatis meringkas, menjawab pertanyaan (RAG), membuat kuis pilihan ganda & esai, flashcard 3D, hingga peta konsep mindmap!
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/login?mode=register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary hover:bg-blue-700 dark:hover:bg-blue-600 text-primary-foreground font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
            >
              <Zap className="w-5 h-5 fill-current" />
              Mulai Belajar Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <BrainCircuit className="w-5 h-5 text-primary" />
              Preview Dashboard
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-border/60 grid grid-cols-3 gap-6 sm:gap-12 text-center"
          >
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">100%</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-0.5">Akurasi RAG Kutipan</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">5 Format</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-0.5">PDF, PPTX, DOCX, TXT, IMG</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">6 in 1</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-0.5">Chat, Quiz, Flashcard & Mindmap</p>
            </div>
          </motion.div>
        </div>

        {/* Interactive UI Showcase Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 relative mx-auto max-w-5xl"
        >
          {/* Decorative frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />

          <div className="relative rounded-2xl border border-border bg-card/95 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono font-medium text-muted-foreground">arnai.ai/workspace/ai-mastery</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI Vector Engine Online
              </div>
            </div>

            {/* Mockup Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Panel: Uploaded file status & progress */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="p-4 rounded-xl border border-border bg-secondary/60 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Materi Aktif</span>
                    <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">RAG Ready</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 font-bold text-xs">
                      PDF
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-foreground truncate">Machine_Learning_Bab2.pdf</p>
                      <p className="text-xs text-muted-foreground font-medium">24 Halaman • 42 Chunks Vector</p>
                    </div>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="p-4 rounded-xl border border-border bg-secondary/60 flex flex-col gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Progress Penguasaan</span>
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-1.5">
                      <span className="text-foreground">Algorithms & ML</span>
                      <span className="text-primary font-extrabold">82%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "82%" }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Flashcard widget preview */}
                <div
                  onClick={() => setFlippedCard(!flippedCard)}
                  className="cursor-pointer p-4 rounded-xl border border-primary/40 bg-primary/5 hover:border-primary transition-all flex flex-col gap-2 relative group select-none shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs text-primary font-bold">
                    <span>⚡ AI Flashcard #1</span>
                    <span className="flex items-center gap-1 text-[10px] bg-primary/15 px-2 py-0.5 rounded font-bold">
                      <RotateCcw className="w-3 h-3 group-hover:rotate-180 transition-transform" /> Klik Putar
                    </span>
                  </div>
                  <div className="min-h-[76px] flex items-center justify-center text-center py-2">
                    <AnimatePresence mode="wait">
                      {!flippedCard ? (
                        <motion.p
                          key="front"
                          initial={{ rotateX: 90, opacity: 0 }}
                          animate={{ rotateX: 0, opacity: 1 }}
                          exit={{ rotateX: -90, opacity: 0 }}
                          className="font-bold text-sm text-foreground"
                        >
                          Apa itu <span className="text-primary">Random Forest</span> dalam Machine Learning?
                        </motion.p>
                      ) : (
                        <motion.p
                          key="back"
                          initial={{ rotateX: 90, opacity: 0 }}
                          animate={{ rotateX: 0, opacity: 1 }}
                          exit={{ rotateX: -90, opacity: 0 }}
                          className="font-semibold text-xs text-muted-foreground leading-relaxed"
                        >
                          Algoritma <strong className="text-foreground">Ensemble Learning</strong> yang menggabungkan banyak Decision Tree untuk meningkatkan akurasi & mengurangi overfit.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Right Panel: RAG Chat Simulation */}
              <div className="lg:col-span-8 flex flex-col h-full rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border text-xs font-bold text-foreground">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>AI Chat (RAG Engine dengan Kutipan Sumber)</span>
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto max-h-[280px] pr-1">
                  {/* User bubble */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm">
                      Jelaskan apa perbedaan utama Machine Learning dan Deep Learning berdasarkan dokumen ini!
                    </div>
                  </div>

                  {/* AI bubble */}
                  <div className="flex justify-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm text-primary-foreground font-bold text-xs">
                      AI
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-card border border-border px-4 py-3 text-sm text-foreground flex flex-col gap-2 shadow-sm">
                      <p className="leading-relaxed font-semibold">
                        Berdasarkan materi yang Anda unggah:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground font-medium text-xs sm:text-sm">
                        <li>
                          <strong className="text-foreground">Machine Learning</strong> membutuhkan rekayasa fitur manual (<em className="text-primary font-semibold">feature extraction</em>) sebelum diproses algoritma.
                        </li>
                        <li>
                          <strong className="text-foreground">Deep Learning</strong> menggunakan arsitektur jaringan saraf tiruan berlapisan (<em className="text-primary font-semibold">Deep Neural Network</em>) untuk mengekstrak pola kompleks secara otomatis langsung dari data mentah.
                        </li>
                      </ul>

                      {/* Citations */}
                      <div className="mt-2 pt-2 border-t border-border flex flex-wrap gap-2 items-center">
                        <span className="text-[11px] font-bold text-muted-foreground">Sumber Dokumen:</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                          <FileText className="w-3 h-3" /> Bab 2, Halaman 14
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-md">
                          <FileText className="w-3 h-3" /> Bab 2, Halaman 18
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input disabled bar inside mockup */}
                <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
                  <div className="flex-1 rounded-xl bg-card px-4 py-2.5 text-xs text-muted-foreground font-medium flex items-center justify-between border border-border shadow-inner">
                    <span>Tanyakan apa pun tentang dokumenmu...</span>
                    <span className="text-[10px] font-bold bg-primary/15 text-primary px-2.5 py-0.5 rounded">RAG Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

