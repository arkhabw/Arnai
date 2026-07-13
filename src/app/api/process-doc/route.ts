import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, fileType, fileSize } = body;

    if (!filename) {
      return NextResponse.json(
        { success: false, error: "Nama dokumen wajib disertakan untuk pemrosesan AI." },
        { status: 400 }
      );
    }

    // Simulasi atau kalkulasi cerdas jumlah chunk & konsep berdasar ukuran file
    const sizeInMB = parseFloat(fileSize) || 2.5;
    const estimatedWords = Math.round(sizeInMB * 1800);
    const chunkCount = Math.max(12, Math.round(estimatedWords / 150));
    const extractedConcepts = Math.min(24, Math.max(6, Math.round(chunkCount / 3)));

    // Struktur respons data dokumen yang telah di-parse oleh RAG Pipeline
    const processedDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      filename,
      fileType: fileType || "application/pdf",
      fileSize: fileSize || "2.5 MB",
      status: "ready",
      statusText: "🟢 RAG Ready & Indexed",
      chunksCount: chunkCount,
      extractedConcepts,
      createdAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      summaryPreview: `Dokumen "${filename}" berhasil diekstraksi. Mengandung ${estimatedWords} kata yang dipecah menjadi ${chunkCount} vektor semantik dengan overlap 50 token. AI telah mengenali ${extractedConcepts} konsep utama untuk pembuatan Kuis, Flashcard, dan Chat Citations.`,
      conceptsList: [
        { title: "Definisi Utama & Konsep Dasar", chunks: Math.round(chunkCount * 0.3) },
        { title: "Rumus, Prinsip, & Algoritma", chunks: Math.round(chunkCount * 0.35) },
        { title: "Studi Kasus & Analisis Penerapan", chunks: Math.round(chunkCount * 0.2) },
        { title: "Ringkasan Bab & Poin Ujian", chunks: Math.round(chunkCount * 0.15) },
      ],
    };

    // Simulate network delay slightly for realistic API feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      message: `Pemrosesan RAG untuk ${filename} selesai.`,
      data: processedDocument,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Terjadi kesalahan internal pada server AI." },
      { status: 500 }
    );
  }
}
