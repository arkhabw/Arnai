"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Network,
  Sparkles,
  BookOpen,
  FileText,
  User as UserIcon,
  LogOut,
  Zap,
  ArrowRight,
  HelpCircle,
  Layers,
  ZoomIn,
  RefreshCw,
  X,
  Info,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConceptDetail {
  title: string;
  category: string;
  badgeColor: string;
  explanation: string;
  formula?: string;
  citation: string;
  examNote: string;
}

const conceptDetailsMap: Record<string, ConceptDetail> = {
  "node-root": {
    title: "Machine Learning Bab 2: Supervised vs Unsupervised",
    category: "Konsep Akar (Root Concept)",
    badgeColor: "bg-primary/15 text-primary border-primary/30",
    explanation:
      "Peta konsep menyeluruh dari Bab 2 yang memecah alur pembelajaran mesin dari penyediaan data berlabel hingga teknik optimasi kemiringan gradien.",
    citation: "Bab 2.1 - 2.6 (Halaman 14 - 29)",
    examNote: "Pelajari hubungan antara Loss Function dengan Optimizer karena selalu keluar di soal essay.",
  },
  "node-supervised": {
    title: "Supervised Learning (Pembelajaran Terbimbing)",
    category: "Paradigma Utama",
    badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    explanation:
      "Algoritma dilatih menggunakan pasangan dataset input x dan label target y (Ground Truth). Terdiri dari 2 cabang utama: Regresi (kontinu) dan Klasifikasi (diskrit).",
    citation: "Bab 2.1 - Halaman 14",
    examNote: "Bedakan contoh kasus regresi (harga rumah) vs klasifikasi (deteksi tumor).",
  },
  "node-unsupervised": {
    title: "Unsupervised Learning (Pembelajaran Tak Terbimbing)",
    category: "Paradigma Utama",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    explanation:
      "Algoritma bekerja hanya dengan matriks input X tanpa label target y untuk menemukan pola intrinsik, klasterisasi (K-Means), atau reduksi dimensi (PCA).",
    citation: "Bab 2.1 - Halaman 15",
    examNote: "Ingat bahwa K-Means wajib diawali normalisasi Z-Score sebelum menghitung jarak Euclidean.",
  },
  "node-loss": {
    title: "Loss Functions (Fungsi Kerugian)",
    category: "Metrik Evaluasi",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    explanation:
      "Mengukur seberapa jauh estimasi model h_θ(x) dari target asli y. Menjadi kompas bagi optimizer untuk memperbarui bobot model ke arah minimum kesalahan.",
    formula: "J(θ) = (1/2m) Σ [ h_θ(x^(i)) - y^(i) ]^2 (MSE)",
    citation: "Bab 2.2 - Halaman 16",
    examNote: "Angka 2m di penyebut digunakan agar saling mencoret saat dilakukan turunan pertama.",
  },
  "node-gd": {
    title: "Gradient Descent Optimization",
    category: "Algoritma Optimasi",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    explanation:
      "Algoritma iteratif yang memperbarui bobot θ berlawanan arah dengan turunan gradien fungsi kerugian J(θ) yang dikalikan dengan parameter Learning Rate (α).",
    formula: "θ_j := θ_j - α * (∂/∂θ_j) J(θ)",
    citation: "Bab 2.3 - Halaman 18",
    examNote: "Jika Learning Rate (α) terlalu besar, model akan mengalami overshoot (divergensi).",
  },
  "node-bsm": {
    title: "Batch vs SGD vs Mini-batch",
    category: "Strategi Update Bobot",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    explanation:
      "Batch GD menghitung seluruh N data per update (stabil tapi lambat). SGD menghitung 1 sampel per update (berisik tapi cepat). Mini-batch GD menghitung subset sampel (misal 32/64) per update dan menjadi standar industri deep learning.",
    citation: "Bab 2.4 - Halaman 19",
    examNote: "Gunakan jembatan keledai BSM: Semua vs Satu vs Sebagian.",
  },
  "node-reg": {
    title: "Regresi Linier & Logistic Regression",
    category: "Algoritma Supervised",
    badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    explanation:
      "Regresi Linier memprediksi nilai kontinu menggunakan garis fit terbaik. Logistic Regression menggunakan fungsi Sigmoid 1/(1+e^-z) untuk menghasilkan probabilitas klasifikasi 0-1.",
    formula: "Sigmoid: σ(z) = 1 / (1 + e^-z)",
    citation: "Bab 2.4 - Halaman 21 - 22",
    examNote: "Threshold standar Logistic Regression adalah P(y=1|x) > 0.5.",
  },
  "node-kmeans": {
    title: "K-Means Clustering & Normalisasi",
    category: "Algoritma Unsupervised",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    explanation:
      "Mengelompokkan data ke dalam K klaster dengan meminimalkan kuadrat jarak antar titik dengan centroid klaster. Wajib menggunakan Z-Score agar fitur berskala besar tidak mendominasi jarak.",
    citation: "Bab 2.6 - Halaman 27",
    examNote: "Jarak Euclidean sangat sensitif terhadap skala satuan variabel.",
  },
};

// CUSTOM GLASSMORPHISM NODE COMPONENT
function CustomGlassNode({ data }: { data: any }) {
  return (
    <div
      className={`px-5 py-4 rounded-2xl border-2 shadow-xl backdrop-blur-md transition-all cursor-pointer select-none min-w-[210px] max-w-[260px] ${
        data.isSelected ? "border-primary bg-primary/20 scale-105 ring-2 ring-primary/50" : "border-border bg-card/90 hover:border-primary/60"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${data.badgeColor}`}>
          {data.category}
        </span>
        <span className="text-[10px] text-muted-foreground font-bold">ℹ️ Klik</span>
      </div>
      <div className="font-black text-xs sm:text-sm text-foreground leading-snug tracking-tight">
        {data.label}
      </div>
      <div className="text-[11px] text-muted-foreground font-medium mt-1.5 line-clamp-2">
        {data.subtitle}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}

const nodeTypes = {
  glassNode: CustomGlassNode,
};

const initialMlNodes: Node[] = [
  {
    id: "node-root",
    type: "glassNode",
    position: { x: 380, y: 30 },
    data: {
      label: "🧠 Machine Learning Bab 2",
      subtitle: "Supervised, Unsupervised & Optimasi Bobot",
      category: "Root Concept",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
    },
  },
  {
    id: "node-supervised",
    type: "glassNode",
    position: { x: 140, y: 180 },
    data: {
      label: "📈 Supervised Learning",
      subtitle: "Data berlabel (x, y) • Regresi & Klasifikasi",
      category: "Paradigma",
      badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    },
  },
  {
    id: "node-unsupervised",
    type: "glassNode",
    position: { x: 620, y: 180 },
    data: {
      label: "🔍 Unsupervised Learning",
      subtitle: "Data tanpa label (x) • Clustering & Reduksi",
      category: "Paradigma",
      badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    },
  },
  {
    id: "node-loss",
    type: "glassNode",
    position: { x: 40, y: 340 },
    data: {
      label: "🧮 Loss Functions (MSE)",
      subtitle: "J(θ) mengukur selisih kuadrat prediksi vs target",
      category: "Metrik",
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
  },
  {
    id: "node-reg",
    type: "glassNode",
    position: { x: 260, y: 340 },
    data: {
      label: "⚡ Regresi & Logistic Reg",
      subtitle: "Garis linier & fungsi probabilitas Sigmoid",
      category: "Algoritma",
      badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    },
  },
  {
    id: "node-kmeans",
    type: "glassNode",
    position: { x: 620, y: 340 },
    data: {
      label: "🎯 K-Means & Normalisasi",
      subtitle: "Clustering jarak Euclidean & wajib Z-Score",
      category: "Algoritma",
      badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    },
  },
  {
    id: "node-gd",
    type: "glassNode",
    position: { x: 150, y: 500 },
    data: {
      label: "📉 Gradient Descent",
      subtitle: "Update bobot berlawanan arah gradien * Learning Rate α",
      category: "Optimasi",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
  },
  {
    id: "node-bsm",
    type: "glassNode",
    position: { x: 420, y: 500 },
    data: {
      label: "⏱️ Batch vs SGD vs Mini-batch",
      subtitle: "Frekuensi komputasi gradien: Semua vs Satu vs Sebagian",
      category: "Optimasi",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
  },
];

const initialMlEdges: Edge[] = [
  { id: "e-root-sup", source: "node-root", target: "node-supervised", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e-root-unsup", source: "node-root", target: "node-unsupervised", animated: true, style: { stroke: "#a855f7", strokeWidth: 2 } },
  { id: "e-sup-loss", source: "node-supervised", target: "node-loss", style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e-sup-reg", source: "node-supervised", target: "node-reg", style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e-unsup-kmeans", source: "node-unsupervised", target: "node-kmeans", style: { stroke: "#a855f7", strokeWidth: 2 } },
  { id: "e-loss-gd", source: "node-loss", target: "node-gd", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e-gd-bsm", source: "node-gd", target: "node-bsm", style: { stroke: "#f59e0b", strokeWidth: 2 } },
];

function MindmapsContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const docParam = searchParams.get("doc") || "Machine_Learning_Bab2.pdf";

  const [activeDoc, setActiveDoc] = useState<string>(docParam);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialMlNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialMlEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node-root");

  const currentUser = user || {
    id: "usr-guest",
    name: "Pelajar Tamu",
    email: "tamu@arnai.ai",
    avatar: "",
    role: "Guest Account",
    isDemo: true,
    provider: "demo" as const,
  };

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: n.id === node.id,
        },
      }))
    );
  }, [setNodes]);

  const selectedConcept = selectedNodeId && conceptDetailsMap[selectedNodeId] ? conceptDetailsMap[selectedNodeId] : conceptDetailsMap["node-root"];

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

        <main className="flex-1 flex flex-col h-[calc(100vh-65px)] overflow-hidden">
          {/* Top Control Header Bar inside Mindmap */}
          <div className="bg-card/90 border-b border-border p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-1 border border-primary/20">
                <Network className="w-3.5 h-3.5" /> Phase 9: Interactive Visual Mindmap (@xyflow/react Flow)
              </div>
              <h1 className="text-lg sm:text-xl font-black text-foreground">
                Peta Konsep Vektor RAG Interaktif
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={activeDoc}
                onChange={(e) => setActiveDoc(e.target.value)}
                aria-label="Pilih dokumen untuk dibuatkan peta konsep mindmap"
                className="px-3 py-1.5 rounded-xl bg-secondary border border-border text-xs font-extrabold text-foreground focus:outline-none focus:border-primary cursor-pointer shadow-sm"
              >
                <option value="Machine_Learning_Bab2.pdf">📄 Machine_Learning_Bab2.pdf (8 Konsep Utama)</option>
                <option value="Database_System_Design.pdf">📄 Database_System_Design.pdf (Normalisasi & ACID)</option>
              </select>

              <button
                onClick={() => {
                  alert("⚡ AI RAG telah memetakan ulang seluruh relasi antar bab dan node semantik!");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Susun Ulang AI</span>
              </button>
            </div>
          </div>

          {/* CANVAS AND INSPECTOR SIDEBAR SPLIT */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* REACT FLOW CANVAS */}
            <div className="flex-1 h-full bg-background relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes}
                fitView
                className="w-full h-full"
              >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#475569" />
                <Controls className="!bg-card !border !border-border !rounded-xl !shadow-lg !overflow-hidden" />
                <MiniMap
                  className="!bg-card/90 !border !border-border !rounded-2xl !shadow-xl !hidden sm:!block"
                  nodeColor={(node) => {
                    if (node.id === "node-root") return "#3b82f6";
                    if (node.id.includes("supervised") || node.id.includes("reg")) return "#10b981";
                    if (node.id.includes("unsupervised") || node.id.includes("kmeans")) return "#a855f7";
                    return "#f59e0b";
                  }}
                />
              </ReactFlow>

              {/* Canvas floating hint */}
              <div className="absolute top-4 left-4 z-10 bg-card/80 backdrop-blur-md border border-border px-3.5 py-2 rounded-2xl text-xs font-extrabold text-muted-foreground pointer-events-none shadow-md flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                <span>💡 Klik node manapun di canvas untuk melihat penjelasan RAG & rumus di panel kanan. Geser / Zoom bebas.</span>
              </div>
            </div>

            {/* DETAIL INSPECTOR SIDEBAR (DRAWER ON RIGHT) */}
            <div className="w-80 sm:w-96 shrink-0 bg-card/95 backdrop-blur-2xl border-l border-border h-full overflow-y-auto p-5 sm:p-6 flex flex-col justify-between z-20 shadow-2xl">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Inspektor Konsep Semantik
                  </span>
                  {selectedNodeId && (
                    <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      ID: {selectedNodeId}
                    </span>
                  )}
                </div>

                {selectedConcept && (
                  <motion.div
                    key={selectedNodeId || "root"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-black border inline-block mb-2 ${selectedConcept.badgeColor}`}>
                        {selectedConcept.category}
                      </span>
                      <h2 className="text-lg font-black text-foreground leading-snug tracking-tight">
                        {selectedConcept.title}
                      </h2>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/80 border border-border text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                      {selectedConcept.explanation}
                    </div>

                    {selectedConcept.formula && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider">
                          🧮 Rumus Utama Konsep Ini:
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 font-mono text-xs font-bold text-blue-300">
                          {selectedConcept.formula}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider">
                        🟡 Catatan Kunci Ujian:
                      </div>
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 leading-relaxed">
                        ⚠️ {selectedConcept.examNote}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs font-extrabold">
                      <span className="text-muted-foreground">Sumber Referensi:</span>
                      <span className="text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                        📑 {selectedConcept.citation}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ACTION LINKS AT BOTTOM OF INSPECTOR */}
              <div className="pt-6 border-t border-border space-y-2.5 mt-auto">
                <Link
                  href={`/chat?doc=${activeDoc}&query=${encodeURIComponent("Tolong jelaskan lebih mendalam tentang konsep mindmap: " + (selectedConcept?.title || ""))}`}
                  className="w-full py-3 px-4 rounded-2xl bg-primary hover:bg-blue-700 text-primary-foreground text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>💬 Tanya AI tentang Konsep Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/study/flashcards"
                    className="py-2.5 px-3 rounded-xl bg-secondary hover:bg-card border border-border text-xs font-bold text-center text-foreground transition-all"
                  >
                    🃏 Latih Flashcard
                  </Link>
                  <Link
                    href="/study/quizzes"
                    className="py-2.5 px-3 rounded-xl bg-secondary hover:bg-card border border-border text-xs font-bold text-center text-foreground transition-all"
                  >
                    ⚡ Uji Kuis Evaluasi
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function MindmapsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center font-extrabold text-primary">
          Memuat Peta Konsep Mindmap AI...
        </div>
      }
    >
      <MindmapsContent />
    </Suspense>
  );
}
