"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "Apa itu Arnai dan bagaimana cara kerjanya?",
    answer:
      "Arnai adalah platform belajar cerdas berteknologi AI yang menggabungkan fitur pencatatan (Notion), flashcard (Quizlet), asisten AI pintar (ChatGPT), serta pelacakan kurikulum interaktif (Coursera). Anda cukup mengunggah materi pelajaran Anda (PDF, PPTX, DOCX, TXT, atau gambar catatan), dan AI akan memecah, mempelajari, serta siap diajak berdiskusi atau menghasilkan latihan kuis dan flashcard secara instan.",
  },
  {
    question: "Apakah AI hanya menjawab dari dokumen yang saya unggah?",
    answer:
      "Ya! Fitur utama AI Chat menggunakan alur RAG (Retrieval-Augmented Generation) di mana AI memprioritaskan jawaban akurat berdasarkan isi dokumen Anda beserta kutipan nomor bab/halamannya. Jika informasi yang Anda tanyakan tidak terdapat dalam dokumen, AI secara transparan akan bertanya apakah Anda ingin penjelasan dari pengetahuan umum AI atau web search.",
  },
  {
    question: "Format file apa saja yang didukung oleh Arnai?",
    answer:
      "Arnai mendukung beragam format file populer seperti PDF (.pdf), Microsoft PowerPoint (.pptx), Microsoft Word (.docx), file teks murni (.txt), serta gambar foto catatan (.png/.jpg) berkat pemrosesan OCR dan multimodal AI.",
  },
  {
    question: "Bagaimana keamanan dokumen materi yang saya unggah?",
    answer:
      "Dokumen materi Anda diproses di lingkungan yang aman dan dipisahkan per ruang kerja pengguna (isolated workspace). Vektor embedding disimpan dalam vector database dengan enkripsi standar industri, sehingga materi pribadi Anda tidak akan pernah bercampur atau diakses oleh pengguna lain.",
  },
  {
    question: "Apakah saya bisa mencoba tanpa harus mengunggah dokumen dulu?",
    answer:
      "Tentu saja! Arnai menyediakan mode 'Preview Dashboard / Quick Demo Login' di mana Anda bisa langsung mencoba simulasi chat RAG, kuis pilihan ganda & esai, flashcards 3D, hingga grafik analitik mingguan menggunakan data contoh yang telah kami siapkan.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Pertanyaan yang Sering <span className="gradient-text">Diajukan</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Temukan jawaban lengkap tentang cara kerja, keamanan materi, dan kecanggihan AI Arnai.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? "border-primary/50 bg-secondary/30" : "border-border/80 hover:border-border"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none"
                >
                  <span className="font-bold text-base sm:text-lg text-foreground">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-primary text-primary-foreground border-primary" : "text-muted-foreground"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/40">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Support Banner */}
        <div className="mt-16 p-8 rounded-2xl glass-card text-center flex flex-col sm:flex-row items-center justify-between gap-6 border border-indigo-500/30">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Masih punya pertanyaan lainnya?</h3>
              <p className="text-sm text-muted-foreground">Tim dukungan kami siap membantu Anda 24/7.</p>
            </div>
          </div>
          <a
            href="mailto:support@arnai.ai"
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-colors whitespace-nowrap shadow-md shadow-indigo-500/20"
          >
            Hubungi Support
          </a>
        </div>
      </div>
    </section>
  );
}
