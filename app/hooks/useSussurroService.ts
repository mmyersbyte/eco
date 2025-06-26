import { Sussurro } from '../../backend/src/@types/sussurro';
import api from '../api/axios';

/**
 * Hook de serviço para operações de sussurros.
 * Responsável apenas por requisições HTTP (listar, criar, etc).
 * Não gerencia estado ou UI.
 */
export function useSussurroService() {
  /**
   * Lista todos os sussurros de um eco específico.
   * @param eco_id ID do eco
   * @returns Lista de sussurros
   */
  async function listar(eco_id: string): Promise<Sussurro[]> {
    const { data } = await api.get('/sussurro', { params: { eco_id } });
    return data.sussurros;
  }

  /**
   * Cria um novo sussurro para um eco.
   * @param eco_id ID do eco
   * @param conteudo Conteúdo do sussurro
   * @returns Sussurro criado
   */
  async function criar(eco_id: string, conteudo: string): Promise<Sussurro> {
    const { data } = await api.post('/sussurro', { eco_id, conteudo });
    return data.sussurro;
  }

  return { listar, criar };
}
