/**
 * Hook de serviço para buscar o feed de ecos do backend.
 * Permite filtrar por tag_id (opcional).
 * Retorna feed, função para listar e loading.
 *
 * Exemplo de uso:
 * const { feed, listarFeed, loading } = useFeed(tagId);
 * useEffect(() => { listarFeed(); }, [tagId]);
 */
import { useState } from 'react';
import api from '../api/axios';

export interface FeedItem {
  id: string;
  codinome: string;
  avatar_url: string;
  genero: 'M' | 'F' | 'N';
  thread_1: string;
  thread_2?: string;
  thread_3?: string;
  tags: { id: string; nome: string }[];
  sussurros: any[]; // Ajuste conforme estrutura real
  created_at?: string; // Data de publicação
}

export function useFeed(tagId?: string) {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Busca os ecos do backend, filtrando por tag_id se fornecido.
   */
  async function listarFeed() {
    setLoading(true);
    try {
      const response = await api.get(
        '/eco',
        tagId ? { params: { tag_id: tagId } } : {}
      );
      setFeed(response.data.ecos || []);
    } catch (err: any) {
      setFeed([]);
      console.error('Erro ao buscar feed:', err);
    } finally {
      setLoading(false);
    }
  }

  return { feed, listarFeed, loading };
}
