/**
 * Hook de fluxo completo do formulário de publicação de eco no Eco.
 * Controla estados dos campos, validação, integração com serviço, leitura do usuário autenticado e feedback de erro via modal.
 *
 * Exemplo de uso:
 * const ecoForm = useEcoForm();
 * <TextInput value={ecoForm.thread1} onChangeText={ecoForm.setThread1} />
 * <TouchableOpacity onPress={ecoForm.handleSubmit}>Publicar</TouchableOpacity>
 */
import React, { useState } from 'react';
import { getItem } from '../utils/storage';
import { useEcoService } from './useEcoService';

export default function useEcoForm() {
  // Campos do formulário
  const [thread1, setThread1] = useState('');
  const [thread2, setThread2] = useState('');
  const [thread3, setThread3] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Dados do usuário autenticado
  const [user, setUser] = useState<any>(null);

  // Serviço de publicação
  const { publicarEco } = useEcoService();

  // Carrega usuário autenticado ao montar
  React.useEffect(() => {
    (async () => {
      const u = await getItem<any>('eco_user');
      setUser(u);
    })();
  }, []);

  /**
   * Validação dos campos do formulário de eco.
   * Exibe mensagens UX-friendly no modal de erro.
   */
  function validarFormulario() {
    if (!user) {
      setErrorMessage('Usuário não autenticado. Faça login novamente.');
      setShowErrorModal(true);
      return false;
    }
    if (!thread1.trim() || thread1.trim().length < 100) {
      setErrorMessage('A primeira thread deve ter pelo menos 100 caracteres.');
      setShowErrorModal(true);
      return false;
    }
    if (selectedTagIds.length === 0) {
      setErrorMessage('Selecione pelo menos uma tag para seu eco.');
      setShowErrorModal(true);
      return false;
    }
    if (thread1.length > 144 || thread2.length > 144 || thread3.length > 144) {
      setErrorMessage('Cada thread pode ter no máximo 144 caracteres.');
      setShowErrorModal(true);
      return false;
    }
    return true;
  }

  /**
   * Handler para submit do eco.
   * Faz validação, chama o serviço e reseta campos.
   */
  async function handleSubmit() {
    setErrorMessage(null);
    setShowErrorModal(false);
    const valido = validarFormulario();
    if (!valido) return;
    setLoading(true);
    try {
      await publicarEco({
        user_id: user.id,
        thread_1: thread1,
        thread_2: thread2 || undefined,
        thread_3: thread3 || undefined,
        tag_ids: selectedTagIds,
      });
      setThread1('');
      setThread2('');
      setThread3('');
      setSelectedTagIds([]);
      setShowSuccessModal(true);
    } catch (err: any) {
      let msg = 'Erro ao publicar eco. Tente novamente.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setErrorMessage(msg);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }

  return {
    thread1,
    setThread1,
    thread2,
    setThread2,
    thread3,
    setThread3,
    selectedTagIds,
    setSelectedTagIds,
    loading,
    errorMessage,
    showErrorModal,
    setShowErrorModal,
    showSuccessModal,
    setShowSuccessModal,
    handleSubmit,
    user, // Para exibir avatar, codinome, gênero na tela
  };
}
