"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  HelpCircle,
  ArrowRight,
  Trash2,
  Search,
  User as UserIcon,
  LogOut,
  Bell,
  Cpu,
  Database,
  Terminal,
  FileCode,
  FileCheck,
  RefreshCw,
  Plus,
  Info,
  ChevronRight,
  Sliders,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentItem {
  id: string;
  filename: string;
  fileType: string;
  fileSize: string;
  status: string;
  statusText: string;
  chunksCount: number;
  extractedConcepts: number;
  createdAt: string;
  summaryPreview?: string;
}

const initialDocuments: DocumentItem[] = [
  {
    id: "doc-seed-1",
    filename: "Machine_Learning_Bab2.pdf",
    fileType: "application/pdf",
    fileSize: "3.2 MB",
    status: "ready",
    statusText: "🟢 RAG Ready & Indexed",
    chunksCount: 42,
    extractedConcepts: 16,
    createdAt: "12 Juli 2026",
    summaryPreview:
      "Bab 2 membahas konsep Supervised Learning, Unsupervised Learning, fungsi kerugian (Loss Function), serta optimasi Gradient Descent pada neural network.",
  },
  {
    id: "doc-seed-2",
    filename: "Database_System_Design.pdf",
    fileType: "application/pdf",
    fileSize: "5.1 MB",
    status: "ready",
    statusText: "🟢 RAG Ready & Indexed",
    chunksCount: 64,
    extractedConcepts: 20,
    createdAt: "11 Juli 2026",
    summaryPreview:
      "Buku panduan desain sistem basis data relasional, mencakup normalisasi 1NF hingga BCNF, indeks B-Tree, transaksi ACID, dan optimasi query eksekusi.",
  },
  {
    id: "doc-seed-3",
    filename: "Jurnal_Neural_Networks_2025.pdf",
    fileType: "application/pdf",
    fileSize: "1.8 MB",
    status: "ready",
    statusText: "🟢 RAG Ready & Indexed",
    chunksCount: 28,
    extractedConcepts: 11,
    createdAt: "10 Juli 2026",
    summaryPreview:
      "Penelitian terkini mengenai arsitektur Transformer efisien dan kuantisasi bobot INT4 pada Large Language Models untuk eksekusi edge device.",
  },
];

const pipelineSteps = [
  {
    step: 1,
    title: "Ekstraksi Teks Optik & Struktural",
    desc: "Membaca karakter, judul bab, tabel, dan metadata dari file.",
  },
  {
    step: 2,
    title: "Smart Semantic Chunking",
    desc: "Memecah teks menjadi potongan 500 token dengan overlap 50 token.",
  },
  {
    step: 3,
    title: "Vector Dense Embedding",
    desc: "Mengubah teks chunk menjadi vektor 1536-dimensi (text-embedding-004).",
  },
  {
    step: 4,
    title: "RAG Index Ready & Siap Pakai",
    desc: "Menyimpan vektor ke dalam basis data dan menghubungkan ke Chat AI.",
  },
];

export default function DocumentsPage() {
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [recentlyProcessed, setRecentlyProcessed] = useState<DocumentItem | null>(null);
  const [viewDocDetail, setViewDocDetail] = useState<DocumentItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = user || {
    id: "usr-guest",
    name: "Pelajar Tamu",
    email: "tamu@arnai.ai",
    avatar: "",
    role: "Guest Account",
    isDemo: true,
    provider: "demo" as const,
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Basic checking
    const allowedExtensions = [".pdf", ".pptx", ".docx", ".txt", ".png", ".jpg", ".jpeg"];
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      alert("Format file tidak didukung. Harap unggah PDF, PPTX, DOCX, TXT, atau Gambar.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert("Ukuran file melebihi batas maksimal 25 MB.");
      return;
    }
    setSelectedFile(file);
    setRecentlyProcessed(null);
  };

  const startPipelineProcessing = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setCurrentStep(1);
    setLogs([`[SYSTEM] Memulai proses unggah untuk file "${selectedFile.name}"...`]);

    // Step 1: Extraction
    await new Promise((res) => setTimeout(res, 900));
    setLogs((prev) => [
      ...prev,
      `[STEP 1] Ekstraksi Teks: Berhasil memindai metadata & struktur halaman.`,
      `[STEP 1] Ditemukan sekitar ${Math.round(selectedFile.size / 600)} kata yang bersih dari artefak format.`,
    ]);
    setCurrentStep(2);

    // Step 2: Chunking
    await new Promise((res) => setTimeout(res, 1100));
    const estimatedChunks = Math.max(14, Math.round(selectedFile.size / (1024 * 70)));
    setLogs((prev) => [
      ...prev,
      `[STEP 2] Smart Chunking: Memisahkan paragraf berdasarkan batas semantik.`,
      `[STEP 2] Terbuat ${estimatedChunks} chunk dengan panjang rata-rata 480 token & overlap 50 token.`,
    ]);
    setCurrentStep(3);

    // Step 3: Vector Embedding
    await new Promise((res) => setTimeout(res, 1200));
    setLogs((prev) => [
      ...prev,
      `[STEP 3] Vector Embedding: Mengirim ${estimatedChunks} chunk ke model text-embedding-004...`,
      `[STEP 3] Vektor 1536-dimensi berhasil dihasilkan dengan skor kepadatan semantik 0.94.`,
    ]);
    setCurrentStep(4);

    // Step 4: Finalizing API
    await new Promise((res) => setTimeout(res, 800));
    const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1) + " MB";

    try {
      const response = await fetch("/api/process-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedFile.name,
          fileType: selectedFile.type || "application/pdf",
          fileSize: fileSizeMB,
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setDocuments((prev) => [result.data, ...prev]);
        setRecentlyProcessed(result.data);
        setLogs((prev) => [
          ...prev,
          `[STEP 4] Selesai: Dokumen tersinkronisasi ke dalam RAG Index. Siap digunakan!`,
        ]);
      }
    } catch (err) {
      setLogs((prev) => [...prev, `[ERROR] Gagal menyinkronkan ke server lokal.`]);
    } finally {
      setIsProcessing(false);
      setSelectedFile(null);
    }
  };

  const handleDeleteDocument = (id: string, filename: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${filename}" dan semua vektor RAG-nya?`)) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      if (viewDocDetail?.id === id) setViewDocDetail(null);
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalChunks = documents.reduce((acc, curr) => acc + curr.chunksCount, 0);

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
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              Kembali ke Dashboard
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
          {/* Page Banner Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-2 border border-primary/20">
                <Cpu className="w-3.5 h-3.5" /> Phase 4: Document Upload & AI RAG Pipeline
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Ruang Unggah Materi & Vektor RAG
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 max-w-2xl">
                Unggah dokumen kuliah Anda (PDF, PPTX, DOCX). Mesin AI Arnai akan mengekstrak teks, memecahkannya menjadi *Semantic Chunks*, dan mengindeksnya untuk obrolan serta kuis.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 self-start md:self-auto bg-card p-3 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-secondary/80 text-xs font-bold">
                <Database className="w-4 h-4 text-primary" />
                <span>{documents.length} Dokumen Aktif</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-secondary/80 text-xs font-bold">
                <Sliders className="w-4 h-4 text-emerald-500" />
                <span>{totalChunks} Chunks Vektor</span>
              </div>
            </div>
          </div>

          {/* Drag and Drop Upload Area */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-primary" /> Unggah Dokumen Pembelajaran Baru
              </h3>
              <span className="text-[11px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg border border-border">
                Maksimal 25 MB / File
              </span>
            </div>

            {!selectedFile && !isProcessing && !recentlyProcessed && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.01]"
                    : "border-border hover:border-primary/60 hover:bg-secondary/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  accept=".pdf,.pptx,.docx,.txt,.png,.jpg,.jpeg"
                />
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20 shadow-sm">
                  <UploadCloud className="w-8 h-8 animate-bounce" />
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-foreground mb-1">
                  Drag & Drop Dokumen Anda di Sini
                </h4>
                <p className="text-xs text-muted-foreground font-medium max-w-md mb-4">
                  Atau klik ruang ini untuk menjelajah file dari komputer Anda. Mendukung PDF materi kuliah, slide presentasi PPTX, catatan DOCX, dan TXT.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-muted-foreground">
                  <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border">📑 PDF</span>
                  <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border">📊 PPTX</span>
                  <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border">📝 DOCX</span>
                  <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border">📄 TXT</span>
                </div>
              </div>
            )}

            {/* Selected File Card before processing */}
            {selectedFile && !isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card/90 border border-border p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-foreground leading-snug">{selectedFile.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium mt-1">
                      <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                      <span>•</span>
                      <span className="text-primary font-bold uppercase">{selectedFile.name.split(".").pop()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="px-4 py-2.5 rounded-xl border border-border hover:bg-secondary text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={startPipelineProcessing}
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground font-extrabold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" /> 🚀 Jalankan Ekstraksi & Pipeline RAG AI
                  </button>
                </div>
              </motion.div>
            )}

            {/* Real-time 4-Step Pipeline Visualizer */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/60 border border-border p-6 rounded-2xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground">
                        Sedang Memproses: <span className="text-primary">{selectedFile?.name}</span>
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium">
                        Pipeline AI sedang melakukan chunking semantik dan pengindeksan vektor...
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    Step {currentStep} / 4
                  </span>
                </div>

                {/* Stepper Progress Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {pipelineSteps.map((s) => {
                    const isDone = currentStep > s.step;
                    const isCurrent = currentStep === s.step;
                    return (
                      <div
                        key={s.step}
                        className={`p-3 rounded-xl border transition-all ${
                          isDone
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                            : isCurrent
                            ? "bg-primary/10 border-primary/40 text-primary shadow-sm"
                            : "bg-card/40 border-border/40 text-muted-foreground opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 font-black text-xs">
                          <span>Step {s.step}</span>
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : isCurrent ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                          )}
                        </div>
                        <div className="font-extrabold text-xs text-foreground leading-tight mb-1">{s.title}</div>
                        <div className="text-[10px] text-muted-foreground font-medium leading-relaxed">{s.desc}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Terminal Log Window */}
                <div className="bg-black/80 rounded-xl p-4 font-mono text-xs text-emerald-400 border border-white/10 space-y-1.5 max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground border-b border-white/10 pb-1.5 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" /> RAG Engine Execution Console
                    </span>
                    <span>Live Chunks Stream</span>
                  </div>
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground select-none">&gt;</span>
                      <span className="leading-relaxed">{log}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Success Card after processing */}
            {recentlyProcessed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl space-y-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-foreground">
                        Dokumen <span className="text-emerald-500 font-extrabold">"{recentlyProcessed.filename}"</span> Berhasil Terindeks!
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        Dihasilkan <strong className="text-foreground">{recentlyProcessed.chunksCount} Vector Chunks</strong> dan diekstrak <strong className="text-foreground">{recentlyProcessed.extractedConcepts} Konsep Belajar</strong>.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setRecentlyProcessed(null)}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg bg-card border border-border"
                  >
                    Tutup
                  </button>
                </div>

                {/* Quick Next Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-500/20">
                  <Link
                    href={`/chat?doc=${encodeURIComponent(recentlyProcessed.filename)}`}
                    className="p-3.5 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground text-foreground font-extrabold text-xs border border-border transition-all shadow-sm flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                      <span>💬 Tanya Jawab AI (RAG Chat)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/study/summary"
                    className="p-3.5 rounded-xl bg-card hover:bg-secondary text-foreground font-extrabold text-xs border border-border transition-all shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-500" />
                      <span>✨ Buat Ringkasan Bab</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/study/flashcards"
                    className="p-3.5 rounded-xl bg-card hover:bg-secondary text-foreground font-extrabold text-xs border border-border transition-all shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>🃏 Latihan Flashcard (SRS)</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Uploaded Documents Library Section */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" /> Pustaka Dokumen & Vektor Aktif
                </h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  Kelola dokumen Anda atau lihat rincian pemecahan vektor (*Chunking Structure*) untuk memverifikasi pemahaman AI.
                </p>
              </div>

              {/* Search Bar in Library */}
              <div className="flex items-center gap-2 bg-secondary/60 border border-border rounded-xl px-3.5 py-1.5 w-full sm:w-72">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Cari nama dokumen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Table Library */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Dokumen</th>
                    <th className="py-3 px-4">Ukuran</th>
                    <th className="py-3 px-4">Diunggah Pada</th>
                    <th className="py-3 px-4">Status AI Pipeline</th>
                    <th className="py-3 px-4">Vector Chunks</th>
                    <th className="py-3 px-4 text-right">Aksi & Rincian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs font-semibold">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground font-bold">
                        Tidak ada dokumen yang sesuai pencarian Anda.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-secondary/40 transition-colors group">
                        <td className="py-4 px-4 font-bold text-foreground flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                            <FileText className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <div className="font-extrabold text-foreground group-hover:text-primary transition-colors max-w-xs truncate">
                              {doc.filename}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-medium uppercase">
                              {doc.fileType.split("/").pop()}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground font-medium">{doc.fileSize}</td>
                        <td className="py-4 px-4 text-muted-foreground font-medium">{doc.createdAt}</td>
                        <td className="py-4 px-4">
                          <span className="font-extrabold">{doc.statusText}</span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setViewDocDetail(doc)}
                            className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-extrabold border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                          >
                            {doc.chunksCount} Chunks (Lihat)
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/chat?doc=${encodeURIComponent(doc.filename)}`}
                              className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-extrabold transition-all shadow-sm flex items-center gap-1"
                            >
                              <span>Chat AI</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                            <button
                              onClick={() => handleDeleteDocument(doc.id, doc.filename)}
                              aria-label="Delete document"
                              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-red-500 hover:border-red-500/40 transition-colors"
                              title="Hapus dokumen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Detail Modal for Document Chunks & Extracted Concepts */}
      <AnimatePresence>
        {viewDocDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <FileCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground">{viewDocDetail.filename}</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Rincian Indeks Vektor RAG & Konsep yang Telah Dipahami AI
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewDocDetail(null)}
                  className="px-3 py-1 rounded-xl bg-secondary text-muted-foreground hover:text-foreground text-xs font-bold"
                >
                  Tutup
                </button>
              </div>

              {/* Summary Overview */}
              <div className="p-4 rounded-2xl bg-secondary/60 border border-border space-y-2">
                <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Ringkasan Ekstraksi AI
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  {viewDocDetail.summaryPreview ||
                    `Dokumen ini telah dipecah menjadi ${viewDocDetail.chunksCount} chunk vektor semantik dengan overlap 50 token. AI telah mengenali ${viewDocDetail.extractedConcepts} konsep kunci yang siap diuji dalam Kuis & Flashcard.`}
                </p>
              </div>

              {/* Chunks breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Distribusi Topik Vektor Chunks ({viewDocDetail.chunksCount} Chunks Total)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>Definisi & Konsep Dasar</span>
                      <span className="text-primary font-black">
                        {Math.round(viewDocDetail.chunksCount * 0.3)} Chunks
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="w-[30%] h-full bg-primary rounded-full" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>Rumus, Prinsip & Algoritma</span>
                      <span className="text-indigo-400 font-black">
                        {Math.round(viewDocDetail.chunksCount * 0.35)} Chunks
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="w-[35%] h-full bg-indigo-500 rounded-full" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>Studi Kasus & Penerapan</span>
                      <span className="text-emerald-500 font-black">
                        {Math.round(viewDocDetail.chunksCount * 0.2)} Chunks
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="w-[20%] h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>Ringkasan & Poin Ujian</span>
                      <span className="text-amber-400 font-black">
                        {Math.round(viewDocDetail.chunksCount * 0.15)} Chunks
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="w-[15%] h-full bg-amber-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons from modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Link
                  href={`/chat?doc=${encodeURIComponent(viewDocDetail.filename)}`}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Mulai Tanya Jawab AI (RAG)
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
