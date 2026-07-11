"use client";

import React from "react";
import { motion } from "framer-motion";
import { LogIn, UploadCloud, Cpu, Sparkles } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    step: "01",
    title: "Masuk / Buat Akun",
    desc: "Daftar gratis atau masuk dengan Akun Demo khusus (Seed Data siap pakai) dalam 1 klik tanpa ribet.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: UploadCloud,
    step: "02",
    title: "Unggah Materi Belajar",
    desc: "Drag & drop file PDF kuliah, PPT presentasi, DOCX tugas, atau catatan teks ke dalam workspace Arnai.",
    color: "from-indigo-500 to-cyan-500",
  },
  {
    icon: Cpu,
    step: "03",
    title: "AI Memproses & Chunking",
    desc: "Sistem RAG membagi dokumen menjadi vector chunks berkualitas tinggi, siap dicari & dianalisis secara akurat.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Sparkles,
    step: "04",
    title: "Belajar & Kuasai Materi",
    desc: "Chat dengan AI, putar Flashcard 3D, uji pemahaman lewat Kuis, atau jelajahi Mindmap interaktif!",
    color: "from-blue-600 to-sky-500",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Alur Kerja Sederhana
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Cara Kerja <span className="text-primary">Arnai AI</span>
          </p>
          <p className="text-muted-foreground font-medium text-base sm:text-lg">
            Dari dokumen mentah menjadi penguasaan materi mendalam hanya dalam 4 langkah cepat dan otomatis.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-border -translate-y-6 -z-10" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between relative group hover:border-primary/50 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} p-0.5 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <span className="font-mono text-3xl font-extrabold text-muted-foreground/30 group-hover:text-primary transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Langkah {index + 1} Selesai</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
