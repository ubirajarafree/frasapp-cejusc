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

    console.log("Linhas da frase:", linhas);

    const fontSize = Math.floor(width / 18);
    const lineHeight = Math.floor(width / 18) * 1.2; // mesmo que font-size * 1.2
    const totalHeight = linhas.length * lineHeight;
    const startY = height / 2 - totalHeight / 2 + fontSize / 2;

    // 2. Criar SVG com a frase
    const svgText = `
      <svg width="${width}" height="${height}">
        <style>
          text {
            font-size: ${fontSize}px;
            fill: white;
            fill-opacity: 1;
            text-anchor: middle;
          }
        </style>
        <rect width="100%" height="100%" fill="black" fill-opacity="0.3" />
        <text x="50%" y="${startY}" text-anchor="middle">
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
    // const finalImage = await imageSharp
    //   .composite([
    //     {
    //       input: Buffer.from(svgText),
    //       gravity: "center",
    //     },
    //   ])
    //   .png()
    //   .toBuffer();
    
    // 3. Compor imagem com o texto e logo

    const logoResponse = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/logo.png"
      );
    const logoBuffer = Buffer.from(await logoResponse.arrayBuffer());

    
    const margin = 20;
    
    // Pega dimensões do logo
    const { width: logoWidth, height: logoHeight } = await sharp(logoBuffer).metadata();
    
    // Calcula posição com margem (width e height da imagem principal)
    const logoLeft = width - logoWidth! - margin;
    const logoTop = height - logoHeight! - margin;

    const finalImage = await imageSharp
      .composite([
        {
          input: Buffer.from(svgText),
          gravity: "center", // frase centralizada
        },
        {
          input: logoBuffer,
          gravity: "southeast", // canto inferior direito
          left: logoLeft,
          top: logoTop,
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

    return NextResponse.json({ url: publicUrl, file: filePath });
  } catch (err) {
    console.error("Erro geral:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
