import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Arnai — Learn easier with AI",
  description:
    "Gabungan kekuatan Notion, Quizlet, ChatGPT, dan Coursera dalam satu platform AI super pintar untuk membantu memahami materi, membuat kuis, flashcard, dan melacak progres belajar Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
        {children}
      </body>
    </html>
  );
}

