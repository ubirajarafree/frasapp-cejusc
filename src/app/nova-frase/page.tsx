import FraseForm from "@/components/fraseForm";
import { PageHeaderWithBreadcrumb } from "@/components/pageHeaderWithBreadcrumb";

export default function NovaFrase() {
  return (
    <>
      <PageHeaderWithBreadcrumb segments={[
        { label: "Frases", href: "/selecione-uma-frase" },
        { label: "Nova frase" },
        ]} />
      <FraseForm />
    </>
  );
}
