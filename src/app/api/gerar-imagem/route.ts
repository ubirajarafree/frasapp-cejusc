import { NextResponse } from "next/server";
import sharp from "sharp";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { imagemUrl, frase, fraseId } = await req.json();

    if (!imagemUrl || !frase || !fraseId) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // 1. Baixar imagem já gerada
    const imageResponse = await fetch(imagemUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    const imageSharp = sharp(Buffer.from(imageBuffer));
    const metadata = await imageSharp.metadata();

    const width = metadata.width || 1024;
    const height = metadata.height || 1024;

    const linhas = frase.split(" ").reduce((acc: string[], palavra: string) => {
      const ultima = acc[acc.length - 1];
      if (!ultima || ultima.length + palavra.length > 30) {
        acc.push(palavra);
      } else {
        acc[acc.length - 1] += " " + palavra;
      }
      return acc;
    }, []);

    // 2. Criar SVG com a frase
    const svgText = `
      <svg width="${width}" height="${height}">
        <style>
          text {
            font-size: ${Math.floor(width / 20)}px;
            fill: white;
            font-family: sans-serif;
            text-anchor: middle;
          }
        </style>
        <text x="50%" y="50%" dominant-baseline="middle">
          ${linhas
            .map(
              (linha: string[], i: number) =>
                `<tspan x="50%" dy="${i === 0 ? "0" : "1.2em"}">${linha}</tspan>`
            )
            .join("")}
        </text>
      </svg>
    `;

    // 3. Compor imagem com o texto
    const finalImage = await imageSharp
      .composite([
        {
          input: Buffer.from(svgText),
          gravity: "center",
        },
      ])
      .png()
      .toBuffer();


    // 4. Upload para Supabase Storage
    const timestamp = Date.now();
    const filePath = `imagem-${fraseId}-${timestamp}.png`;
    
    const { error: uploadError } = await supabase.storage
      .from("Bucket01")
      .upload(filePath, finalImage, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Erro ao salvar imagem:", uploadError.message);
      return NextResponse.json({ error: "Falha no upload" }, { status: 500 });
    }

    // 5. Gerar URL pública
    const publicUrl = supabase.storage
      .from("Bucket01")
      .getPublicUrl(filePath).data.publicUrl;

    // 6. Inserir na tabela 'imagens'
    const { error: insertError } = await supabase
      .from("imagens")
      .insert([{ frase_id: fraseId, url: publicUrl }]);

    if (insertError) {
      console.error("Erro ao salvar na tabela imagens:", insertError.message);
      return NextResponse.json({ error: "Falha ao registrar imagem" }, { status: 500 });
    }

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("Erro geral:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
