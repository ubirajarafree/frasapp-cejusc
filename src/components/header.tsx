"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex items-center justify-center">
        <div className="m-4 w-full flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center space-x-2">
            
            <span className="font-bold text-lg md:text-2xl">
              FrasApp Cejusc
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/selecione-uma-frase">Frases</Link>
            <Link href="/nova-frase">Nova Frase</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetTitle className="sr-only">
                Menu de Navegação
              </SheetTitle>
              <nav className="grid gap-6 text-lg font-medium mt-8 ml-4">
                <Link href="/" className="hover:text-foreground/80">Home</Link>
                <Link href="/selecione-uma-frase" className="hover:text-foreground/80">Frases</Link>
                <Link href="/nova-frase" className="hover:text-foreground/80">Nova Frase</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
