"use client";

import React from "react";
import { motion } from "framer-motion";
import { LogIn, UploadCloud, Cpu, Award } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    title: "1. Masuk / Daftar Akun",
    description: "Login cepat dengan akun Google atau email untuk mengakses workspace belajarmu yang tersinkronisasi.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: UploadCloud,
    title: "2. Unggah Materi Pelajaran",
    description: "Dukung berbagai format dokumen seperti PDF, PPTX, DOCX, TXT, maupun catatan foto (PNG/JPG).",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Cpu,
    title: "3. AI Memproses & Chunking",
    description: "Sistem cerdas memecah isi materi menjadi vektor, membuat embedding, dan menyimpannya ke vector database.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Award,
    title: "4. Belajar interaktif & Track Progres",
    description: "Tanyakan apa saja ke AI, buat kuis, latih flashcards, amati mindmap, dan capai target analitik harianmu!",
    color: "from-pink-500 to-rose-500",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest uppercase text-indigo-400 mb-3">
            Alur Kerja Cerdas
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Cara Kerja <span className="gradient-text">Arnai AI</span>
          </p>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Dari dokumen biasa menjadi pengalaman belajar super interaktif hanya dalam 4 langkah mudah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 -translate-y-6 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative z-10 glass-card rounded-2xl p-6 sm:p-8 flex flex-col items-start gap-4 hover:border-primary/50 transition-all duration-300 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
