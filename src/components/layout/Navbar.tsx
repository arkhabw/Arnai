"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Moon, Sun, Menu, X, ArrowRight, BookOpen } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border py-3 shadow-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Utama */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="Arnai Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-foreground">
            Arnai<span className="text-primary font-bold">.ai</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
          <a
            href="#how-it-works"
            className="hover:text-foreground transition-colors py-1"
          >
            Cara Kerja
          </a>
          <a
            href="#features"
            className="hover:text-foreground transition-colors py-1"
          >
            Fitur AI
          </a>
          <a
            href="#faq"
            className="hover:text-foreground transition-colors py-1"
          >
            FAQ
          </a>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-primary hover:opacity-80 font-bold transition-opacity"
          >
            <BookOpen className="w-4 h-4" /> Preview Dashboard
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl font-bold text-sm text-foreground hover:text-primary transition-colors"
          >
            Masuk
          </Link>

          <Link
            href="/login?mode=register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-sm active:scale-[0.98]"
          >
            Mulai Belajar Gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg border border-border bg-card text-muted-foreground"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            className="p-2 rounded-lg border border-border bg-card text-foreground"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 px-4 pt-3 pb-6 bg-card/95 backdrop-blur-xl border-b border-border shadow-lg">
          <div className="flex flex-col gap-3 font-semibold text-muted-foreground">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-foreground border-b border-border/50"
            >
              Cara Kerja
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-foreground border-b border-border/50"
            >
              Fitur AI
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-foreground border-b border-border/50"
            >
              FAQ
            </a>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-primary font-bold border-b border-border/50 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Preview Dashboard
            </Link>

            <div className="flex flex-col gap-2 pt-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-border text-foreground font-bold"
              >
                Masuk
              </Link>
              <Link
                href="/login?mode=register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm"
              >
                Mulai Belajar Gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

