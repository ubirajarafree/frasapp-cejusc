"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { supabase } from "@/lib/supabase";
import { Frase } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Wand2, Image as ImageIcon, Save, ArrowLeft } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function CriarImagemPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [frase, setFrase] = useState<Frase | null>(null);
  const [prompt, setPrompt] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingSalvar, setLoadingSalvar] = useState(false);

  useEffect(() => {
    const fetchFrase = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("frases")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar frase:", error.message);
        toast.error("Não foi possível carregar a frase.");
      } else 
        setFrase(data);
    };

    fetchFrase();
  }, [id]);

  const sugerirPrompt = async () => {
    if (!frase?.conteudo) return;
    setLoadingPrompt(true);
    try {
      const textPrompt = `Baseado na frase "${frase.conteudo}", sugira um prompt em português, detalhado e artístico para gerar uma imagem. O prompt deve ter no máximo 4 linhas e focar em um estilo visual específico (ex: "cinematic, 4k, photorealistic, vibrant colors"). Retorne apenas o prompt.`;

      const endpoint = `https://text.pollinations.ai/${encodeURIComponent(
        textPrompt
      )}`;

      const response = await fetch(endpoint);
      const texto = await response.text();
      setPrompt(texto);
    } catch (error) {
      console.error("Erro ao sugerir prompt:", error);
      toast.error("Não foi possível sugerir um prompt.");
    } finally {
      setLoadingPrompt(false);
    }
  };

  const gerarImagem = async () => {
    if (!prompt) return;
    setLoadingImage(true);
    // A API de imagem pode ser lenta, então um timeout ajuda a simular o carregamento
    // e evitar que o usuário pense que a página travou.
    setTimeout(() => { // Simula o tempo de geração
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        prompt
      )}?enhance=true&nologo=true`;
      setImagemUrl(url);
      setLoadingImage(false);
      toast.success("Imagem gerada. Agora você pode salvá-la.");
    }, 4000); // Aumentei o tempo para uma simulação mais realista
  };

  const salvarImagem = async () => {
    if (!imagemUrl || !frase?.conteudo || !id) return;
    setLoadingSalvar(true);

    try {
      const response = await fetch("/api/gerar-imagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagemUrl,
          frase: frase.conteudo,
          fraseId: id,
        }),
      });

      const data = await response.json();


      if (response.ok) {
        toast.success("Sua imagem foi salva com sucesso no nosso banco de dados.");
        console.log("URL pública:", data.url);
        setPublicUrl(data.url);
      } else {
        console.error("Erro ao salvar:", data.error);
        toast.error(data.error || "Não foi possível salvar a imagem.");
      }
    } catch (error) {
      console.error("Erro geral:", error);
      toast.error("Ocorreu um erro de rede.");
    } finally {
      setLoadingSalvar(false);
    }
  };


  return (
    <>
      <Toaster />
      <div className="container mx-auto p-4 md:p-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="relative w-full aspect-square border border-dashed rounded-lg flex items-center justify-center text-center p-6 overflow-hidden bg-gray-100 dark:bg-gray-900">
              {imagemUrl ? (
                <img
                  src={imagemUrl}
                  alt="Imagem gerada"
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              ) : (
                <ImageIcon className="h-16 w-16 text-gray-400" />
              )}
              <p className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white text-xl md:text-2xl font-semibold p-4 rounded-md z-20">
                {frase?.conteudo || "Carregando frase..."}
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full mt-6" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>Passo 1: Crie um prompt</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <Textarea
                    placeholder="Descreva a imagem que você quer gerar..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    disabled={loadingPrompt || loadingImage}
                  />
                  <Button onClick={sugerirPrompt} disabled={loadingPrompt || !frase?.conteudo || loadingImage || !!prompt}>
                    {loadingPrompt ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Sugerir com IA
                  </Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" disabled={!prompt}>
                <AccordionTrigger>Passo 2: Gere a imagem com o prompt</AccordionTrigger>
                <AccordionContent>
                  <Button onClick={gerarImagem} disabled={loadingImage || !prompt || !!imagemUrl}>
                    {loadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                    Gerar Imagem
                  </Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" disabled={!imagemUrl}>
                <AccordionTrigger>Passo 3: Gere a imagem com a frase</AccordionTrigger>
                <AccordionContent>
                  <Button onClick={salvarImagem} disabled={loadingSalvar || !!publicUrl} variant="secondary">
                    {loadingSalvar ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar Imagem
                  </Button>
                  {publicUrl && (
                    <img
                      src={publicUrl}
                      alt="Imagem gerada com o texto escolhido"
                      className="mt-4 border rounded shadow"
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-8 flex justify-end">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
