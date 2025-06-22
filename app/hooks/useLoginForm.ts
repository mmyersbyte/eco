/**
 * Hook de fluxo completo do formulário de login do Eco.
 * Controla estados, validação, integração com serviço, storage, navegação e feedback de erro via modal.
 *
 * Exemplo de uso:
 * const loginForm = useLoginForm();
 * <TextInput value={loginForm.email} onChangeText={loginForm.setEmail} />
 * <TouchableOpacity onPress={loginForm.handleSubmit}>Entrar</TouchableOpacity>
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { setItem } from '../utils/storage';
import { useLoginService } from './useLoginService';

export default function useLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { login, loading } = useLoginService();

  /**
   * Validação dos campos do formulário de login.
   * Exibe mensagens UX-friendly no modal de erro.
   */
  function validarFormulario() {
    if (!email || !senha) {
      setErrorMessage('Preencha todos os campos.');
      setShowErrorModal(true);
      return false;
    }
    if (!email.includes('@') || email.length < 6) {
      setErrorMessage('Digite um e-mail válido.');
      setShowErrorModal(true);
      return false;
    }
    if (senha.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      setShowErrorModal(true);
      return false;
    }
    return true;
  }

  /**
   * Handler para submit do login.
   * Faz validação, chama o serviço, salva usuário e navega.
   */
  async function handleSubmit() {
    setErrorMessage(null);
    setShowErrorModal(false);
    const valido = validarFormulario();
    if (!valido) return;
    try {
      const data = await login({ email, senha });
      // Salva dados do usuário autenticado
      await setItem('eco_user', data.user);
      router.push('/ecoar');
    } catch (err: any) {
      // Mensagem UX para erros do backend
      let msg = 'Erro ao fazer login. Tente novamente.';
      if (err.response?.data?.message) {
        if (err.response.data.message.includes('inválidos')) {
          msg = 'E-mail ou senha inválidos.';
        } else {
          msg = err.response.data.message;
        }
      }
      setErrorMessage(msg);
      setShowErrorModal(true);
    }
  }

  return {
    email,
    setEmail,
    senha,
    setSenha,
    loading,
    errorMessage,
    showErrorModal,
    setShowErrorModal,
    handleSubmit,
  };
}
