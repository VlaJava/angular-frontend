export interface Package {
  id: number; // ✅ CORREÇÃO: 'id' agora é obrigatório (não opcional)
  titulo: string;
  destino: string;
  localizacao: string;
  imagem: string;
  descricao: string;
  duracao: string;
  valor: number;
  preco: number;
  disponivel: boolean;
  reviews?: number;
  origem?: string;
  limiteViajantes?: number;
  dataInicio?: string;
  dataFinal?: string;
}
