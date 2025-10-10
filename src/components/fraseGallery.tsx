"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Frase } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export default function FraseGallery() {
  const [frases, setFrases] = useState<Frase[]>([]);
  const [fraseSelecionada, setFraseSelecionada] = useState<Frase | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFrases = async () => {
      const { data, error } = await supabase
        .from("frases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Erro ao buscar frases:", error.message);
      else setFrases(data || []);
    };

    fetchFrases();
  }, []);

  const handleSelecionar = (frase: Frase) => {
    setFraseSelecionada((prev) => (prev?.id === frase.id ? null : frase));
  };

  return (
    <div className="relative p-4">
      <div className="masonry-grid">
        {frases.map((frase) => (
          <div
            key={frase.id}
            onClick={() => handleSelecionar(frase)}
            className={`masonry-item cursor-pointer p-6 rounded-xl border-2 transition-all ${
              fraseSelecionada?.id === frase.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <p className="text-3xl font-semibold leading-snug">{frase.conteudo}</p>
            {frase.autor && (
              <p className="mt-2 text-right italic text-sm text-gray-500">
                — {frase.autor}
              </p>
            )}
          </div>
        ))}
      </div>

      {fraseSelecionada && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => router.push(`/criar-imagem?id=${fraseSelecionada.id}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
