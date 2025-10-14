import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Bem-vindo ao FrasApp ✨</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
        🎯Escolha uma opção abaixo para começar sua jornada com frases inspiradoras ou dicas de Direito.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
          <Link href="/selecione-uma-frase" className="block h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">Selecionar uma Frase <ArrowRight className="h-5 w-5 text-blue-500" /></CardTitle>
              <CardDescription>Navegue por nossa coleção de frases e escolha uma para gerar uma imagem.</CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
          <Link href="/nova-frase" className="block h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">Criar Nova Frase <ArrowRight className="h-5 w-5 text-green-500" /></CardTitle>
              <CardDescription>Dê vida às suas próprias palavras e crie uma nova frase inspiradora.</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}
