import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { filePath } = await req.json();

  if (!filePath) {
    return NextResponse.json({ error: "Caminho da imagem não informado." }, { status: 400 });
  }

  // 1. Deletar do bucket
  const { error: deleteError } = await supabase.storage
    .from("Bucket01")
    .remove([filePath]);

  if (deleteError) {
    console.error("Erro ao deletar do bucket:", deleteError.message);
    return NextResponse.json({ error: "Falha ao deletar imagem." }, { status: 500 });
  }

  // 2. Deletar da tabela
  const { error: dbError } = await supabase
    .from("imagens")
    .delete()
    .eq("url", supabase.storage.from("Bucket01").getPublicUrl(filePath).data.publicUrl);

  if (dbError) {
    console.error("Erro ao deletar da tabela:", dbError.message);
    return NextResponse.json({ error: "Falha ao limpar registro." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
