"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Frase } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function FraseGallery() {
  const [frases, setFrases] = useState<Frase[]>([]);
  const [fraseSelecionada, setFraseSelecionada] = useState<Frase | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchFrases = async () => {
      const { data, error } = await supabase
        .from("frases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {console.error("Erro ao buscar frases:", error.message);}
      else {
        setFrases(data || []);
        setLoading(false);
      }
    };

    fetchFrases();
  }, []);

  const handleSelecionar = (frase: Frase) => {
    setFraseSelecionada((prev) => (prev?.id === frase.id ? null : frase));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  return (
    <div className="relative p-4">
      <div className="masonry-grid">
        {frases.map((frase) => (
          <div
            key={frase.id}
            onClick={() => handleSelecionar(frase)}
            className={`masonry-item cursor-pointer p-6 rounded-xl border-2 transition-all ${
              fraseSelecionada?.id === frase.id
                ? "border-gray-600 bg-gray-100"
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
          <Button
            onClick={() => router.push(`/criar-imagem?id=${fraseSelecionada.id}`)}
            className="shadow-lg text-2xl px-8 py-6"
          >
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
}
