import FraseForm from "@/components/fraseForm";
import { PageHeaderWithBreadcrumb } from "@/components/pageHeaderWithBreadcrumb";

export default function NovaFrase() {
  return (
    <>
      <PageHeaderWithBreadcrumb segments={[{ label: "Nova frase" }]} />
      <FraseForm />
    </>
  );
}
