import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bem-vindo ao FrasApp ✨</h1>
      <p className="text-gray-600 mb-10 text-center max-w-md">
        Escolha uma opção abaixo para começar sua jornada com frases inspiradoras.
      </p>
      <div className="flex gap-6">
        <Link href="/selecione-uma-frase">
          <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Selecionar uma frase
          </span>
        </Link>
        <Link href="/nova-frase">
          <span className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Criar nova frase
          </span>
        </Link>
      </div>
    </div>
  );
}
