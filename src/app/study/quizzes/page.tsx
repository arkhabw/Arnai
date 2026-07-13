"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import confetti from "canvas-confetti";
import {
  HelpCircle,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  User as UserIcon,
  LogOut,
  Zap,
  BookOpen,
  Trophy,
  Award,
  Layers,
  FileText,
  Shield,
  Flame,
  Send,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
  id: string;
  type: "mcq" | "essay";
  difficulty: "Mudah" | "Sedang" | "Sulit";
  question: string;
  options?: string[];
  correctAnswer: string; // Option string or Key concept keywords for essay
  explanation: string;
  citation: string;
  points: number;
}

interface QuizDeck {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  questions: QuizQuestion[];
}

const initialQuizDecks: Record<string, QuizDeck> = {
  ml_uts: {
    id: "ml_uts",
    title: "🎯 Ujian UTS: Machine Learning Bab 2 (Supervised & Optimasi)",
    subtitle: "5 Soal • 4 Pilihan Ganda + 1 Essay Semantik • 10 Menit",
    durationMinutes: 10,
    questions: [
      {
        id: "q-1",
        type: "mcq",
        difficulty: "Mudah",
        points: 20,
        question:
          "Dalam paradigma Supervised Learning, apa yang menjadi syarat utama atau pembeda pokok dibandingkan Unsupervised Learning?",
        options: [
          "A. Menggunakan algoritma K-Means untuk mencari kluster data",
          "B. Memerlukan dataset pelatihan yang dilengkapi label target (Ground Truth)",
          "C. Model tidak memerlukan fungsi kerugian (Loss Function)",
          "D. Selalu menghasilkan probabilitas antara 0 hingga 1 saja",
        ],
        correctAnswer: "B. Memerlukan dataset pelatihan yang dilengkapi label target (Ground Truth)",
        explanation:
          "Supervised learning memetakan pasangan input x ke output berlabel y yang diverifikasi oleh manusia atau sistem pakar. Unsupervised bekerja tanpa label target y.",
        citation: "Bab 2.1 - Halaman 14",
      },
      {
        id: "q-2",
        type: "mcq",
        difficulty: "Sedang",
        points: 20,
        question:
          "Pada fungsi kerugian Mean Squared Error (MSE) untuk regresi linier J(θ) = (1/2m) Σ (h_θ(x) - y)^2, mengapa terdapat angka 2m di bagian penyebut?",
        options: [
          "A. Untuk menggandakan kecepatan komputasi GPU",
          "B. Agar saat dilakukan turunan pertama terhadap bobot θ, angka pangkat 2 akan membagi habis angka 2 di penyebut",
          "C. Karena jumlah sampel m selalu bernilai genap pada setiap epoch",
          "D. Untuk mencegah terjadinya overfitting pada data latih",
        ],
        correctAnswer:
          "B. Agar saat dilakukan turunan pertama terhadap bobot θ, angka pangkat 2 akan membagi habis angka 2 di penyebut",
        explanation:
          "Angka 2 di penyebut (2m) adalah kenyamanan matematis (Mathematical Convenience). Saat diturunkan terhadap θ, turunan dari (...)^2 menghasilkan faktor 2 di depan yang saling mencoret dengan penyebut 2.",
        citation: "Bab 2.2 - Halaman 16",
      },
      {
        id: "q-3",
        type: "mcq",
        difficulty: "Sulit",
        points: 20,
        question:
          "Apa dampak fatal yang terjadi apabila nilai parameter Learning Rate (α) pada Gradient Descent diatur terlalu besar?",
        options: [
          "A. Model membutuhkan waktu berhari-hari untuk mencapai titik minimum global",
          "B. Bobot model akan bernilai nol pada iterasi pertama",
          "C. Langkah optimasi melompati titik minimum dan menyebabkan loss melambung naik (Divergensi / Overshoot)",
          "D. Algoritma otomatis berubah menjadi Unsupervised Learning",
        ],
        correctAnswer:
          "C. Langkah optimasi melompati titik minimum dan menyebabkan loss melambung naik (Divergensi / Overshoot)",
        explanation:
          "Learning rate (α) mengontrol besar langkah turunan gradien. Jika terlalu besar, pembaruan bobot akan melompati dasar lembah kerugian dan memantul semakin tinggi ke kedua sisi tebing (Overshoot).",
        citation: "Bab 2.3 - Halaman 18",
      },
      {
        id: "q-4",
        type: "mcq",
        difficulty: "Sedang",
        points: 20,
        question:
          "Di antara tiga strategi optimasi Gradient Descent, manakah yang memperbarui bobot model setiap selesai menghitung sebagian batch (misal 32 atau 64 sampel) dan menjadi standar industri saat ini?",
        options: [
          "A. Batch Gradient Descent",
          "B. Stochastic Gradient Descent (SGD)",
          "C. Mini-batch Gradient Descent",
          "D. Analytical Normal Equation",
        ],
        correctAnswer: "C. Mini-batch Gradient Descent",
        explanation:
          "Mini-batch GD menghitung gradien dari subset kecil (misal 32 sampel) sebelum mengupdate bobot. Ini memberikan stabilitas yang lebih baik dari SGD sekaligus jauh lebih efisien di memori GPU dibandingkan Batch GD.",
        citation: "Bab 2.4 - Halaman 19",
      },
      {
        id: "q-5",
        type: "essay",
        difficulty: "Sulit",
        points: 20,
        question:
          "Jelaskan mengapa algoritma clustering K-Means sangat rentan mengalami bias jika kita TIDAK melakukan normalisasi atau standardisasi fitur (seperti Z-Score Scaler) sebelum proses pelatihan dilakukan!",
        correctAnswer: "jarak euclidean skala dominasi normalisasi fitur adil z-score",
        explanation:
          "K-Means menggunakan perhitungan Jarak Euclidean untuk menentukan kedekatan antar titik. Jika fitur A berskala jutaan (misal Gaji) dan fitur B berskala puluhan (misal Usia), fitur berskala besar akan mendominasi nilai jarak sepenuhnya, membuat kluster yang terbentuk hanya dipengaruhi oleh fitur berskala besar tersebut. Normalisasi menyeimbangkan bobot semua fitur.",
        citation: "Bab 2.6 - Halaman 27",
      },
    ],
  },
  db_quiz: {
    id: "db_quiz",
    title: "⚡ Kuis Evaluasi: Normalisasi Basis Data & ACID",
    subtitle: "4 Soal • Pilihan Ganda • 8 Menit",
    durationMinutes: 8,
    questions: [
      {
        id: "q-db-1",
        type: "mcq",
        difficulty: "Mudah",
        points: 25,
        question: "Huruf 'I' pada prinsip transaksi basis data ACID mewakili konsep apa?",
        options: [
          "A. Integrity (Integritas data tidak boleh berubah sewaktu-waktu)",
          "B. Isolation (Transaksi konkuren berjalan terisolasi tanpa saling mengganggu)",
          "C. Indexing (Semua kolom primary key otomatis dibuatkan indeks pohon)",
          "D. Insertion (Data baru dimasukkan secara urut waktu log)",
        ],
        correctAnswer: "B. Isolation (Transaksi konkuren berjalan terisolasi tanpa saling mengganggu)",
        explanation:
          "Isolation menjamin bahwa eksekusi transaksi secara bersamaan (konkuren) menghasilkan status basis data yang sama persis seperti jika transaksi dijalankan secara berurutan satu per satu.",
        citation: "Bab 4 - Halaman 42",
      },
      {
        id: "q-db-2",
        type: "mcq",
        difficulty: "Sedang",
        points: 25,
        question: "Suatu tabel dikatakan telah memenuhi Normal Form Kedua (2NF) jika memenuhi syarat 1NF dan...",
        options: [
          "A. Tidak memiliki atribut yang bertipe data string/text panjang",
          "B. Semua atribut non-primary-key bergantung sepenuhnya pada seluruh Primary Key (tidak ada Partial Dependency)",
          "C. Tidak ada ketergantungan transitif antar kolom non-kunci",
          "D. Tabel memiliki maksimal 10 kolom",
        ],
        correctAnswer:
          "B. Semua atribut non-primary-key bergantung sepenuhnya pada seluruh Primary Key (tidak ada Partial Dependency)",
        explanation:
          "Syarat utama 2NF adalah penghapusan ketergantungan parsial (Partial Dependency), terutama pada tabel yang menggunakan kunci komposit (Composite Key).",
        citation: "Bab 3.2 - Halaman 28",
      },
      {
        id: "q-db-3",
        type: "mcq",
        difficulty: "Sulit",
        points: 25,
        question: "Apa tujuan utama dilakukannya normalisasi basis data hingga tahap 3NF atau BCNF dalam perancangan sistem enterprise?",
        options: [
          "A. Meminimalkan redundansi data serta mencegah terjadinya anomali penyisipan, pembaruan, dan penghapusan (Update/Insert/Delete Anomaly)",
          "B. Menghapus kebutuhan akan Foreign Key antar tabel",
          "C. Memastikan semua query SQL berjalan tanpa menggunakan JOIN",
          "D. Menghemat konsumsi daya CPU server sebesar 90%",
        ],
        correctAnswer:
          "A. Meminimalkan redundansi data serta mencegah terjadinya anomali penyisipan, pembaruan, dan penghapusan (Update/Insert/Delete Anomaly)",
        explanation:
          "Normalisasi bertujuan membersihkan duplikasi data yang tidak perlu sehingga ketika terjadi update pada satu fakta, kita hanya perlu mengubah satu baris data saja tanpa risiko inkonsistensi.",
        citation: "Bab 3.1 - Halaman 26",
      },
      {
        id: "q-db-4",
        type: "mcq",
        difficulty: "Mudah",
        points: 25,
        question: "Konsep 'All-or-Nothing' di dalam pemrosesan transaksi bank dijamin oleh pilar ACID yang mana?",
        options: ["A. Atomicity", "B. Consistency", "C. Isolation", "D. Durability"],
        correctAnswer: "A. Atomicity",
        explanation:
          "Atomicity (Atomisitas) menjamin bahwa jika transaksi terdiri dari 5 langkah dan langkah ke-4 gagal, maka 3 langkah yang sudah sempat terjadi akan dibatalkan otomatis (Rollback) seolah-olah tidak terjadi apa-apa.",
        citation: "Bab 4 - Halaman 43",
      },
    ],
  },
};

function QuizzesContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const deckParam = searchParams.get("deck") || "ml_uts";

  const [activeDeckKey, setActiveDeckKey] = useState<string>(
    initialQuizDecks[deckParam] ? deckParam : "ml_uts"
  );
  const [examMode, setExamMode] = useState<"practice" | "live">("practice");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Answers Map: questionId -> userAnswer string
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Timer state (seconds remaining)
  const [timeLeft, setTimeLeft] = useState<number>(initialQuizDecks[activeDeckKey].durationMinutes * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentUser = user || {
    id: "usr-guest",
    name: "Pelajar Tamu",
    email: "tamu@arnai.ai",
    avatar: "",
    role: "Guest Account",
    isDemo: true,
    provider: "demo" as const,
  };

  const currentDeck = initialQuizDecks[activeDeckKey];
  const currentQ = currentDeck.questions[currentQuestionIndex];

  // Reset deck on switch
  useEffect(() => {
    const deck = initialQuizDecks[activeDeckKey];
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSubmitted(false);
    setTimeLeft(deck.durationMinutes * 60);
  }, [activeDeckKey]);

  // Live Timer setup
  useEffect(() => {
    if (examMode === "live" && !submitted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmitExam();
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
  }, [examMode, submitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (ans: string) => {
    if (submitted && examMode === "live") return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: ans }));
  };

  const handleSubmitExam = () => {
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  // Evaluation logic
  const checkIsCorrect = (q: QuizQuestion) => {
    const ans = userAnswers[q.id] || "";
    if (!ans) return false;
    if (q.type === "mcq") {
      return ans === q.correctAnswer;
    } else {
      // Semantic keywords check for essay
      const lower = ans.toLowerCase();
      const keywords = q.correctAnswer.split(" ");
      const matched = keywords.filter((kw) => lower.includes(kw));
      return matched.length >= 2 || ans.length >= 25; // Good essay effort
    }
  };

  const calculateTotalScore = () => {
    let earned = 0;
    let total = 0;
    currentDeck.questions.forEach((q) => {
      total += q.points;
      if (checkIsCorrect(q)) {
        if (q.type === "mcq") {
          earned += q.points;
        } else {
          // Essay grading simulation
          earned += Math.round(q.points * 0.85); // 85% points for semantic accuracy
        }
      }
    });
    return { earned, total, percentage: Math.round((earned / total) * 100) };
  };

  const scoreData = calculateTotalScore();

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
          {/* Header Bar & Setup */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-2 border border-primary/20">
                <HelpCircle className="w-3.5 h-3.5" /> Generator Kuis AI & Simulasi Ujian
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Kuis Evaluasi & Simulasi Ujian
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                Uji pemahaman mendalam Anda dengan soal Pilihan Ganda & Essay berbasis **Semantic Grading RAG**.
              </p>
            </div>

            {/* Mode & Deck toggles */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={activeDeckKey}
                onChange={(e) => setActiveDeckKey(e.target.value)}
                disabled={submitted}
                aria-label="Pilih paket kuis evaluasi"
                className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-extrabold text-foreground focus:outline-none focus:border-primary cursor-pointer shadow-sm"
              >
                <option value="ml_uts">{initialQuizDecks["ml_uts"].title}</option>
                <option value="db_quiz">{initialQuizDecks["db_quiz"].title}</option>
              </select>

              <div className="flex items-center p-1 bg-secondary border border-border rounded-xl text-xs font-bold">
                <button
                  onClick={() => {
                    setExamMode("practice");
                    setSubmitted(false);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    examMode === "practice"
                      ? "bg-primary text-primary-foreground shadow-sm font-extrabold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> Mode Latihan
                </button>
                <button
                  onClick={() => {
                    setExamMode("live");
                    setSubmitted(false);
                    setTimeLeft(currentDeck.durationMinutes * 60);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    examMode === "live"
                      ? "bg-amber-500 text-black shadow-sm font-extrabold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" /> Mode Ujian Live
                </button>
              </div>
            </div>
          </div>

          {/* TIMER BANNER (LIVE MODE) / SCORE BANNER (IF SUBMITTED) */}
          {examMode === "live" && !submitted && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <div className="flex items-center gap-2.5 font-black text-sm">
                <Clock className="w-5 h-5 animate-pulse text-amber-400" />
                <span>Simulasi Ujian Aktif • Waktu Berjalan</span>
              </div>
              <div className={`text-xl font-mono font-black ${timeLeft <= 120 ? "text-red-500 animate-ping" : "text-amber-400"}`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            </div>
          )}

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-card border-2 border-primary/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-black border border-amber-500/30 shrink-0">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-primary">Hasil Evaluasi AI RAG</div>
                  <h2 className="text-2xl font-black text-foreground">
                    Skor Anda: {scoreData.earned} / {scoreData.total} Poin ({scoreData.percentage}%)
                  </h2>
                  <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                    {scoreData.percentage >= 80 ? "🏆 Predikat: Sangat Memuaskan (A siap ujian!)" : "⚡ Predikat: Perlu Latihan Ulang pada bab tertentu."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setUserAnswers({});
                    setCurrentQuestionIndex(0);
                    setTimeLeft(currentDeck.durationMinutes * 60);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-card text-xs font-extrabold flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> Ulangi Kuis
                </button>
                <Link
                  href="/study/flashcards"
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Layers className="w-4 h-4" /> Latih di Flashcard
                </Link>
              </div>
            </motion.div>
          )}

          {/* QUESTION NAVIGATOR PILLS GRID */}
          <div className="flex items-center justify-between gap-3 bg-card/60 p-3 rounded-2xl border border-border overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground shrink-0">Navigasi Soal:</span>
              {currentDeck.questions.map((q, idx) => {
                const isSelected = idx === currentQuestionIndex;
                const isAnswered = !!userAnswers[q.id];
                const isCorrect = checkIsCorrect(q);

                let btnStyle = "bg-secondary text-muted-foreground border-border";
                if (submitted || examMode === "practice") {
                  if (isAnswered) {
                    btnStyle = isCorrect
                      ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40"
                      : "bg-red-500/20 text-red-500 border-red-500/40";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-primary text-primary-foreground border-primary font-black shadow-md";
                } else if (isAnswered) {
                  btnStyle = "bg-primary/20 text-primary border-primary/40 font-bold";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-9 h-9 rounded-xl border text-xs font-black transition-all shrink-0 flex items-center justify-center ${btnStyle} ${
                      isSelected && !submitted ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {!submitted && examMode === "live" && (
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all shrink-0 active:scale-95"
              >
                🚀 Kumpulkan Ujian Sekarang
              </button>
            )}
          </div>

          {/* MAIN QUESTION BOX CANVAS */}
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-3xl border border-border p-6 sm:p-8 shadow-xl space-y-6"
          >
            {/* Question Header Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/15 text-primary border border-primary/30 uppercase tracking-wider">
                  Soal Ke {currentQuestionIndex + 1} dari {currentDeck.questions.length}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${
                    currentQ.difficulty === "Mudah"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : currentQ.difficulty === "Sedang"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}
                >
                  🔥 Bobot: {currentQ.difficulty} ({currentQ.points} Poin)
                </span>
              </div>

              <span className="text-xs font-extrabold text-muted-foreground flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> {currentQ.type === "mcq" ? "Pilihan Ganda" : "Essay Singkat RAG"}
              </span>
            </div>

            {/* Question Text */}
            <div className="py-2">
              <h3 className="text-base sm:text-lg font-black text-foreground leading-relaxed tracking-tight">
                {currentQ.question}
              </h3>
            </div>

            {/* OPTIONS OR ESSAY INPUT */}
            {currentQ.type === "mcq" && currentQ.options ? (
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentQ.id] === opt;
                  const isCorrectAnswer = opt === currentQ.correctAnswer;
                  const showResult = submitted || (examMode === "practice" && !!userAnswers[currentQ.id]);

                  let cardStyle = "bg-secondary/60 hover:bg-secondary border-border text-foreground";
                  if (showResult) {
                    if (isCorrectAnswer) {
                      cardStyle = "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-extrabold shadow-sm";
                    } else if (isSelected) {
                      cardStyle = "bg-red-500/15 border-red-500/50 text-red-400 font-extrabold";
                    }
                  } else if (isSelected) {
                    cardStyle = "bg-primary/20 border-primary text-primary font-black shadow-md ring-1 ring-primary";
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectAnswer(opt)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${cardStyle}`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-7 h-7 rounded-xl bg-card border border-border flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                          {["A", "B", "C", "D"][idx]}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold leading-relaxed">{opt}</span>
                      </div>

                      {showResult && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {showResult && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ESSAY TEXTAREA */
              <div className="space-y-3 pt-2">
                <textarea
                  value={userAnswers[currentQ.id] || ""}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  disabled={submitted && examMode === "live"}
                  placeholder="Ketikkan jawaban essay singkat atau penjelasan semantik Anda di sini... (AI akan menilai kecocokan konsep kunci)"
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-secondary/80 border border-border text-foreground font-semibold text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors leading-relaxed placeholder:text-muted-foreground"
                />
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground px-1">
                  <span>💡 Bobot Essay: AI RAG menganalisis kata kunci definisi & penalaran logika Anda.</span>
                  <span>{(userAnswers[currentQ.id] || "").split(" ").filter(Boolean).length} Kata</span>
                </div>
              </div>
            )}

            {/* INSTANT AI EXPLANATION BOX (If Practice mode answered OR if Submitted) */}
            {(submitted || (examMode === "practice" && !!userAnswers[currentQ.id])) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 pt-6 border-t border-border/80 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider">
                    <Zap className="w-4 h-4" /> Pembahasan RAG & Referensi Resmi AI:
                  </div>
                  <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                    📑 {currentQ.citation}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-secondary/90 border border-border text-xs sm:text-sm font-medium text-foreground leading-relaxed shadow-inner">
                  {currentQ.explanation}
                </div>

                {/* Quick Link to Chat */}
                <div className="flex justify-end pt-1">
                  <Link
                    href={`/chat?doc=Machine_Learning_Bab2.pdf&query=${encodeURIComponent("Tolong jelaskan lebih lanjut mengenai soal kuis ini: " + currentQ.question)}`}
                    className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    <span>💬 Kurang jelas? Minta penjelasan lebih rinci di AI Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* FOOTER ACTION BAR */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className={`px-5 py-3 rounded-2xl border border-border text-xs font-extrabold flex items-center gap-2 transition-all ${
                currentQuestionIndex === 0
                  ? "opacity-30 cursor-not-allowed bg-secondary/40 text-muted-foreground"
                  : "bg-card hover:bg-secondary text-foreground active:scale-95"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Soal Sebelumnya</span>
            </button>

            {currentQuestionIndex + 1 < currentDeck.questions.length ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-6 py-3 rounded-2xl bg-primary hover:bg-blue-700 text-primary-foreground text-xs font-black shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Soal Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              !submitted && (
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-2 transition-all active:scale-95 animate-bounce"
                >
                  <Send className="w-4 h-4" />
                  <span>Kumpulkan Semua Jawaban</span>
                </button>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function QuizzesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center font-extrabold text-primary">
          Memuat Ruang Kuis & Ujian...
        </div>
      }
    >
      <QuizzesContent />
    </Suspense>
  );
}
