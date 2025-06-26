/**
 * Hook de serviço para listar tags oficiais do Eco.
 * Faz requisição GET /tags via Axios.
 * Pode ser usado em qualquer tela (ecoar, filtros, etc).
 *
 * @returns { tags, loading, error, listarTags }
 * - tags: array de tags { id, nome }
 * - loading: booleano de carregamento
 * - error: mensagem de erro (string|null)
 * - listarTags: função para buscar as tags
 */
import { useState } from 'react';
import api from '../api/axios';

export interface Tag {
  id: string;
  nome: string;
}

export function useTagsService() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca as tags oficiais do backend.
   */
  async function listarTags() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tags');
      setTags(response.data.tags || []);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao buscar tags. Tente novamente.'
      );
      console.error('Erro ao buscar tags:', {
        message: err.message,
        response: err.response,
        data: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });
    } finally {
      setLoading(false);
    }
  }

  return { tags, loading, error, listarTags };
}
