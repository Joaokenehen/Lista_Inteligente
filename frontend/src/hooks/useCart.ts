import { useState, useMemo } from 'react';
import { ListaItem } from '../types/shopping';

export const useCart = () => {

    const [items, setItems] = useState<ListaItem[]>([]);

    const totalValue = useMemo(() => {
      return items.reduce((acc: number, item: ListaItem) => {
        return item.foiComprado ? acc + (item.preco * item.quantidade) : acc;
      }, 0);
    }, [items]);

  const togglePurchase = (id: string) => {
    setItems((prev: ListaItem[]) => 
      prev.map((item: ListaItem) => 
        item.id === id ? { ...item, foiComprado: !item.foiComprado } : item
      )
    );
  };

  const adicionarItem = (nome: string, preco: number, quantidade: number) => {
    const novo: ListaItem = {
      id: Date.now().toString(),
      nome,
      preco,
      quantidade,
      foiComprado: false,
    };
    setItems((prev: ListaItem[]) => [...prev, novo]);
  };

  return { items, totalValue, setItems, togglePurchase, adicionarItem };
};