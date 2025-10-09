export enum Categoria {
  Reflexao = "Reflexão",
  Motivacao = "Motivação",
  Humor = "Humor",
  Espiritualidade = "Espiritualidade",
  Amor = "Amor",
  Gratidao = "Gratidão",
}

export type Frase = {
  id: number;
  titulo: string | null;
  conteudo: string;
  autor: string | null;
  categoria: Categoria;
  created_at: string;
};
