/**
 * Hook de serviço para cadastro de usuário no Eco.
 * Responsável apenas pela requisição HTTP (POST /register).
 * Não controla estados do formulário, navegação ou reset.
 *
 * @returns { register, loading, error }
 * - register: função para cadastrar usuário
 * - loading: booleano de carregamento
 * - error: mensagem de erro (string|null)
 */
import { useState } from 'react';
import api from '../api/axios';

/**
 * Tipagem do payload esperado pelo backend para cadastro.
 */
export interface RegisterPayload {
  email: string;
  senha: string;
  codinome: string;
  genero: 'M' | 'F' | 'O';
  avatar_url: string;
}

/**
 * Hook de serviço para cadastro de usuário.
 * Exemplo de uso:
 * const { register, loading, error } = useRegisterService();
 * await register(payload);
 */
export function useRegisterService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Função para cadastrar usuário via API.
   * @param payload RegisterPayload
   * @returns Promise<any>
   */
  async function register(payload: RegisterPayload) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/register', payload);
      return response.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao registrar. Tente novamente.'
      );
      console.error('Erro ao registrar usuário:', {
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

  return { register, loading, error };
}
