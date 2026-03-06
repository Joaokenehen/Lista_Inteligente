import { useState, useMemo } from 'react';
import { ListaItem } from '../types/shopping';

export const useCart = () => {
  // Tipando explicitamente o estado como um array de ListaItem
    const [items, setItems] = useState<ListaItem[]>([]);
  // Memoiza o cálculo do total. Tipamos o acumulador (acc) e o item.
  const totalValue = useMemo(() => {
    return items.reduce((acc: number, item: ListaItem) => {
      // Regra: Somar (preço * quantidade) apenas se foiComprado for true
      return item.foiComprado ? acc + (item.preco * item.quantidade) : acc;
    }, 0);
  }, [items]);

  // Alterna o status de "no carrinho"
  const togglePurchase = (id: string) => {
    setItems((prev: ListaItem[]) => 
      prev.map((item: ListaItem) => 
        item.id === id ? { ...item, foiComprado: !item.foiComprado } : item
      )
    );
  };

  // Função auxiliar para adicionar novo item via Input
  const adicionarItem = (nome: string, preco: number, quantidade: number) => {
    const novo: ListaItem = {
      id: Date.now().toString(), // ID temporário baseado em timestamp
      nome,
      preco,
      quantidade,
      foiComprado: false,
    };
    setItems((prev: ListaItem[]) => [...prev, novo]);
  };

  return { items, totalValue, setItems, togglePurchase, adicionarItem };
};