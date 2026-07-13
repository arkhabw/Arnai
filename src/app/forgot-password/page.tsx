"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, Loader2, Sparkles, Send } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Halaman Login</span>
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
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-3 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> Pemulihan Akun
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Lupa Password?
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
              Masukkan email yang terdaftar untuk menerima tautan reset kata sandi Anda.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isSent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Tautan Pemulihan Terkirim!</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
                  Kami telah mengirimkan instruksi pemulihan password ke email Anda. Silakan periksa kotak masuk (atau folder spam).
                </p>
                <Link
                  href="/login"
                  className="block w-full py-3 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground font-bold text-sm transition-all shadow-sm text-center"
                >
                  Kembali untuk Masuk
                </Link>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Alamat Email Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="contoh: arkha@arnai.ai"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] font-bold text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground font-bold text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Mengirim Tautan...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Kirim Tautan Reset
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom Legal */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs font-medium text-muted-foreground">
        © {new Date().getFullYear()} Arnai.ai — Semua Hak Dilindungi.
      </div>
    </div>
  );
}
