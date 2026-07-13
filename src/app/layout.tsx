import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Arnai — Learn easier with AI",
  description:
    "Arnai adalah platform belajar cerdas berbasis AI All-in-One. Unggah PDF, PPT, atau catatan Anda dan ubah seketika menjadi percakapan RAG akurat, kuis interaktif, flashcard 3D, serta peta konsep visual untuk penguasaan materi 10x lebih cepat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

