import { useCallback, useState } from 'react';
import { Sussurro } from '../../backend/src/@types/sussurro';
import { useSussurroService } from './useSussurroService';

/**
 * Hook para controle do formulário de sussurros.
 * Gerencia estado do campo, integração com backend e feedback de loading/erro.
 *
 * @param eco_id ID do eco para buscar/enviar sussurros
 * @returns Estados, handlers e lista de sussurros
 */
export function useSussurrosForm(eco_id: string) {
  const { listar, criar } = useSussurroService();
  const [sussurros, setSussurros] = useState<Sussurro[]>([]);
  const [novo, setNovo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca os sussurros do eco no backend.
   */
  const fetchSussurros = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listar(eco_id);
      setSussurros(data);
    } catch (e: any) {
      setError('Erro ao carregar sussurros.');
    } finally {
      setLoading(false);
    }
  }, [eco_id, listar]);

  /**
   * Envia um novo sussurro para o backend e atualiza a lista.
   */
  const enviarSussurro = useCallback(async () => {
    if (!novo.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await criar(eco_id, novo.trim());
      setNovo('');
      await fetchSussurros();
    } catch (e: any) {
      setError('Erro ao enviar sussurro.');
    } finally {
      setLoading(false);
    }
  }, [eco_id, novo, criar, fetchSussurros]);

  return {
    sussurros, // Lista de sussurros do eco
    novo, // Valor do campo de novo sussurro
    setNovo, // Setter do campo
    loading, // Estado de carregamento
    error, // Mensagem de erro
    fetchSussurros, // Função para buscar sussurros
    enviarSussurro, // Função para enviar novo sussurro
  };
}
