"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquareText,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  Network,
  Highlighter,
  BarChart3,
  Clock,
  Trophy,
  Crown,
  FileText,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: MessageSquareText,
    title: "AI Chat (Interactive RAG with Citations)",
    description:
      "Tanyakan apa saja seputar materi PDF/DOCX yang Anda unggah. AI menjawab akurat beserta referensi nomor bab & halaman pasti, lengkap dengan fallback cerdas untuk penelusuran tambahan.",
    badge: "Fitur Utama",
    gradient: "from-blue-600 to-indigo-600",
    colSpan: "lg:col-span-2",
  },
  {
    icon: Layers,
    title: "Flashcard Generator 3D & SRS",
    description:
      "AI menghasilkan ratusan flashcard bolak-balik dalam hitungan detik. Dilengkapi sistem Spaced Repetition (Mudah, Sedang, Sulit) untuk hafalan permanen.",
    badge: "Otomatis",
    gradient: "from-indigo-600 to-blue-500",
    colSpan: "lg:col-span-1",
  },
  {
    icon: HelpCircle,
    title: "Quiz Generator (Multiple Choice & Esai)",
    description:
      "Buat soal kuis berganda atau esai secara otomatis. Sistem memberikan nilai langsung, koreksi esai AI, dan pembahasan mendalam untuk setiap nomor.",
    badge: "Pembahasan AI",
    gradient: "from-cyan-600 to-blue-600",
    colSpan: "lg:col-span-1",
  },
  {
    icon: Network,
    title: "Mindmap Generator Interaktif",
    description:
      "Ubah materi teks yang rumit menjadi peta konsep hierarkis visual yang bisa di-zoom, digeser, dan dieksplorasi setiap cabang idenya.",
    badge: "Visual Canvas",
    gradient: "from-emerald-600 to-teal-600",
    colSpan: "lg:col-span-2",
  },
  {
    icon: FileSpreadsheet,
    title: "Ringkasan Bab Otomatis",
    description:
      "Materi 100 halaman langsung diringkas rapi menjadi poin-poin terstruktur mulai dari Bab 1, Bab 2, hingga Kesimpulan esensial.",
    badge: "Smart Summary",
    gradient: "from-amber-600 to-orange-600",
    colSpan: "lg:col-span-1",
  },
  {
    icon: Highlighter,
    title: "Smart Color-Coded Highlights",
    description:
      "AI menandai bagian paling penting dengan warna khusus: Definisi (Kuning), Rumus (Oranye), Sering Keluar Ujian (Merah), dan Contoh (Biru).",
    badge: "High Yield",
    gradient: "from-blue-600 to-cyan-600",
    colSpan: "lg:col-span-1",
  },
  {
    icon: BarChart3,
    title: "Study Analytics & Progress Belajar",
    description:
      "Pantau grafik waktu belajar mingguan, jumlah kuis selesai, serta persentase penguasaan di setiap mata pelajaran (AI, Database, Jaringan).",
    badge: "Analytics",
    gradient: "from-blue-500 to-indigo-600",
    colSpan: "lg:col-span-1",
  },
  {
    icon: Clock,
    title: "Pomodoro Study Timer",
    description:
      "Sesi fokus 25 menit dengan istirahat 5 menit terintegrasi langsung ke dalam catatan log waktu belajar harian Anda.",
    badge: "Fokus Maksimal",
    gradient: "from-red-600 to-rose-600",
    colSpan: "lg:col-span-1",
  },
  {
    icon: Trophy,
    title: "Gamification & Achievements Badge",
    description:
      "Raih penghargaan lencana seperti Belajar 7 Hari Streak, Quiz Master, hingga Flashcard Expert untuk menjaga semangat belajar terus membara.",
    badge: "Gamified",
    gradient: "from-yellow-500 to-amber-600",
    colSpan: "lg:col-span-1",
  },
  {
    icon: Crown,
    title: "Class Leaderboard & Multi-Format Upload",
    description:
      "Dukung dokumen PDF, PPTX, DOCX, TXT, gambar PNG/JPG, serta papan peringkat interaktif untuk motivasi belajar bersama teman maupun kelas.",
    badge: "Multi-Format",
    gradient: "from-indigo-600 to-blue-700",
    colSpan: "lg:col-span-1",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> 15 Modul Super Lengkap
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Semua Fitur yang Anda Butuhkan <br />
            <span className="text-primary font-black">Dalam Satu Platform</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            Tidak perlu pindah-pindah aplikasi lagi. Dari pembaca dokumen sampai pengujian kuis, semuanya ada di sini.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-primary/50 transition-all duration-300 relative overflow-hidden ${item.colSpan}`}
              >
                {/* Background glow hover effect */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-secondary text-primary border border-border">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-primary group-hover:opacity-100 transition-opacity">
                  <span>Siap Digunakan</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
