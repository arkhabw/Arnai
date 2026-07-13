"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  BookOpen,
  FileText,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Copy,
  Check,
  ArrowRight,
  Download,
  Share2,
  Volume2,
  Filter,
  Layers,
  HelpCircle,
  Clock,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChapterSummary {
  id: string;
  chapterNumber: string;
  title: string;
  readTime: string;
  chunksUsed: number;
  overview: string;
  keyPoints: string[];
  markdownDetail: string;
  examWeight: string; // e.g. "Tinggi (85% peluang keluar)"
}

const demoChapters: ChapterSummary[] = [
  {
    id: "chap-1",
    chapterNumber: "Bab 2.1",
    title: "Supervised vs Unsupervised Learning & Karakteristik Data",
    readTime: "3 Menit",
    chunksUsed: 12,
    examWeight: "🔥 Tinggi (90% Peluang Ujian)",
    overview:
      "Membedakan paradigma pembelajaran mesin berdasar ketersediaan label target (Ground Truth) dan pola eksplorasi struktur data tersembunyi.",
    keyPoints: [
      "Supervised Learning membutuhkan pasangan input-output (x, y) untuk melatih bobot model secara regresif atau klasifikatif.",
      "Unsupervised Learning mencari pola intrinsik, klasterisasi, atau reduksi dimensi dari data tanpa label y (misal K-Means, PCA).",
      "Kualitas model sangat ditentukan oleh keberagaman, kebersihan, serta ketiadaan bias dalam dataset pelatihan.",
    ],
    markdownDetail: `### 🎯 Eksplorasi Mendalam Bab 2.1

Dalam ekosistem *Machine Learning*, pemisahan antara **Supervised** dan **Unsupervised** ditentukan oleh fungsi tujuan (*Objective Function*):

#### 1. Supervised Learning (Pembelajaran Terbimbing)
Model memetakan ruang fitur \\(X\\) ke ruang label \\(Y\\).
- **Regresi**: Memprediksi variabel kontinu (*contoh: memprediksi harga saham atau suhu ruangan*).
- **Klasifikasi**: Memprediksi kelas diskrit (*contoh: mendeteksi email spam vs non-spam, diagnosis tumor jinak vs ganas*).

#### 2. Unsupervised Learning (Pembelajaran Tak Terbimbing)
Model bekerja hanya dengan matriks input \\(X\\) untuk menemukan struktur tersembunyi:
\`\`\`python
# Contoh klasterisasi data tanpa label dengan K-Means
from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(X_unlabeled)
\`\`\`

> [!IMPORTANT]
> **Poin Kunci Ujian**: Dosen sering menanyakan mengapa clustering tidak bisa diukur akurasinya menggunakan *Confusion Matrix* biasa (Jawabannya: karena tidak ada *Ground Truth label y*).`,
  },
  {
    id: "chap-2",
    chapterNumber: "Bab 2.2",
    title: "Fungsi Kerugian (Loss Functions) & Evaluasi Kesalahan",
    readTime: "4 Menit",
    chunksUsed: 14,
    examWeight: "🔥 Sangat Tinggi (95% Peluang Ujian)",
    overview:
      "Menganalisis formulasi matematika fungsi kerugian seperti Mean Squared Error (MSE) untuk regresi dan Cross-Entropy untuk klasifikasi probabilitasi.",
    keyPoints: [
      "Loss function J(θ) mengukur jarak matematis antara vektor prediksi model h(x) dengan vektor target asli y.",
      "MSE (L2 Loss) sangat sensitif terhadap data pencilan (outliers) karena pengkuadratan selisih kesalahan.",
      "Cross-Entropy Loss (Log Loss) mengukur divergensi distribusi probabilitas pada model klasifikasi seperti Logistic Regression.",
    ],
    markdownDetail: `### 🧮 Analisis Matematis Bab 2.2

Pemilihan *Loss Function* menentukan bagaimana permukaan landasan gradien (*Loss Landscape*) bentukan model:

#### 1. Mean Squared Error (MSE) - Regresi
\\[ J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} \\left( h_\\theta(x^{(i)}) - y^{(i)} \\right)^2 \\]
Kelebihan MSE adalah memiliki turunan pertama yang kontinu dan halus (*smooth derivative*), mempermudah optimasi.

#### 2. Binary Cross-Entropy - Klasifikasi
\\[ J(\\theta) = -\\frac{1}{m} \\sum_{i=1}^{m} \\left[ y^{(i)} \\log(h_\\theta(x^{(i)})) + (1 - y^{(i)}) \\log(1 - h_\\theta(x^{(i)})) \\right] \\]

| Loss Function | Kasus Penggunaan Terbaik | Kelemahan Utama |
| :--- | :--- | :--- |
| **MSE (L2)** | Regresi kontinu umum | Sangat rentan terhadap outlier |
| **MAE (L1)** | Regresi dengan banyak pencilan | Turunan tidak mulus di titik 0 |
| **Cross-Entropy** | Klasifikasi probabilitas 0-1 | Memerlukan kalibrasi softmax/sigmoid |`,
  },
  {
    id: "chap-3",
    chapterNumber: "Bab 2.3",
    title: "Optimasi Gradient Descent & Penyesuaian Learning Rate",
    readTime: "5 Menit",
    chunksUsed: 16,
    examWeight: "⭐ Sedang - Tinggi (80% Peluang Ujian)",
    overview:
      "Membahas algoritma optimasi bobot model dengan menyusuri kemiringan gradien berlawanan arah untuk mencapai minimum global/lokal.",
    keyPoints: [
      "Learning Rate (α) mengontrol langkah iterasi: terlalu kecil membuat training lambat, terlalu besar menyebabkan overshoot dan gagal konvergen.",
      "Batch Gradient Descent menghitung gradien dari seluruh dataset sekaligus setiap langkah iterasi.",
      "Stochastic Gradient Descent (SGD) memperbarui bobot per sampel Tunggal, lebih cepat namun varians lintas langkahnya tinggi.",
    ],
    markdownDetail: `### ⚡ Mekanisme Optimasi Bab 2.3

Pembaruan bobot (*Weight Update Rule*) pada Gradient Descent dirumuskan sebagai:
\\[ \\theta_j := \\theta_j - \\alpha \\frac{\\partial}{\\partial \\theta_j} J(\\theta) \\]

#### Simulasi Perbandingan Algoritma Optimasi:
\`\`\`python
# Pseudocode perbandingan strategi update
if strategy == "Batch":
    grad = compute_total_gradient(all_data)
    weights -= alpha * grad
elif strategy == "SGD":
    for sample in random_shuffle(all_data):
        grad = compute_sample_gradient(sample)
        weights -= alpha * grad
\`\`\`

> [!TIP]
> **Tips Belajar Cepat**: Gunakan jembatan keledai **"B-S-M"** (Batch = Semua data, Stochastic = Satu data, Mini-batch = Sebagian data). Mini-batch adalah standar industri deep learning saat ini!`,
  },
];

export default function SummaryPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"summary" | "highlights">("summary");
  const [expandedChapter, setExpandedChapter] = useState<string>("chap-2"); // default open chapter 2
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentUser = user || {
    id: "usr-guest",
    name: "Pelajar Tamu",
    email: "tamu@arnai.ai",
    avatar: "",
    role: "Guest Account",
    isDemo: true,
    provider: "demo" as const,
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const simulateReadAloud = () => {
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 4000);
  };

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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-2 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" /> Sorotan Cerdas & Rangkuman Bab
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Ringkasan Otomatis & Breakdown Bab
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 max-w-2xl">
                Dihasilkan dari analisis 42 Vector Chunks pada **Machine_Learning_Bab2.pdf**. AI menyusun intisari materi, rumus krusial, dan bobot probabilitas ujian untuk efisiensi belajar maksimal.
              </p>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={simulateReadAloud}
                className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold transition-all flex items-center gap-2 ${
                  isSpeaking
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500 animate-pulse"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? "🔊 AI Sedang Membaca..." : "🔊 Dengarkan Audio Bab"}</span>
              </button>

              <Link
                href="/study/highlights"
                className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>🎨 Lihat Color-Coded Highlights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Link
              href="/study/summary"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-sm flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Ringkasan Per Bab
            </Link>
            <Link
              href="/study/highlights"
              className="px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground font-extrabold text-xs transition-colors flex items-center gap-2 border border-border"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> Color-Coded Highlights
            </Link>
          </div>

          {/* Chapters Accordion Section */}
          <div className="space-y-4">
            {demoChapters.map((chap) => {
              const isExpanded = expandedChapter === chap.id;
              return (
                <motion.div
                  key={chap.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-3xl border border-border overflow-hidden shadow-lg transition-all"
                >
                  {/* Chapter Header */}
                  <div
                    onClick={() => setExpandedChapter(isExpanded ? "" : chap.id)}
                    className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="min-w-[76px] h-12 px-3 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-xs sm:text-sm border border-primary/20 whitespace-nowrap text-center shadow-inner">
                        {chap.chapterNumber}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                            ⏱️ {chap.readTime} Baca
                          </span>
                          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                            📑 {chap.chunksUsed} Chunks Vektor
                          </span>
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {chap.examWeight}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                          {chap.title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium mt-1 line-clamp-1">
                          {chap.overview}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyText(`${chap.title}\n\n${chap.overview}\n\nPoin Kunci:\n- ${chap.keyPoints.join("\n- ")}`, chap.id);
                        }}
                        className="p-2 rounded-xl bg-secondary/80 hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-colors border border-border"
                        title="Salin ringkasan bab ini"
                      >
                        {copiedId === chap.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground border border-border">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border/80 bg-secondary/20 p-6 sm:p-8 space-y-6"
                      >
                        {/* Key Points Checklist */}
                        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                            <Zap className="w-4 h-4" /> 3 Intisari Terpenting Bab Ini:
                          </h4>
                          <div className="space-y-2">
                            {chap.keyPoints.map((pt, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-foreground">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 font-black text-[11px] mt-0.5">
                                  ✓
                                </span>
                                <span className="leading-relaxed">{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Detailed Markdown Analysis with Formulas */}
                        <div className="prose prose-sm dark:prose-invert max-w-none bg-card/60 p-6 rounded-2xl border border-border text-xs sm:text-sm leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{chap.markdownDetail}</ReactMarkdown>
                        </div>

                        {/* Quick CTA row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="text-xs text-muted-foreground font-medium">
                            Ingin memperdalam bab ini atau minta contoh soal latihan?
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/chat?doc=Machine_Learning_Bab2.pdf&query=${encodeURIComponent("Tolong jelaskan lebih lanjut mengenai " + chap.title)}`}
                              className="px-4 py-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-extrabold transition-all border border-border flex items-center gap-1.5 shadow-sm"
                            >
                              <span>💬 Tanya AI tentang Bab Ini</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                            <Link
                              href="/study/flashcards"
                              className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-extrabold transition-all border border-primary/20 flex items-center gap-1.5 shadow-sm"
                            >
                              <Layers className="w-3.5 h-3.5" /> Latih Flashcard Bab Ini
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
