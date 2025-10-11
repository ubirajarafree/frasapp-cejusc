"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BbotaoVoltar() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Voltar</span>
    </Button>
  );
}