import { Alert, Platform, Share } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { ItemPlanejado, ListaAtiva } from '../types/shopping';

type ItemExportavel = Pick<ItemPlanejado, 'nome' | 'quantidade' | 'preco' | 'porPeso'> & {
  comprado?: boolean;
  foiComprado?: boolean;
};

interface CompraExportavel {
  id: string;
  data: string;
  itens: ItemExportavel[];
  valorTotal?: number;
  total?: number;
}

interface SecaoPdf {
  titulo: string;
  subtitulo?: string;
  itens: ItemExportavel[];
  total: number;
}

const moeda = (valor: number) => valor.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const totalItem = (item: ItemExportavel) => item.preco * (item.quantidade || 1);
const itemFoiComprado = (item: ItemExportavel) => item.comprado ?? item.foiComprado ?? false;
const totalComprados = (itens: ItemExportavel[]) =>
  itens.reduce((total, item) => total + (itemFoiComprado(item) ? totalItem(item) : 0), 0);

const quantidadeItem = (item: ItemExportavel) => {
  if (item.quantidade == null) return '';
  return item.porPeso
    ? `${item.quantidade.toLocaleString('pt-BR')} kg`
    : `${item.quantidade}x`;
};

function escaparHtml(texto: string): string {
  return texto.replace(/[&<>"']/g, caractere => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[caractere] || caractere);
}

function formatarLinhaTexto(item: ItemExportavel): string {
  const marcador = itemFoiComprado(item) ? '✅' : '◻️';
  const valor = item.preco > 0 ? ` — ${moeda(totalItem(item))}` : '';
  const quantidade = quantidadeItem(item);
  return `${marcador} ${quantidade ? `${quantidade} ` : ''}${item.nome}${valor}`;
}

function criarHtml(titulo: string, secoes: SecaoPdf[], totalGeral: number): string {
  const secoesHtml = secoes.map(secao => `
    <section>
      <h2>${escaparHtml(secao.titulo)}</h2>
      ${secao.subtitulo ? `<p class="subtitulo">${escaparHtml(secao.subtitulo)}</p>` : ''}
      <table>
        <thead><tr><th>Item</th><th>Qtd./peso</th><th>Preço unit.</th><th>Subtotal</th><th>Status</th></tr></thead>
        <tbody>${secao.itens.map(item => `
          <tr>
            <td>${escaparHtml(item.nome)}</td>
            <td>${escaparHtml(quantidadeItem(item))}</td>
            <td>${moeda(item.preco)}</td>
            <td>${moeda(totalItem(item))}</td>
            <td>${itemFoiComprado(item) ? 'Comprado' : 'Pendente'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <p class="total">Total comprado: ${moeda(secao.total)}</p>
    </section>`).join('');

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8" />
    <style>
      body { font-family: Arial, sans-serif; color: #1e293b; padding: 24px; }
      h1 { color: #166534; margin-bottom: 4px; }
      h2 { font-size: 18px; margin: 26px 0 4px; }
      .data, .subtitulo { color: #64748b; margin: 4px 0 10px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th { background: #dcfce7; text-align: left; }
      th, td { padding: 8px; border: 1px solid #cbd5e1; }
      tbody tr:nth-child(even) { background: #f8fafc; }
      .total { text-align: right; font-weight: bold; margin-top: 8px; }
      .geral { border-top: 2px solid #166534; padding-top: 14px; text-align: right; font-size: 18px; font-weight: bold; }
    </style></head><body>
    <h1>${escaparHtml(titulo)}</h1><p class="data">Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
    ${secoesHtml}<p class="geral">Total comprado: ${moeda(totalGeral)}</p>
  </body></html>`;
}

async function compartilharTexto(titulo: string, mensagem: string): Promise<void> {
  try {
    await Share.share({ title: titulo, message: mensagem });
  } catch {
    Alert.alert('Erro', 'Não foi possível abrir o compartilhamento.');
  }
}

export function abrirOpcoesCompartilhamento(onTexto: () => void, onPdf: () => void): void {
  Alert.alert('Compartilhar', 'Escolha o formato da exportação:', [
    { text: 'Texto', onPress: onTexto },
    { text: 'PDF', onPress: onPdf },
    { text: 'Cancelar', style: 'cancel' },
  ]);
}

async function compartilharPdf(titulo: string, secoes: SecaoPdf[], total: number): Promise<void> {
  try {
    const html = criarHtml(titulo, secoes, total);
    // No Expo Go para Android, o PDF criado pelo printToFileAsync fica no cache
    // do host (host.exp.exponent), que não pode ser lido pelo FileSystem/Sharing.
    // Imprimir o HTML diretamente abre o diálogo nativo, onde é possível salvar como PDF.
    if (Platform.OS === 'web' || Platform.OS === 'android' || !(await Sharing.isAvailableAsync())) {
      await Print.printAsync({ html });
      return;
    }
    const arquivo = await Print.printToFileAsync({ html });
    const cacheUri = FileSystem.cacheDirectory;
    if (!cacheUri) {
      await Print.printAsync({ uri: arquivo.uri });
      return;
    }

    const pastaExportacao = `${cacheUri}exportacoes/`;
    const pdfCompartilhavel = `${pastaExportacao}cartflow-${Date.now()}.pdf`;
    await FileSystem.makeDirectoryAsync(pastaExportacao, { intermediates: true });
    await FileSystem.copyAsync({ from: arquivo.uri, to: pdfCompartilhavel });

    try {
      await Sharing.shareAsync(pdfCompartilhavel, {
        mimeType: 'application/pdf',
        dialogTitle: `Exportar ${titulo}`,
        UTI: 'com.adobe.pdf',
      });
    } catch (erroCompartilhamento) {
      console.warn('Compartilhamento do PDF indisponível; abrindo a impressão para salvar o arquivo.', erroCompartilhamento);
      await Print.printAsync({ html });
    } finally {
      await FileSystem.deleteAsync(pdfCompartilhavel, { idempotent: true }).catch(() => undefined);
    }
  } catch (error) {
    console.error('Erro ao gerar ou compartilhar PDF:', error);
    Alert.alert('Erro', 'Não foi possível gerar ou compartilhar o PDF.');
  }
}

function secaoLista(lista: ListaAtiva, itens: ItemPlanejado[] = lista.itens): SecaoPdf {
  return {
    titulo: lista.nome,
    subtitulo: `Criada em ${lista.dataCriacao}`,
    itens,
    total: totalComprados(itens),
  };
}

function secaoCompra(compra: CompraExportavel): SecaoPdf {
  return {
    titulo: `Compra de ${compra.data}`,
    itens: compra.itens,
    total: compra.valorTotal ?? compra.total ?? totalComprados(compra.itens),
  };
}

export function compartilharLista(lista: ListaAtiva, itens: ItemPlanejado[] = lista.itens) {
  const total = totalComprados(itens);
  const mensagem = [
    `🛒 *Lista de Compras: ${lista.nome}*`,
    `📅 Criada em ${lista.dataCriacao}`,
    '',
    ...itens.map(formatarLinhaTexto),
    '',
    `💰 *Total comprado: ${moeda(total)}*`,
  ].join('\n');
  return compartilharTexto(`Lista: ${lista.nome}`, mensagem);
}

export function pdfLista(lista: ListaAtiva, itens: ItemPlanejado[] = lista.itens) {
  const secao = secaoLista(lista, itens);
  return compartilharPdf(`Lista ${lista.nome}`, [secao], secao.total);
}

export function compartilharListas(listas: ListaAtiva[]) {
  const total = listas.reduce((soma, lista) => soma + totalComprados(lista.itens), 0);
  const mensagem = [
    '🛒 *Minhas listas ativas*',
    ...listas.flatMap(lista => [
      '', `*${lista.nome}* — ${lista.dataCriacao}`,
      ...lista.itens.map(formatarLinhaTexto),
      `Subtotal comprado: ${moeda(totalComprados(lista.itens))}`,
    ]),
    '',
    `💰 *Total comprado: ${moeda(total)}*`,
  ].join('\n');
  return compartilharTexto('Minhas listas', mensagem);
}

export function pdfListas(listas: ListaAtiva[]) {
  const secoes = listas.map(lista => secaoLista(lista));
  const total = secoes.reduce((soma, secao) => soma + secao.total, 0);
  return compartilharPdf('Minhas listas ativas', secoes, total);
}

export function compartilharCompra(compra: CompraExportavel) {
  const total = compra.valorTotal ?? compra.total ?? totalComprados(compra.itens);
  const mensagem = [
    `🛍️ *Compra do dia ${compra.data}*`,
    '',
    ...compra.itens.map(formatarLinhaTexto),
    '',
    `💰 *Total: ${moeda(total)}*`,
  ].join('\n');
  return compartilharTexto(`Compra de ${compra.data}`, mensagem);
}

export function pdfCompra(compra: CompraExportavel) {
  const secao = secaoCompra(compra);
  return compartilharPdf(`Compra de ${compra.data}`, [secao], secao.total);
}

export function compartilharHistorico(compras: CompraExportavel[]) {
  const total = compras.reduce(
    (soma, compra) => soma + (compra.valorTotal ?? compra.total ?? totalComprados(compra.itens)),
    0
  );
  const mensagem = [
    '📊 *Histórico completo de compras*',
    ...compras.flatMap(compra => [
      '', `*Compra de ${compra.data}*`,
      ...compra.itens.map(formatarLinhaTexto),
      `Subtotal: ${moeda(compra.valorTotal ?? compra.total ?? totalComprados(compra.itens))}`,
    ]),
    '',
    `💰 *Total do período: ${moeda(total)}*`,
  ].join('\n');
  return compartilharTexto('Histórico de compras', mensagem);
}

export function pdfHistorico(compras: CompraExportavel[]) {
  const secoes = compras.map(secaoCompra);
  const total = secoes.reduce((soma, secao) => soma + secao.total, 0);
  return compartilharPdf('Histórico completo de compras', secoes, total);
}

export type { CompraExportavel };
