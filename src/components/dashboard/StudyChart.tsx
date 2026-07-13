"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Clock, CheckCircle, TrendingUp, Sparkles, BarChart2 } from "lucide-react";

const weeklyData = [
  { day: "Sen", menit: 45, kuis: 3, akurasi: 85 },
  { day: "Sel", menit: 60, kuis: 5, akurasi: 88 },
  { day: "Rab", menit: 30, kuis: 2, akurasi: 80 },
  { day: "Kam", menit: 90, kuis: 7, akurasi: 92 },
  { day: "Jum", menit: 75, kuis: 6, akurasi: 90 },
  { day: "Sab", menit: 120, kuis: 10, akurasi: 95 },
  { day: "Min", menit: 85, kuis: 8, akurasi: 89 },
];

const monthlyData = [
  { day: "Minggu 1", menit: 280, kuis: 22, akurasi: 84 },
  { day: "Minggu 2", menit: 350, kuis: 30, akurasi: 87 },
  { day: "Minggu 3", menit: 410, kuis: 35, akurasi: 91 },
  { day: "Minggu 4", menit: 505, kuis: 41, akurasi: 93 },
];

export function StudyChart({ isDemo }: { isDemo: boolean }) {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("weekly");
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const data = timeRange === "weekly" ? weeklyData : monthlyData;
  const totalMinutes = data.reduce((acc, curr) => acc + curr.menit, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalQuizzes = data.reduce((acc, curr) => acc + curr.kuis, 0);
  const avgAccuracy = Math.round(data.reduce((acc, curr) => acc + curr.akurasi, 0) / data.length);

  return (
    <div className="glass-card rounded-3xl border border-border p-6 shadow-lg flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-[11px] mb-2 border border-primary/20">
            <TrendingUp className="w-3 h-3" /> AI Study Analytics
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            Aktivitas Waktu Belajar & Kuis
          </h3>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            {isDemo
              ? "Menampilkan grafik keaktifan belajar dan RAG interaktif akun Arkha."
              : "Pantau konsistensi dan efisiensi belajar Anda secara real-time."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Toggle Type */}
          <div className="flex items-center p-1 bg-secondary/80 border border-border rounded-xl text-xs font-bold">
            <button
              onClick={() => setChartType("area")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                chartType === "area" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grafik Area"
            >
              Area
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                chartType === "bar" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grafik Bar"
            >
              Bar
            </button>
          </div>

          {/* Toggle Range */}
          <div className="flex items-center p-1 bg-secondary/80 border border-border rounded-xl text-xs font-bold">
            <button
              onClick={() => setTimeRange("weekly")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === "weekly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => setTimeRange("monthly")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === "monthly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bulan Ini
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Durasi</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-foreground">
            {totalHours} <span className="text-xs font-bold text-muted-foreground">Jam</span>
          </div>
          <div className="text-[10px] text-emerald-500 font-bold mt-1">▲ +18% dari minggu lalu</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Soal Kuis Selesai</span>
            <CheckCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-foreground">
            {totalQuizzes} <span className="text-xs font-bold text-muted-foreground">Soal</span>
          </div>
          <div className="text-[10px] text-emerald-500 font-bold mt-1">▲ +12 soal AI baru</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rata-rata Skor Kuis</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-foreground">
            {avgAccuracy}<span className="text-xs font-bold text-muted-foreground">%</span>
          </div>
          <div className="text-[10px] text-blue-400 font-bold mt-1">🎯 Akurasi Jawaban Anda</div>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-[240px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMenit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorKuis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                formatter={(value: any, name: any) => [
                  name === "menit" ? `${value} Menit Belajar` : `${value} Soal Kuis`,
                  name === "menit" ? "Durasi Belajar" : "Kuis & Flashcard",
                ]}
              />
              <Area
                type="monotone"
                dataKey="menit"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorMenit)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
              />
              <Area
                type="monotone"
                dataKey="kuis"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorKuis)"
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                formatter={(value: any, name: any) => [
                  name === "menit" ? `${value} Menit Belajar` : `${value} Soal Kuis`,
                  name === "menit" ? "Durasi Belajar" : "Kuis & Flashcard",
                ]}
              />
              <Bar dataKey="menit" fill="#2563eb" radius={[6, 6, 0, 0]} name="Waktu (Menit)" />
              <Bar dataKey="kuis" fill="#6366f1" radius={[6, 6, 0, 0]} name="Kuis Selesai" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
