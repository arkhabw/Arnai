"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2, AlertCircle } from "lucide-react";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hash = window.location.hash;
        if (!hash) {
          setErrorMsg("Token otorisasi Google tidak ditemukan.");
          return;
        }

        // Parse access_token from hash fragment
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");

        if (!accessToken) {
          setErrorMsg("Akses token Google tidak valid atau kedaluwarsa.");
          return;
        }

        const success = await loginWithGoogle(accessToken);
        if (success) {
          router.push("/dashboard");
        } else {
          setErrorMsg("Gagal melakukan otentikasi profil pengguna.");
        }
      } catch (err: any) {
        console.error("OAuth Error:", err);
        setErrorMsg(err.message || "Gagal menghubungkan akun Google Anda.");
      }
    };

    handleCallback();
  }, [loginWithGoogle, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="glass-card rounded-3xl border border-border p-8 max-w-sm w-full text-center shadow-xl space-y-4">
        {errorMsg ? (
          <>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-foreground">Otentikasi Gagal</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{errorMsg}</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-blue-700 text-primary-foreground font-bold text-xs transition-all shadow-sm"
            >
              Kembali ke Halaman Login
            </button>
          </>
        ) : (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <h3 className="text-base font-extrabold text-foreground">Mendapatkan Profil Google</h3>
            <p className="text-xs text-muted-foreground">
              Harap tunggu sebentar selagi kami mengamankan sesi masuk Anda...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
