"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Moon, Sun, Menu, X, ArrowRight, BookOpen } from "lucide-react";

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
          ? "bg-background/80 backdrop-blur-md border-b border-border py-3 shadow-lg shadow-black/5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-foreground via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Arnai<span className="text-primary font-bold">.ai</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
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
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
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
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl font-medium text-sm text-foreground hover:text-primary transition-colors"
          >
            Masuk
          </Link>

          <Link
            href="/login?mode=register"
            className="relative group overflow-hidden rounded-xl p-px font-semibold text-sm"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl group-hover:opacity-90 transition-opacity"></span>
            <span className="relative flex items-center gap-2 px-5 py-2.5 rounded-[11px] bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
              Mulai Belajar Gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg border border-border bg-card text-muted-foreground"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
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
        <div className="md:hidden mt-3 px-4 pt-3 pb-6 bg-card/95 backdrop-blur-xl border-b border-border animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3 font-medium text-muted-foreground">
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
              className="py-2 text-indigo-400 font-semibold border-b border-border/50 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Preview Dashboard
            </Link>

            <div className="flex flex-col gap-2 pt-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-border text-foreground font-medium"
              >
                Masuk
              </Link>
              <Link
                href="/login?mode=register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-md shadow-indigo-500/20"
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
