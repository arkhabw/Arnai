"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import {
  Sparkles,
  BookOpen,
  FileText,
  User as UserIcon,
  LogOut,
  Bookmark,
  Copy,
  Check,
  ArrowRight,
  Download,
  Filter,
  Layers,
  HelpCircle,
  Zap,
  Tag,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HighlightItem {
  id: string;
  category: "definition" | "formula" | "exam" | "case";
  categoryName: string;
  badgeColor: string;
  borderColor: string;
  bgColor: string;
  snippet: string;
  aiNote: string;
  page: string;
  chapter: string;
  isBookmarked?: boolean;
}

const initialHighlights: HighlightItem[] = [
  {
    id: "hl-1",
    category: "definition",
    categoryName: "🟢 Definisi & Konsep Dasar",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    borderColor: "border-emerald-500/30 hover:border-emerald-500/60",
    bgColor: "bg-emerald-500/5",
    snippet:
      "Supervised learning adalah pendekatan pembelajaran mesin di mana algoritma dilatih menggunakan pasangan dataset input x dan label target y yang telah diverifikasi oleh pakar manusia (Ground Truth).",
    aiNote:
      "Inti dari supervised learning adalah meminimalkan kesalahan antara fungsi estimasi model dengan label sebenarnya melalui supervisi langsung.",
    page: "Halaman 14",
    chapter: "Bab 2.1",
    isBookmarked: true,
  },
  {
    id: "hl-2",
    category: "formula",
    categoryName: "🔵 Rumus & Algoritma",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    borderColor: "border-blue-500/30 hover:border-blue-500/60",
    bgColor: "bg-blue-500/5",
    snippet: "J(θ) = (1 / 2m) * Σ [ h_θ(x^(i)) - y^(i) ]^2",
    aiNote:
      "Rumus Mean Squared Error (MSE) untuk regresi linier. Angka 2m di penyebut digunakan untuk mempermudah turunan parsial gradien (angka 2 akan dicoret dengan pangkat 2 saat diturunkan).",
    page: "Halaman 16",
    chapter: "Bab 2.2",
  },
  {
    id: "hl-3",
    category: "exam",
    categoryName: "🟡 Poin Pasti Keluar Ujian",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    borderColor: "border-amber-500/30 hover:border-amber-500/60",
    bgColor: "bg-amber-500/5",
    snippet:
      "Perbedaan mendasar antara Batch Gradient Descent dan Stochastic Gradient Descent (SGD) terletak pada frekuensi pembaruan bobot dan penggunaan memori komputasi saat melatih jutaan data.",
    aiNote:
      "⚠️ Sering keluar di pilihan ganda UTS: Ingat bahwa Batch GD menghitung seluruh dataset untuk 1 kali update bobot (stabil tapi lambat), sedangkan SGD menghitung 1 sampel per update bobot (cepat tapi fluktuatif).",
    page: "Halaman 18",
    chapter: "Bab 2.3",
    isBookmarked: true,
  },
  {
    id: "hl-4",
    category: "case",
    categoryName: "🟣 Studi Kasus & Penerapan",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    borderColor: "border-purple-500/30 hover:border-purple-500/60",
    bgColor: "bg-purple-500/5",
    snippet:
      "Penerapan fungsi Logistic Regression pada sistem deteksi penipuan transaksi kartu kredit (Credit Card Fraud Detection) di perbankan secara real-time.",
    aiNote:
      "Model memuntahkan probabilitas P(y=1|x) antara 0 hingga 1. Jika P > 0.5 (threshold), sistem otomatis memblokir transaksi curang dalam hitungan milidetik.",
    page: "Halaman 22",
    chapter: "Bab 2.4",
  },
  {
    id: "hl-5",
    category: "definition",
    categoryName: "🟢 Definisi & Konsep Dasar",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    borderColor: "border-emerald-500/30 hover:border-emerald-500/60",
    bgColor: "bg-emerald-500/5",
    snippet:
      "Overfitting terjadi ketika model menghafal bising (noise) pada data pelatihan sehingga memiliki akurasi 99% pada train set namun gagal total (akurasi rendah) pada test set baru.",
    aiNote:
      "Solusi utama mengatasi overfitting: Regularisasi (L1/L2), Dropout layer, Cross-Validation, dan menambah jumlah data pelatihan.",
    page: "Halaman 24",
    chapter: "Bab 2.5",
  },
  {
    id: "hl-6",
    category: "exam",
    categoryName: "🟡 Poin Pasti Keluar Ujian",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    borderColor: "border-amber-500/30 hover:border-amber-500/60",
    bgColor: "bg-amber-500/5",
    snippet:
      "Mengapa K-Means Clustering wajib diawali dengan normalisasi atau standardisasi fitur menggunakan Z-Score Scaler sebelum menghitung jarak Euclidean?",
    aiNote:
      "Karena jarak Euclidean sangat sensitif terhadap perbedaan skala unit variabel (misal variabel Umur 0-100 tahun dibandingkan dengan variabel Gaji 0-100.000.000 rupiah).",
    page: "Halaman 27",
    chapter: "Bab 2.6",
    isBookmarked: true,
  },
];

export default function HighlightsPage() {
  const { user, logout } = useAuth();
  const [highlights, setHighlights] = useState<HighlightItem[]>(initialHighlights);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentUser = user || {
    id: "usr-guest",
    name: "Pelajar Tamu",
    email: "tamu@arnai.ai",
    avatar: "",
    role: "Guest Account",
    isDemo: true,
    provider: "demo" as const,
  };

  const toggleBookmark = (id: string) => {
    setHighlights((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item))
    );
  };

  const copyHighlight = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHighlights = highlights.filter((h) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "bookmarked") return h.isBookmarked;
    return h.category === selectedFilter;
  });

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
                Sorotan Kunci & Poin Ujian
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 max-w-2xl">
                Sistem AI mengekstrak kalimat-kalimat paling penting dari **Machine_Learning_Bab2.pdf** dan mengklasifikasikannya berdasarkan warna prioritas kognitif.
              </p>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <Link
                href="/study/summary"
                className="px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground text-xs font-extrabold transition-all flex items-center gap-1.5 border border-border"
              >
                <BookOpen className="w-4 h-4" />
                <span>Lihat Ringkasan Bab</span>
              </Link>

              <Link
                href="/study/quizzes"
                className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <HelpCircle className="w-4 h-4" />
                <span>⚡ Uji Saya dengan Kuis dari Highlight Ini</span>
              </Link>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Link
              href="/study/summary"
              className="px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground font-extrabold text-xs transition-colors flex items-center gap-2 border border-border"
            >
              <BookOpen className="w-4 h-4" /> Ringkasan Per Bab
            </Link>
            <Link
              href="/study/highlights"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Color-Coded Highlights
            </Link>
          </div>

          {/* Color Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter Warna:
            </span>
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                selectedFilter === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-secondary/60 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Semua ({highlights.length})
            </button>
            <button
              onClick={() => setSelectedFilter("bookmarked")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1 ${
                selectedFilter === "bookmarked"
                  ? "bg-amber-500 text-black border-amber-400 shadow-sm"
                  : "bg-secondary/60 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              ⭐ Ditandai ({highlights.filter((h) => h.isBookmarked).length})
            </button>
            <button
              onClick={() => setSelectedFilter("definition")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                selectedFilter === "definition"
                  ? "bg-emerald-500 text-black border-emerald-400 shadow-sm"
                  : "bg-secondary/60 text-emerald-500 border-border hover:bg-emerald-500/10"
              }`}
            >
              🟢 Definisi ({highlights.filter((h) => h.category === "definition").length})
            </button>
            <button
              onClick={() => setSelectedFilter("formula")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                selectedFilter === "formula"
                  ? "bg-blue-500 text-white border-blue-400 shadow-sm"
                  : "bg-secondary/60 text-blue-400 border-border hover:bg-blue-500/10"
              }`}
            >
              🔵 Rumus ({highlights.filter((h) => h.category === "formula").length})
            </button>
            <button
              onClick={() => setSelectedFilter("exam")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                selectedFilter === "exam"
                  ? "bg-amber-500 text-black border-amber-400 shadow-sm"
                  : "bg-secondary/60 text-amber-400 border-border hover:bg-amber-500/10"
              }`}
            >
              🟡 Poin Ujian ({highlights.filter((h) => h.category === "exam").length})
            </button>
            <button
              onClick={() => setSelectedFilter("case")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                selectedFilter === "case"
                  ? "bg-purple-500 text-white border-purple-400 shadow-sm"
                  : "bg-secondary/60 text-purple-400 border-border hover:bg-purple-500/10"
              }`}
            >
              🟣 Studi Kasus ({highlights.filter((h) => h.category === "case").length})
            </button>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredHighlights.map((hl) => (
                <motion.div
                  key={hl.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`rounded-3xl border ${hl.borderColor} ${hl.bgColor} p-6 shadow-md flex flex-col justify-between transition-all space-y-4`}
                >
                  <div>
                    {/* Badge header */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-black border ${hl.badgeColor}`}>
                        {hl.categoryName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-muted-foreground bg-card px-2.5 py-1 rounded-lg border border-border">
                          {hl.chapter} • {hl.page}
                        </span>
                        <button
                          onClick={() => toggleBookmark(hl.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            hl.isBookmarked
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                              : "bg-card text-muted-foreground border-border hover:text-foreground"
                          }`}
                          title={hl.isBookmarked ? "Hapus tanda" : "Tandai penting"}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Source Snippet */}
                    <div className="p-4 rounded-2xl bg-card/80 border border-border/80 font-mono text-xs text-foreground font-bold leading-relaxed mb-3 shadow-inner">
                      "{hl.snippet}"
                    </div>

                    {/* AI Note / Synthesis */}
                    <div className="text-xs text-muted-foreground font-medium leading-relaxed flex items-start gap-2">
                      <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Sintesis AI Arnai:</strong> {hl.aiNote}
                      </div>
                    </div>
                  </div>

                  {/* Card footer CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <button
                      onClick={() => copyHighlight(`[Highlight ${hl.chapter} - ${hl.page}]\n"${hl.snippet}"\n\nCatatan AI: ${hl.aiNote}`, hl.id)}
                      className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                    >
                      {copiedId === hl.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-emerald-500 font-extrabold">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Salin Highlight
                        </>
                      )}
                    </button>

                    <Link
                      href={`/chat?doc=Machine_Learning_Bab2.pdf&query=${encodeURIComponent("Tolong jelaskan lebih detail tentang highlight ini: " + hl.snippet)}`}
                      className="px-3 py-1.5 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground text-xs font-extrabold transition-all border border-border flex items-center gap-1 shadow-sm"
                    >
                      <span>Tanya AI</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
