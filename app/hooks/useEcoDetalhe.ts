import { useState } from 'react';
import api from '../api/axios';

/**
 * Hook para buscar os detalhes completos de um eco pelo ID.
 * Retorna eco, loading, erro e função para buscar.
 *
 * Exemplo de uso:
 * const { eco, loading, error, buscarEco } = useEcoDetalhe();
 * useEffect(() => { buscarEco(id); }, [id]);
 */
export function useEcoDetalhe() {
  const [eco, setEco] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca o eco completo pelo ID (inclui sussurros, tags, usuário).
   * @param id string - ID do eco
   */
  async function buscarEco(id: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/eco/${id}`);
      setEco(response.data);
    } catch (err: any) {
      setEco(null);
      setError('Erro ao buscar eco.');
    } finally {
      setLoading(false);
    }
  }

  return { eco, loading, error, buscarEco };
}
