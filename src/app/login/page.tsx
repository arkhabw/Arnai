"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Validation Schemas
const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, register: registerUser, loginAsQuickDemo, isLoading: authLoading } = useAuth();

  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Hook form for login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Hook form for register
  const {
    register: registerReg,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: regErrors, isSubmitting: isRegSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        setSuccessMsg("Login berhasil! Mengalihkan ke workspace...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 600);
      }
    } catch (e) {
      setErrorMsg("Gagal login. Periksa kembali email dan password Anda.");
    }
  };

  const onRegister = async (data: RegisterFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const success = await registerUser(data.name, data.email, data.password);
      if (success) {
        setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke workspace...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 600);
      }
    } catch (e) {
      setErrorMsg("Gagal mendaftar akun baru.");
    }
  };

  const handleQuickDemo = async () => {
    setErrorMsg(null);
    setIsDemoLoading(true);
    try {
      await loginAsQuickDemo();
    } catch (e) {
      setErrorMsg("Gagal masuk mode demo.");
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>

        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center p-1">
            <Image src="/logo.png" alt="Arnai" width={28} height={28} className="object-contain" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-foreground">
            Arnai<span className="text-primary font-bold">.ai</span>
          </span>
        </Link>
      </div>

      {/* Main Card Container */}
      <div className="max-w-md mx-auto w-full my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-3xl border border-border p-6 sm:p-8 shadow-xl relative"
        >
          {/* Header & Tabs */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-3 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> Akses Workspace AI
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {mode === "login" ? "Selamat Datang Kembali" : "Mulai Belajar Cerdas"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
              {mode === "login"
                ? "Masuk ke akun Anda untuk melanjutkan penguasaan materi."
                : "Buat akun gratis dan rasakan kekuatan RAG interaktif."}
            </p>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-secondary/80 border border-border rounded-xl mt-5">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  mode === "login"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Masuk (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  mode === "register"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Daftar Baru
              </button>
            </div>
          </div>

          {/* Quick Demo Hero CTA */}
          <div className="mb-6 pb-6 border-b border-border">
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={isDemoLoading || authLoading}
              className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 shadow-md transition-all duration-300 active:scale-[0.99] disabled:opacity-70"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                    <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Rekomendasi Tercepat
                    </div>
                    <div className="text-sm font-extrabold text-white">
                      ⚡ Quick Demo Login (Seed Mode)
                    </div>
                  </div>
                </div>
                {isDemoLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                )}
              </div>
              <div className="mt-2 text-left text-[11px] text-blue-100 font-medium bg-white/10 px-2.5 py-1 rounded-lg">
                ✨ Masuk instan sebagai <strong>Arkha B. W.</strong> dengan data 2 materi, kuis & flashcard contoh siap pakai!
              </div>
            </button>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLoginSubmit(onLogin)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      {...registerLogin("email")}
                      placeholder="contoh: arkha@arnai.ai"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-[11px] font-bold text-red-500 mt-1">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-foreground">Password</label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-bold text-primary hover:underline"
                    >
                      Lupa Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      {...registerLogin("password")}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  {loginErrors.password && (
                    <p className="text-[11px] font-bold text-red-500 mt-1">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoginSubmitting || authLoading}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground font-bold text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                >
                  {isLoginSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Memeriksa Kredensial...
                    </>
                  ) : (
                    <>Masuk Sekarang</>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegisterSubmit(onRegister)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      {...registerReg("name")}
                      placeholder="contoh: Arkha B. W."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  {regErrors.name && (
                    <p className="text-[11px] font-bold text-red-500 mt-1">
                      {regErrors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      {...registerReg("email")}
                      placeholder="contoh: arkha@arnai.ai"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  {regErrors.email && (
                    <p className="text-[11px] font-bold text-red-500 mt-1">
                      {regErrors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Buat Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      {...registerReg("password")}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  {regErrors.password && (
                    <p className="text-[11px] font-bold text-red-500 mt-1">
                      {regErrors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isRegSubmitting || authLoading}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground font-bold text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                >
                  {isRegSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Membuat Akun...
                    </>
                  ) : (
                    <>Daftar Akun Gratis</>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Trust Badge Footer */}
          <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Enkripsi privasi 256-bit. Ruang kerja terisolasi.</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Legal */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs font-medium text-muted-foreground">
        © {new Date().getFullYear()} Arnai.ai — Semua Hak Dilindungi.
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
