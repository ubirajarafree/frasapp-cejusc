"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Frase } from "@/lib/types";
import Spinner from "./spinner";

export default function CriarImagemPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [frase, setFrase] = useState<Frase | null>(null);
  const [prompt, setPrompt] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

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

  const sugerirPrompt = async () => {
    if (!frase?.conteudo) return;
    setLoadingPrompt(true);
    try {
      const textPrompt = `Com base na frase "${frase.conteudo}", sugira apenas um prompt elaborado de no máximo 4 linhas para gerar uma imagem que combine com ela.`;

      const endpoint = `https://text.pollinations.ai/${encodeURIComponent(
        textPrompt
      )}`;

      const response = await fetch(endpoint);
      const texto = await response.text();
      setPrompt(texto);
    } catch (error) {
      console.error("Erro ao sugerir prompt:", error);
    } finally {
      setLoadingPrompt(false);
    }
  };

  const gerarImagem = async () => {
    if (!prompt) return;
    setLoadingImage(true);
    setTimeout(() => {
      try {
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
          prompt
        )}?enhance=true&nologo=true`;
        setImagemUrl(url);
      } catch (error) {
        console.error("Erro ao gerar imagem:", error);
      } finally {
        setLoadingImage(false);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">

      <div className="relative w-[500px] h-[500px] border border-gray-700 rounded-xl shadow-lg flex items-center justify-center text-center p-6">
        {imagemUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagemUrl}
              alt="Imagem gerada"
              className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-50 z-0"
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
          className="w-full text-sm p-3 rounded bg-gray-900 border border-gray-700 text-white"
          rows={8}
          disabled={loadingPrompt || loadingImage}
        />

        <div className="flex gap-2 items-center justify-center">
          <button
            onClick={sugerirPrompt}
            disabled={loadingPrompt || !frase?.conteudo || loadingImage || prompt !== ""}
            className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {loadingPrompt && <Spinner size={20} color="white" />}
            <span>{loadingPrompt ? "Aguarde..." : "Sugerir prompt com IA"}</span>
          </button>

          <button
            onClick={gerarImagem}
            disabled={loadingImage || !prompt || loadingPrompt || imagemUrl !== ""}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {loadingImage && <Spinner size={20} color="white" />}
            <span>{loadingImage ? "Gerando..." : "Gerar imagem"}</span>
          </button>

        {imagemUrl && (
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded transition"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
        )}

        </div>

      </div>
    </div>
  );
}
