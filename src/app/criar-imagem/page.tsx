import CriarImagemPage from "@/components/criarImagemPage";
import { PageHeaderWithBreadcrumb } from "@/components/pageHeaderWithBreadcrumb";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function CriarImagem() {
  return (
    <>
      <PageHeaderWithBreadcrumb 
        segments={[
          { label: "Frases", href: "/selecione-uma-frase" },
          { label: "Criar imagem" },
        ]} />
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        }>
        <CriarImagemPage />
      </Suspense>
    </>
  );
}
