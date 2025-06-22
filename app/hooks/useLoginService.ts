/**
 * Hook de serviço para login de usuário no Eco.
 * Responsável apenas pela requisição HTTP (POST /auth) usando Axios.
 * Não controla estados do formulário, navegação ou storage.
 *
 * @returns { login, loading, error }
 * - login: função para autenticar usuário
 * - loading: booleano de carregamento
 * - error: mensagem de erro (string|null)
 *
 * Exemplo de uso:
 * const { login, loading, error } = useLoginService();
 * await login({ email, senha });
 */
import { useState } from 'react';
import api from '../api/axios';

/**
 * Tipagem do payload esperado pelo backend para login.
 */
export interface LoginPayload {
  email: string;
  senha: string;
}

export function useLoginService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Função para autenticar usuário via API.
   * @param payload LoginPayload
   * @returns Promise<any>
   */
  async function login(payload: LoginPayload) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth', payload);
      return response.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao fazer login. Tente novamente.'
      );
      console.error('Erro ao fazer login:', {
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

  return { login, loading, error };
}
