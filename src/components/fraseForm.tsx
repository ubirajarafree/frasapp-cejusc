"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Categoria } from "@/lib/types";

export default function FraseForm() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autor, setAutor] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "">("");
  const [erros, setErros] = useState<string[]>([]);

  const categorias = Object.values(Categoria);

  const validar = () => {
    const e: string[] = [];
    if (!conteudo.trim()) e.push("O conteúdo é obrigatório.");
    if (!categoria) e.push("Selecione uma categoria.");
    return e;
  };

  const salvarFrase = async () => {
    const { data, error } = await supabase
      .from("frases")
      .insert([
        {
          titulo: titulo || null,
          conteudo,
          autor: autor || null,
          categoria,
        },
      ]);

    if (error) {
      console.error("Erro ao salvar frase:", error.message);
      return false;
    }

    console.log("Frase salva com sucesso:", data);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errosValidacao = validar();
    if (errosValidacao.length > 0) {
      setErros(errosValidacao);
      return;
    }

    // Enviar ao Supabase
    const sucesso = await salvarFrase();
    if (sucesso) {
      alert("Frase salva com sucesso!");
      setTitulo("");
      setConteudo("");
      setAutor("");
      setCategoria("");
    } else {
      alert("Erro ao salvar frase.");
    }

    console.log({ titulo, conteudo, autor, categoria });
    setErros([]);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Cadastrar nova frase</h2>

      {erros.length > 0 && (
        <ul className="bg-red-100 text-red-700 p-2 rounded">
          {erros.map((erro, i) => (
            <li key={i}>{erro}</li>
          ))}
        </ul>
      )}

      <input
        type="text"
        placeholder="Título (opcional)"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Conteúdo da frase"
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        className="w-full p-2 border rounded"
        rows={4}
      />

      <input
        type="text"
        placeholder="Autor (opcional)"
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value as Categoria)}
        className="w-full p-2 border rounded"
      >
        <option value="">Selecione uma categoria</option>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Salvar frase
      </button>
    </form>
  );
}
