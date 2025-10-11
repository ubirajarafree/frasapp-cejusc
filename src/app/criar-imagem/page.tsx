import CriarImagemPage from "@/components/criarImagemPage";
import { PageHeaderWithBreadcrumb } from "@/components/pageHeaderWithBreadcrumb";

export default function CriarImagem() {
  return (
    <>
      <PageHeaderWithBreadcrumb 
        segments={[
          { label: "Frases", href: "/selecione-uma-frase" },
          { label: "Criar imagem" },
        ]} />
      <CriarImagemPage />
    </>
  );
}
