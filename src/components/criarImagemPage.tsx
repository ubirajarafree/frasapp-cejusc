"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Frase } from "@/lib/types";

export default function CriarImagemPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [frase, setFrase] = useState<Frase | null>(null);
  const [prompt, setPrompt] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");

  useEffect(() => {
    const fetchFrase = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("frases")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Erro ao buscar frase:", error.message);
      else setFrase(data);
    };

    fetchFrase();
  }, [id]);

  const gerarImagem = async () => {
    if (!prompt) return;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?enhance=true&nologo=true`;
    setImagemUrl(url);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Criação de Imagem</h1>

      <div className="relative w-[500px] h-[500px] border border-gray-700 rounded-xl shadow-lg flex items-center justify-center text-center p-6">
        {imagemUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagemUrl}
              alt="Imagem gerada"
              className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-30 z-0"
            />
          </>
        )}
        <p className="text-3xl font-semibold z-10">{frase?.conteudo}</p>
      </div>

      <div className="mt-8 w-full max-w-xl space-y-4">
        <textarea
          placeholder="Sugira um prompt para a imagem..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
          rows={4}
        />

        <button
          onClick={gerarImagem}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
        >
          Gerar imagem
        </button>
      </div>
    </div>
  );
}
