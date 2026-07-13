"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  Send,
  FileText,
  User as UserIcon,
  LogOut,
  Bot,
  RefreshCw,
  BookOpen,
  Info,
  Sliders,
  CheckCircle2,
  Paperclip,
  Key,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  Zap,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: {
    source: string;
    section: string;
    page: string;
    snippet: string;
  }[];
  engineUsed?: string;
}

const initialSuggestions = [
  "🎯 Jelaskan perbedaan Supervised dan Unsupervised dari Bab 2 beserta contohnya.",
  "📊 Buatkan tabel perbandingan normalisasi 1NF, 2NF, dan 3NF dari buku Database.",
  "🧮 Tunjukkan rumus Gradient Descent dan jelaskan fungsi parameter learning rate.",
  "💡 Berikan 5 poin kunci yang pasti keluar di ujian dari dokumen ini.",
];

function ChatContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const docParam = searchParams.get("doc");

  const [activeDocument, setActiveDocument] = useState<string>(
    docParam || "Machine_Learning_Bab2.pdf"
  );
  const [engineMode, setEngineMode] = useState<"hybrid" | "gemini">("hybrid");
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: `### 👋 Halo Arkha! Saya Arnai AI RAG Assistant Anda.

Saya telah memindai dan mengindeks dokumen aktif Anda: **"${docParam || "Machine_Learning_Bab2.pdf"}"**.
Anda dapat mengajukan pertanyaan apa saja mengenai bab ini, meminta ringkasan, atau menguji pemahaman Anda. Setiap jawaban ilmiah saya akan disertai dengan **Citation Badges (Kutipan Bab & Halaman spesifik)** langsung dari sumber dokumen Anda!

---
#### 🚀 Pilih Mode Mesin AI di Atas:
- **⚡ Arnai Hybrid RAG Engine (Aktif Secara Default)**: Bekerja instan & akurat tanpa memerlukan API Key ekstensi apa pun!
- **🌐 Google Gemini 1.5 Flash**: Hubungkan langsung ke Google AI Studio dengan memasukkan API Key Anda di tombol pengaturan (*⚙️ API Key*).`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      engineUsed: "Arnai Hybrid RAG Engine (Smart Embedded Mode)",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = user || {
    id: "usr-guest",
    name: "Pelajar Tamu",
    email: "tamu@arnai.ai",
    avatar: "",
    role: "Guest Account",
    isDemo: true,
    provider: "demo" as const,
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (docParam && docParam !== activeDocument) {
      setActiveDocument(docParam);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-switch-${Date.now()}`,
          role: "assistant",
          content: `📑 **Konteks Dokumen Diperbarui**: Dokumen RAG aktif Anda sekarang beralih ke **"${docParam}"**. Semua sitasi dan analisis berikutnya akan diprioritaskan dari indeks vektor dokumen ini.`,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          engineUsed: engineMode === "gemini" ? "Google Gemini 1.5 Flash" : "Arnai Hybrid RAG Engine",
        },
      ]);
    }
  }, [docParam]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: MessageItem = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInputQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          documentName: activeDocument,
          apiKey: apiKey.trim() || undefined,
          engine: engineMode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const assistantMsg: MessageItem = {
          id: `msg-ai-${Date.now()}`,
          role: "assistant",
          content: result.reply,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          citations: result.citations || [],
          engineUsed: result.engineUsed || "Arnai RAG Engine",
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errorMsg: MessageItem = {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content: `❌ **Terjadi Kendala Teknis**: ${
            result.error || "Gagal menghubungi mesin RAG AI."
          }\n\n💡 *Saran*: Pastikan koneksi internet stabil atau alihkan Mode Mesin ke **Arnai Hybrid RAG Engine** jika API Key Gemini mengalami batas limit (*Rate Limit*).`,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-network-err-${Date.now()}`,
          role: "assistant",
          content: "⚠️ **Koneksi Terputus**: Tidak dapat terhubung ke server '/api/chat'. Silakan periksa jaringan Anda.",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
              href="/documents"
              className="px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              Unggah Materi (`/documents`)
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
          {/* Top Control Header Bar inside Chat */}
          <div className="bg-card/90 border-b border-border p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Active Document Dropdown */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  Dokumen RAG Aktif:
                </div>
                <select
                  value={activeDocument}
                  onChange={(e) => setActiveDocument(e.target.value)}
                  aria-label="Pilih dokumen RAG aktif"
                  className="bg-transparent text-xs font-extrabold text-foreground focus:outline-none cursor-pointer pr-4"
                >
                  <option value="Machine_Learning_Bab2.pdf">📄 Machine_Learning_Bab2.pdf (42 Chunks)</option>
                  <option value="Database_System_Design.pdf">📄 Database_System_Design.pdf (64 Chunks)</option>
                  <option value="Jurnal_Neural_Networks_2025.pdf">📄 Jurnal_Neural_Networks_2025.pdf (28 Chunks)</option>
                </select>
              </div>
            </div>

            {/* AI Engine Switcher & API Key Config */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 bg-secondary border border-border rounded-xl text-xs font-bold">
                <button
                  onClick={() => setEngineMode("hybrid")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    engineMode === "hybrid"
                      ? "bg-primary text-primary-foreground shadow-sm font-extrabold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Mesin Arnai Hybrid (Instant Tanpa API Key)"
                >
                  <Zap className="w-3.5 h-3.5" /> Arnai Hybrid RAG
                </button>
                <button
                  onClick={() => setEngineMode("gemini")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    engineMode === "gemini"
                      ? "bg-blue-600 text-white shadow-sm font-extrabold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Hubungkan ke Google Gemini 1.5 Flash Cloud API"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Google Gemini API
                </button>
              </div>

              <button
                onClick={() => setShowApiKeyModal(true)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  apiKey
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : "bg-secondary/80 border-border text-muted-foreground hover:text-foreground"
                }`}
                title="Atur API Key Gemini Anda"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{apiKey ? "API Key Aktif" : "⚙️ API Key"}</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Canvas */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 sm:gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-9 h-9 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0 border border-primary/30 shadow-sm mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 shadow-md ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-white/10 text-[11px] opacity-80">
                    <span className="font-extrabold flex items-center gap-1.5">
                      {msg.role === "assistant" ? "🤖 Arnai AI RAG Engine" : currentUser.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {msg.engineUsed && (
                        <span className="px-2 py-0.5 rounded-md bg-secondary/80 text-muted-foreground font-bold text-[10px]">
                          {msg.engineUsed}
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* Message Body Markdown */}
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed font-normal">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Citations Badges Section */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/80 space-y-2">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Sumber Referensi & Sitasi Vektor ({msg.citations.length}):
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.citations.map((cite, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-secondary/80 border border-border text-xs space-y-1 hover:border-primary/50 transition-colors"
                          >
                            <div className="flex items-center justify-between font-extrabold text-foreground">
                              <span className="truncate max-w-[160px]">{cite.section}</span>
                              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px]">
                                {cite.page}
                              </span>
                            </div>
                            <div className="text-[11px] text-muted-foreground font-medium italic line-clamp-2">
                              "{cite.snippet}"
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Copy Button */}
                  {msg.role === "assistant" && (
                    <div className="flex justify-end mt-3 pt-2 border-t border-border/40">
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" /> Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Salin Jawaban
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-2xl bg-secondary text-foreground flex items-center justify-center shrink-0 border border-border mt-1">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Loading Typing Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 text-xs font-bold text-muted-foreground pl-12"
              >
                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                <span>Arnai RAG AI sedang menelusuri vektor semantik dari {activeDocument}...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Section */}
          <div className="p-4 bg-card/90 border-t border-border space-y-3 shrink-0">
            {/* Quick Suggestion Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-bold text-muted-foreground shrink-0 flex items-center gap-1">
                💡 Saran Cepat:
              </span>
              {initialSuggestions.map((sug, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(sug)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-xl bg-secondary/80 hover:bg-primary/10 hover:border-primary/30 text-xs font-semibold text-muted-foreground hover:text-primary border border-border transition-all shrink-0 max-w-xs truncate"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 bg-secondary/60 border border-border rounded-2xl p-2 focus-within:border-primary/60 transition-colors shadow-inner">
              <Link
                href="/documents"
                title="Unggah atau kelola dokumen baru"
                className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </Link>

              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder={`Tanya apa saja tentang "${activeDocument}"... (Tekan Enter untuk kirim)`}
                disabled={isLoading}
                className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none px-2"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputQuery.trim() || isLoading}
                className={`p-2.5 sm:px-5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md ${
                  !inputQuery.trim() || isLoading
                    ? "bg-secondary text-muted-foreground opacity-60 cursor-not-allowed"
                    : "bg-primary hover:bg-blue-700 text-primary-foreground active:scale-95"
                }`}
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Kirim ke AI</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5"
            >
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground">Konfigurasi Google Gemini API Key</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      Opsional: Hubungkan ke model Gemini cloud pribadi Anda.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground hover:text-foreground text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs font-medium text-muted-foreground leading-relaxed">
                <p>
                  Secara default, aplikasi ini menggunakan **Arnai Hybrid RAG Engine** yang bekerja instan tanpa API Key apa pun.
                </p>
                <p>
                  Namun, jika Anda memiliki API Key resmi dari <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-primary underline font-bold">Google AI Studio</a>, masukkan di bawah ini agar obrolan diproses langsung oleh cloud Gemini 1.5 Flash:
                </p>

                <div className="space-y-1 pt-1">
                  <label className="text-xs font-extrabold text-foreground">GEMINI API KEY ANDA:</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-foreground font-mono text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  onClick={() => {
                    setApiKey("");
                    setEngineMode("hybrid");
                    setShowApiKeyModal(false);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-border hover:bg-secondary text-xs font-bold text-muted-foreground"
                >
                  Hapus & Pakai Hybrid Mode
                </button>
                <button
                  onClick={() => {
                    if (apiKey.trim()) setEngineMode("gemini");
                    setShowApiKeyModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground text-xs font-extrabold shadow-md"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center font-extrabold text-primary">
          Memuat Ruang AI RAG...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
