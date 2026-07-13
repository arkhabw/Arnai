"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import confetti from "canvas-confetti";
import {
  Layers,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
  ArrowRight,
  ArrowLeft,
  User as UserIcon,
  LogOut,
  Zap,
  BookOpen,
  Trophy,
  Filter,
  Eye,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FlashcardItem {
  id: string;
  category: "Konsep Dasar" | "Rumus Matematika" | "Studi Kasus" | "Poin Ujian";
  badgeColor: string;
  front: string;
  hint: string;
  back: string;
  citation: string;
  memoryTrick?: string;
  srsLevel: "new" | "easy" | "medium" | "hard";
  nextReview?: string;
}

const initialDecks: Record<string, { title: string; subtitle: string; cards: FlashcardItem[] }> = {
  ml_bab2: {
    title: "📦 Machine Learning Bab 2: Supervised & Optimasi",
    subtitle: "12 Kartu • Disintesis dari Machine_Learning_Bab2.pdf",
    cards: [
      {
        id: "fc-1",
        category: "Konsep Dasar",
        badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        front: "Apa perbedaan mendasar antara Supervised Learning dan Unsupervised Learning dalam hal dataset yang digunakan?",
        hint: "Ingat kata kunci 'Ground Truth' atau pasangan (x, y).",
        back: "Supervised Learning memerlukan dataset yang memiliki label target (x, y) untuk melatih bobot model. Sedangkan Unsupervised Learning bekerja pada data tanpa label (x saja) untuk menemukan struktur, klaster, atau pola tersembunyi.",
        citation: "Bab 2.1 - Halaman 14",
        memoryTrick: "💡 Jembatan Keledai: Supervised = Ada Dosen/Label membimbing; Unsupervised = Mahasiswa mandiri eksplorasi sendiri.",
        srsLevel: "new",
      },
      {
        id: "fc-2",
        category: "Rumus Matematika",
        badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        front: "Tuliskan atau sebutkan rumus Mean Squared Error (MSE) yang digunakan sebagai Loss Function pada Regresi Linier!",
        hint: "Ada selisih kuadrat antara h_θ(x) dengan y, dibagi oleh 2m.",
        back: "J(θ) = (1 / 2m) * Σ_{i=1 to m} [ h_θ(x^(i)) - y^(i) ]^2\n\nAngka 2m di penyebut sengaja digunakan agar saat diturunkan terhadap θ, angka pangkat 2 akan membagi habis 2 di bawahnya sehingga turunan gradiennya lebih rapi.",
        citation: "Bab 2.2 - Halaman 16",
        memoryTrick: "💡 Tips Matematika: Selalu ingat MSE = Rata-rata dari (Prediksi dikurang Kenyataan) dikuadratkan.",
        srsLevel: "new",
      },
      {
        id: "fc-3",
        category: "Poin Ujian",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        front: "Mengapa Learning Rate (α) yang terlalu besar bisa menyebabkan model gagal konvergen (overshoot)?",
        hint: "Bayangkan menuruni lembah dengan langkah raksasa.",
        back: "Karena langkah pembaruan bobot terlalu jauh melompati titik minimum global lembah loss function (J(θ)). Akibatnya, nilai loss bukannya menurun melainkan melambung naik ke kedua sisi tebing (Divergensi).",
        citation: "Bab 2.3 - Halaman 18",
        memoryTrick: "💡 Analogi: Seperti menaiki tangga dengan melompati 5 anak tangga sekaligus—pasti tergelincir ke bawah.",
        srsLevel: "new",
      },
      {
        id: "fc-4",
        category: "Poin Ujian",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        front: "Apa perbedaan antara Batch Gradient Descent, Stochastic Gradient Descent (SGD), dan Mini-batch Gradient Descent?",
        hint: "Gunakan jembatan keledai frekuensi data: Semua vs Satu vs Sebagian.",
        back: "1. Batch GD: Menghitung gradien dari seluruh data N untuk 1 kali update bobot (sangat stabil tapi lambat & berat di RAM).\n2. SGD: Menghitung gradien dari 1 sampel tunggal per update (cepat tapi sangat fluktuatif/berisik).\n3. Mini-batch GD: Menghitung sebagian batch (misal 32 atau 64 sampel) per update (keseimbangan optimal, standar deep learning saat ini).",
        citation: "Bab 2.4 - Halaman 19",
        memoryTrick: "💡 Singkatan Cepat: BSM = Batch (Semua), Stochastic (Satu), Mini-batch (Sebagian).",
        srsLevel: "new",
      },
      {
        id: "fc-5",
        category: "Studi Kasus",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        front: "Mengapa algoritma clustering K-Means wajib diawali dengan tahap normalisasi fitur (Z-Score Scaler)?",
        hint: "Perhatikan perhitungan jarak Euclidean antara variabel berlainan skala.",
        back: "Karena K-Means menggunakan perhitungan jarak Euclidean. Jika satu fitur berskala besar (misal Gaji 0 - 100.000.000) dan fitur lain berskala kecil (misal Usia 0 - 100), fitur skala besar akan mendominasi perhitungan jarak sepenuhnya, membuat kluster menjadi bias.",
        citation: "Bab 2.6 - Halaman 27",
        memoryTrick: "💡 Prinsip Emas: Jarak Euclidean = Wajib Normalisasi terlebih dahulu agar adil (Equal Weights).",
        srsLevel: "new",
      },
    ],
  },
  db_sys: {
    title: "📦 Database System: Normalisasi 1NF-3NF & ACID",
    subtitle: "10 Kartu • Disintesis dari Database_System_Design.pdf",
    cards: [
      {
        id: "fc-db-1",
        category: "Konsep Dasar",
        badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        front: "Sebutkan dan jelaskan kepanjangan dari 4 pilar prinsip transaksi ACID pada basis data relasional!",
        hint: "A (Atomicity), C (Consistency), I (Isolation), D (Durability).",
        back: "1. Atomicity: Transaksi tuntas semua atau batal semua (All-or-Nothing).\n2. Consistency: Transaksi menjaga konsistensi skema dan batasan integritas.\n3. Isolation: Transaksi konkuren dijalankan terisolasi tanpa saling mengganggu.\n4. Durability: Hasil transaksi yang sukses tersimpan permanen di non-volatile storage.",
        citation: "Bab 4 - Halaman 42",
        memoryTrick: "💡 Jembatan Keledai: ACID = Atomisitas, Konsistensi, Isolasi, Durabilitas (Pilar Bank Anti-Rugi).",
        srsLevel: "new",
      },
      {
        id: "fc-db-2",
        category: "Poin Ujian",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        front: "Apa syarat mutlak sebuah tabel basis data memenuhi Normal Form Ketiga (3NF)?",
        hint: "Memenuhi 2NF plus tidak boleh ada ketergantungan transitif.",
        back: "Tabel harus memenuhi semua syarat 2NF dan TIDAK BOLEH memiliki ketergantungan transitif (Transitive Dependency), yaitu atribut non-primary-key tidak boleh bergantung pada atribut non-primary-key lainnya.",
        citation: "Bab 3.2 - Halaman 29",
        memoryTrick: "💡 Aturan Emas 3NF: 'Every non-key attribute must depend on the key, the whole key, and nothing but the key'.",
        srsLevel: "new",
      },
    ],
  },
};

function FlashcardsContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const deckParam = searchParams.get("deck") || "ml_bab2";

  const [activeDeckKey, setActiveDeckKey] = useState<string>(
    initialDecks[deckParam] ? deckParam : "ml_bab2"
  );
  const [cards, setCards] = useState<FlashcardItem[]>(initialDecks[activeDeckKey].cards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompletedSession, setIsCompletedSession] = useState<boolean>(false);

  // Gamified SRS Stats
  const [stats, setStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
    streak: 0,
  });

  const currentUser = user || {
    id: "usr-guest",
    name: "Pelajar Tamu",
    email: "tamu@arnai.ai",
    avatar: "",
    role: "Guest Account",
    isDemo: true,
    provider: "demo" as const,
  };

  const currentCard = cards[currentIndex];

  useEffect(() => {
    if (initialDecks[activeDeckKey]) {
      setCards(initialDecks[activeDeckKey].cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowHint(false);
      setIsCompletedSession(false);
    }
  }, [activeDeckKey]);

  // Flip card handler
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard accessibility: Space to flip, 1/2/3 for SRS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompletedSession) return;
      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        if (e.key === "1") handleRate("hard");
        if (e.key === "2") handleRate("medium");
        if (e.key === "3") handleRate("easy");
      } else if (e.code === "ArrowRight") {
        handleNextCard();
      } else if (e.code === "ArrowLeft") {
        handlePrevCard();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, isCompletedSession, currentIndex, cards.length]);

  const handleRate = (rating: "easy" | "medium" | "hard") => {
    // Update stats
    setStats((prev) => ({
      ...prev,
      [rating]: prev[rating] + 1,
      streak: rating === "easy" || rating === "medium" ? prev.streak + 1 : 0,
    }));

    // Update current card srsLevel
    setCards((prev) =>
      prev.map((c, idx) =>
        idx === currentIndex
          ? {
              ...c,
              srsLevel: rating,
              nextReview:
                rating === "easy"
                  ? "4 Hari Lagi"
                  : rating === "medium"
                  ? "Besok"
                  : "10 Menit Lagi",
            }
          : c
      )
    );

    setIsFlipped(false);
    setShowHint(false);

    // Move to next card or complete
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompletedSession(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleNextCard = () => {
    if (currentIndex + 1 < cards.length) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestartSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsCompletedSession(false);
  };

  const handleRestartHardOnly = () => {
    const hardCards = cards.filter((c) => c.srsLevel === "hard");
    if (hardCards.length > 0) {
      setCards(hardCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowHint(false);
      setIsCompletedSession(false);
    } else {
      handleRestartSession();
    }
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
          {/* Header Bar & Deck Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-2 border border-primary/20">
                <Layers className="w-3.5 h-3.5" /> Phase 7: 3D Flip Card & SRS Spaced Repetition
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                Kartu Hafalan & Pengulangan Berjarak
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                Latih daya ingat jangka panjang dengan metode **Spaced Repetition System (SRS)** berteknologi AI RAG.
              </p>
            </div>

            {/* Deck selector dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={activeDeckKey}
                onChange={(e) => setActiveDeckKey(e.target.value)}
                aria-label="Pilih dek kartu hafalan"
                className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-extrabold text-foreground focus:outline-none focus:border-primary cursor-pointer shadow-sm"
              >
                <option value="ml_bab2">{initialDecks["ml_bab2"].title}</option>
                <option value="db_sys">{initialDecks["db_sys"].title}</option>
              </select>

              <button
                onClick={() => {
                  alert("🚀 AI sedang memproses 42 chunk vektor untuk menyusun dek kartu baru! (Simulasi fitur otomatis RAG)");
                }}
                className="px-3.5 py-2 rounded-xl bg-secondary/80 hover:bg-secondary border border-border text-xs font-extrabold flex items-center gap-1.5 text-foreground transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-primary" />
                <span>Buat Dek Baru</span>
              </button>
            </div>
          </div>

          {/* Gamified Stats Tracker Header Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-card/60 p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-sm border border-emerald-500/20">
                ✓
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Menguasai (Easy)</div>
                <div className="text-base font-black text-foreground">{stats.easy} <span className="text-[11px] font-normal text-muted-foreground">Kartu</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-sm border border-blue-500/20">
                ⚡
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Sedang Diingat</div>
                <div className="text-base font-black text-foreground">{stats.medium} <span className="text-[11px] font-normal text-muted-foreground">Kartu</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-black text-sm border border-red-500/20">
                !
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Perlu Ulang (Hard)</div>
                <div className="text-base font-black text-foreground">{stats.hard} <span className="text-[11px] font-normal text-muted-foreground">Kartu</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-sm border border-amber-500/20">
                🔥
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Streak Jawaban</div>
                <div className="text-base font-black text-amber-400">{stats.streak}x <span className="text-[11px] font-normal text-muted-foreground">Beruntun</span></div>
              </div>
            </div>
          </div>

          {/* MAIN CANVAS AREA: EITHER SESSION OR COMPLETION */}
          {!isCompletedSession ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full py-4 space-y-6">
              {/* Progress Tracker Pill */}
              <div className="w-full flex items-center justify-between text-xs font-extrabold text-muted-foreground">
                <span>
                  Kartu ke <strong className="text-foreground">{currentIndex + 1}</strong> dari {cards.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                    Tekan [Spasi] untuk Membalik Kartu
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border/60">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* 3D FLIP CARD CONTAINER */}
              <div
                onClick={handleFlip}
                className="w-full min-h-[360px] sm:min-h-[400px] cursor-pointer perspective-1000 relative select-none"
              >
                <motion.div
                  className="w-full h-full relative preserve-3d transition-transform duration-500 rounded-3xl"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  {/* FRONT SIDE */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-3xl bg-card border-2 border-border p-6 sm:p-10 flex flex-col justify-between backface-hidden shadow-2xl ${
                      isFlipped ? "pointer-events-none" : ""
                    }`}
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${currentCard?.badgeColor}`}>
                        {currentCard?.category}
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground">
                        Pertanyaan • Klik untuk Balik
                      </span>
                    </div>

                    {/* Question Content */}
                    <div className="my-auto py-6">
                      <h3 className="text-lg sm:text-2xl font-black text-foreground leading-snug tracking-tight text-center">
                        {currentCard?.front}
                      </h3>
                    </div>

                    {/* Hint Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint((prev) => !prev);
                        }}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{showHint ? "Sembunyikan Petunjuk" : "💡 Lihat Petunjuk AI"}</span>
                      </button>

                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs font-semibold text-muted-foreground bg-secondary/80 px-3 py-1.5 rounded-xl border border-border text-center sm:text-left max-w-md"
                        >
                          {currentCard?.hint}
                        </motion.div>
                      )}

                      <span className="text-[11px] font-bold text-muted-foreground hidden sm:inline">
                        Balik untuk Menilai ➔
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-3xl bg-card border-2 border-primary/50 p-6 sm:p-10 flex flex-col justify-between backface-hidden shadow-2xl ${
                      !isFlipped ? "pointer-events-none" : ""
                    }`}
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/15 text-primary border border-primary/30">
                        ⚡ Jawaban & Penjelasan RAG
                      </span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                        📑 {currentCard?.citation}
                      </span>
                    </div>

                    {/* Answer Content */}
                    <div className="my-auto py-4 space-y-4">
                      <div className="text-sm sm:text-base font-bold text-foreground leading-relaxed whitespace-pre-line">
                        {currentCard?.back}
                      </div>

                      {currentCard?.memoryTrick && (
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 leading-relaxed">
                          {currentCard.memoryTrick}
                        </div>
                      )}
                    </div>

                    {/* SRS Assessment Instruction */}
                    <div className="pt-3 border-t border-border/60 text-center">
                      <span className="text-[11px] font-bold text-muted-foreground">
                        Seberapa baik Anda mengingat kartu ini? (Gunakan tombol di bawah atau ketik 1, 2, 3)
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ACTION / SRS BUTTONS BAR */}
              <div className="w-full flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrevCard}
                  disabled={currentIndex === 0}
                  className={`p-3 rounded-2xl border border-border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    currentIndex === 0
                      ? "opacity-30 cursor-not-allowed bg-secondary/40 text-muted-foreground"
                      : "bg-card hover:bg-secondary text-foreground active:scale-95"
                  }`}
                  title="Kartu Sebelumnya (Panah Kiri)"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                {/* If Not Flipped, show Flip Button. If Flipped, show SRS rating buttons */}
                {!isFlipped ? (
                  <button
                    onClick={handleFlip}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-primary hover:bg-blue-700 text-primary-foreground font-black text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Balik Kartu untuk Menjawab (Spasi)</span>
                  </button>
                ) : (
                  <div className="flex-1 grid grid-cols-3 gap-2 sm:gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRate("hard");
                      }}
                      className="py-3 px-3 rounded-2xl bg-red-500/15 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 font-black text-xs sm:text-sm transition-all flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 shadow-sm"
                      title="Ulangi dalam 10 Menit (Tombol 1)"
                    >
                      <span>🔴 Sulit</span>
                      <span className="text-[10px] opacity-80">(10m) [1]</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRate("medium");
                      }}
                      className="py-3 px-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 font-black text-xs sm:text-sm transition-all flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 shadow-sm"
                      title="Ulangi Besok (Tombol 2)"
                    >
                      <span>🟡 Sedang</span>
                      <span className="text-[10px] opacity-80">(1 Hari) [2]</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRate("easy");
                      }}
                      className="py-3 px-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-500 hover:text-black border border-emerald-500/30 font-black text-xs sm:text-sm transition-all flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 shadow-sm"
                      title="Ulangi 4 Hari Lagi (Tombol 3)"
                    >
                      <span>🟢 Mudah</span>
                      <span className="text-[10px] opacity-80">(4 Hari) [3]</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleNextCard}
                  disabled={currentIndex + 1 === cards.length}
                  className={`p-3 rounded-2xl border border-border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    currentIndex + 1 === cards.length
                      ? "opacity-30 cursor-not-allowed bg-secondary/40 text-muted-foreground"
                      : "bg-card hover:bg-secondary text-foreground active:scale-95"
                  }`}
                  title="Kartu Berikutnya (Panah Kanan)"
                >
                  <span className="hidden sm:inline">Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* COMPLETION SCREEN */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full py-8 text-center space-y-6 glass-card rounded-3xl border border-border p-8 shadow-2xl my-auto"
            >
              <div className="w-20 h-20 rounded-3xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-inner">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  🎉 Sesi Hafalan Selesai!
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                  Selamat, Anda telah meninjau seluruh **{cards.length} kartu** pada dek *{initialDecks[activeDeckKey].title}*.
                </p>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-xl font-black text-emerald-500">{stats.easy}</div>
                  <div className="text-[11px] font-bold text-muted-foreground mt-0.5">🟢 Menguasai</div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <div className="text-xl font-black text-amber-400">{stats.medium}</div>
                  <div className="text-[11px] font-bold text-muted-foreground mt-0.5">🟡 Sedang</div>
                </div>
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                  <div className="text-xl font-black text-red-500">{stats.hard}</div>
                  <div className="text-[11px] font-bold text-muted-foreground mt-0.5">🔴 Perlu Ulang</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
                <button
                  onClick={handleRestartSession}
                  className="flex-1 py-3 px-5 rounded-2xl border border-border hover:bg-secondary text-xs font-extrabold text-foreground transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Ulangi Semua Kartu</span>
                </button>

                {stats.hard > 0 && (
                  <button
                    onClick={handleRestartHardOnly}
                    className="flex-1 py-3 px-5 rounded-2xl bg-red-500/15 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Latih {stats.hard} Kartu Sulit Saja</span>
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-border/80 w-full flex items-center justify-between">
                <Link
                  href="/study/summary"
                  className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Ringkasan
                </Link>
                <Link
                  href="/study/quizzes"
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <span>⚡ Lanjutkan ke Kuis Ujian</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Bottom helper bar */}
          <div className="text-center text-[11px] text-muted-foreground font-semibold pt-2 border-t border-border/40">
            💡 **Tips SRS**: Kartu yang Anda nilai <strong>🟢 Mudah</strong> akan dijadwalkan ulang oleh AI RAG 4 hari kemudian, sedangkan <strong>🔴 Sulit</strong> akan masuk ke kotak pengulangan jangka pendek agar hafalan permanen.
          </div>
        </main>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center font-extrabold text-primary">
          Memuat Ruang Flashcard 3D...
        </div>
      }
    >
      <FlashcardsContent />
    </Suspense>
  );
}
