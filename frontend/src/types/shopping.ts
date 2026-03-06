export interface ListaItem {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  foiComprado: boolean; 
}

export interface ComprasHistorico {
  id: string;
  data: string; 
  itens: ListaItem[];
  valorTotal: number;
}