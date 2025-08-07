export interface PacoteViagem {
  id: string; 
  titulo: string;
  destino: string;
  localizacao: string;
  imagem: string;
  preco: number;
  duracao: string;
  descricao: string;
  disponivel: boolean;
  reviews?: number;
}