import FraseGallery from "@/components/fraseGallery";
import { PageHeaderWithBreadcrumb } from "@/components/pageHeaderWithBreadcrumb";

export default function SelecioneUmaFrase() {
  return (
    <>
      <PageHeaderWithBreadcrumb segments={[{ label: "Selecione uma frase" }]} />
      <FraseGallery />
    </>
  );
}
