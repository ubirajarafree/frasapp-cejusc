"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { supabase } from "@/lib/supabase";
import { Frase } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Wand2, Image as ImageIcon, Save, ArrowLeft, Download, RefreshCcw } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function CriarImagemPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [frase, setFrase] = useState<Frase | null>(null);
  const [prompt, setPrompt] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [fileInfo, setFileInfo] = useState<{ url: string; file: string } | null>(null);
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
      )}?temperature=0.7`;

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

      if (url) {
        setImagemUrl(url);
        setLoadingImage(false);
        toast.success("Imagem gerada. Agora você pode seguir para a próxima etapa.");
      } else {
        toast.error("Não foi possível gerar a imagem.");
      }
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
        toast.success("Sua imagem final foi gerada com sucesso.");
        console.log("URL pública:", data.url);
        setPublicUrl(data.url);
        setFileInfo({
          url: data.url,
          file: data.file,
        });
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

  const handleDownload = async () => {
    if (!publicUrl || !fileInfo) return;

    try {
      const response = await fetch(publicUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      //link.download = 'frasapp-imagem.png'; // Nome do arquivo
      //link.download = `${frase?.conteudo.slice(0, 20)}.png`;
      link.download = `${frase?.conteudo}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Download iniciado!");

      // setTimeout(async () => {
      //   await fetch("/api/deletar-imagem", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ filePath: fileInfo.file }),
      //   });
      // }, 10000);

      localStorage.setItem("frasapp-delete", JSON.stringify({
        filePath: fileInfo.file,
        timestamp: Date.now()
      }));

    } catch (error) {
      console.error("Erro ao baixar imagem:", error);
      toast.error("Não foi possível baixar a imagem.");
    }
  };


  return (
    <>
      <Toaster />
      <div className="container mx-auto p-4 md:p-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center flex-col md:flex-row justify-between gap-4">
              <div className={`
                relative 
                w-full 
                md:w-1/2 
                ${imagemUrl ? 'aspect-square' : 'h-48 md:h-64'}
                border-2 
                border-gray-400 
                border-dashed 
                rounded-lg 
                flex 
                items-center 
                justify-center
                text-center 
                p-4 
                overflow-hidden 
                bg-gray-100 
                dark:bg-gray-900
                `}>
                {imagemUrl ? (
                  <img
                    src={imagemUrl}
                    alt="Imagem gerada"
                    className="absolute inset-0 w-full h-full object-cover z-10"
                  />
                ) : (
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <div className="flex w-full md:w-1/2">
                <p className="w-full bg-black bg-opacity-50 text-white text-base md:text-xl font-semibold p-4 rounded-md z-20">
                  <span className="block text-muted text-xs font-normal mb-2">Gere a imagem com a frase escolhida</span>
                  {frase?.conteudo || "Carregando frase..."}
                </p>
              </div>
            </div>
            <Accordion type="single" collapsible className="w-full mt-6" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <p className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white">1</span>
                    <span>Crie um prompt</span>
                  </p>
                </AccordionTrigger>
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
                <AccordionTrigger>
                  <p className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white">2</span>
                    <span>Gere a imagem</span>
                  </p>
                </AccordionTrigger>
                <AccordionContent>
                  {!imagemUrl ? (
                    <>
                      <span className="flex mb-4">Com o prompt criado, é hora de gerar a imagem. Clique no botão abaixo para gerar a imagem.</span>
                      <Button onClick={gerarImagem} disabled={loadingImage || !prompt || !!imagemUrl}>
                        {loadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                        Gerar Imagem
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex mb-4">Com o prompt criado, é hora de gerar a imagem. Clique no botão abaixo para gerar a imagem.</span>
                      <Button onClick={gerarImagem} disabled={loadingImage || !prompt || !!imagemUrl}>
                        {loadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                        Gerar Imagem
                      </Button>
                      <span className="flex mt-4">Ok. Imagem gerada. Siga para a próxima etapa.</span>
                    </>
                  )}
                  <div className="flex items-center flex-col md:flex-row justify-between gap-4">
                    <div className={`
                      mt-4
                      relative 
                      w-full 
                      md:w-1/2 
                      ${imagemUrl ? 'aspect-square' : 'h-48 md:h-64'}
                      border-2 
                      border-gray-400 
                      border-dashed 
                      rounded-lg 
                      flex 
                      items-center 
                      justify-center
                      text-center 
                      p-4 
                      overflow-hidden 
                      bg-gray-100 
                      dark:bg-gray-900
                      `}>
                      {imagemUrl ? (
                        <img
                          src={imagemUrl}
                          alt="Imagem gerada"
                          className="absolute inset-0 w-full h-full object-cover z-10"
                        />
                      ) : (
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <div className="flex w-full md:w-1/2">
                      <p className="w-full bg-black bg-opacity-50 text-white text-base md:text-xl font-semibold p-4 rounded-md z-20">
                        <span className="block text-muted text-xs font-normal mb-2">Combine a imagem com a frase escolhida</span>
                        {frase?.conteudo || "Carregando frase..."}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" disabled={!imagemUrl}>
                <AccordionTrigger>
                  <p className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white">3</span>
                    <span>Combine a imagem</span>
                  </p>
                </AccordionTrigger>
                <AccordionContent>
                  <span className="flex mb-4">Agora que você já tem a imagem, clique no botão abaixo para combiná-la com a frase escolhida e gerar a imagem final.</span>
                  <Button onClick={salvarImagem} disabled={loadingSalvar || !!publicUrl} variant="default">
                    {loadingSalvar ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Combinar Imagem
                  </Button>
                  {publicUrl && (
                    <div className="relative mt-4">
                      <img
                        src={publicUrl}
                        alt="Imagem gerada com o texto escolhido"
                        className="border rounded shadow"
                      />
                      <Button
                        variant="default"
                        className="absolute top-2 right-2 bg-black text-white hover:bg-gray-900 shadow-lg flex items-center gap-3"
                        style={{ zIndex: 30 }}
                        onClick={handleDownload}
                      >
                        Baixar
                        <Download className="h-5 w-5" />
                      </Button>

                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-8 flex items-center justify-between gap-2">

              <Button variant="outline" onClick={() => {
                setPrompt("");
                setImagemUrl("");
                setPublicUrl("");
              }}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Limpar
              </Button>

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
