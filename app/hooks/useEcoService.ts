/**
 * Hook de serviço para publicação de eco no Eco.
 * Responsável apenas pela requisição HTTP (POST /eco) usando Axios.
 * Não controla estados do formulário, navegação ou storage.
 *
 * @returns { publicarEco, loading, error }
 * - publicarEco: função para publicar um eco
 * - loading: booleano de carregamento
 * - error: mensagem de erro (string|null)
 *
 * Exemplo de uso:
 * const { publicarEco, loading, error } = useEcoService();
 * await publicarEco(payload);
 */
import { useState } from 'react';
import api from '../api/axios';

/**
 * Tipagem do payload esperado pelo backend para publicação de eco.
 */
export interface EcoPayload {
  user_id: string;
  thread_1: string;
  thread_2?: string;
  thread_3?: string;
  tag_ids: string[];
}

export function useEcoService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Função para publicar um eco via API.
   * @param payload EcoPayload
   * @returns Promise<any>
   */
  async function publicarEco(payload: EcoPayload) {
    setLoading(true);
    setError(null);
    console.log(
      '[ECO] Payload enviado para publicação:',
      JSON.stringify(payload, null, 2)
    );
    try {
      const response = await api.post('/eco', payload);
      return response.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao publicar eco. Tente novamente.'
      );
      console.error('Erro ao publicar eco:', {
        message: err.message,
        response: err.response,
        data: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { publicarEco, loading, error };
}
