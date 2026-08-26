export interface ItemPlanejado {
  id: string;
  nome: string;
  quantidade: number;
  comprado: boolean;
  preco: number;
}

export interface ListaAtiva {
  id: string;
  nome: string;
  dataCriacao: string;
  itens: ItemPlanejado[];
}

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