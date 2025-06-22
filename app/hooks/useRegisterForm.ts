/**
 * Hook de fluxo completo do formulário de cadastro do Eco.
 * Controla todos os estados, validação, reset, navegação e integração com o serviço de cadastro.
 *
 * Exemplo de uso:
 * const cadastro = useRegisterForm();
 * <TextInput value={cadastro.email} onChangeText={cadastro.setEmail} />
 * <TouchableOpacity onPress={cadastro.handleSubmit}>Criar conta</TouchableOpacity>
 */
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import api from '../api/axios';
import { setItem } from '../utils/storage';
import { useCodinomeGenerator } from './useCodinomeGenerator';

/**
 * Lista de avatares disponíveis para seleção no cadastro.
 */
const avatars = [
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/boneca-eco.png',
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/cachorro-eco.png',
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/cadeira-eco.png',
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/gatinho-eco.png',
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/gato-eco.png',
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/homem-eco.png',
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/homem2-eco.png',
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/mulher-eco.png',
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/mulher2-eco.png',
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/mulher3-eco.png',
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/passaro-eco.png',
  'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/rato-eco.png',
];

export default function useRegisterForm() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<string>>(null);

  // Campos do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [genero, setGenero] = useState<'M' | 'F' | 'N' | null>(null);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Codinome
  const {
    codinomeAtual,
    isGenerating,
    error: codinomeError,
    gerarNovoCodinome,
  } = useCodinomeGenerator();

  // Gera novo codinome quando o gênero muda
  useEffect(() => {
    if (genero) {
      gerarNovoCodinome(genero);
    }
    setSelectedAvatarIndex(0);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [genero]);

  // Validação
  function validarFormulario() {
    // Validação com mensagens UX-friendly
    if (!email || !senha || !confirmSenha || !genero) {
      setErrorMessage('Preencha todos os campos!');
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
    if (senha !== confirmSenha) {
      setErrorMessage('As senhas não coincidem.');
      setShowErrorModal(true);
      return false;
    }
    if (!aceitouTermos) {
      setErrorMessage('Você precisa ler e aceitar os termos para continuar.');
      setShowErrorModal(true);
      return false;
    }
    if (!codinomeAtual) {
      setErrorMessage('Aguarde a geração do codinome.');
      setShowErrorModal(true);
      return false;
    }
    if (selectedAvatarIndex === 0) {
      setErrorMessage('Selecione um avatar.');
      setShowErrorModal(true);
      return false;
    }
    return true;
  }

  // Reset
  function resetarFormulario() {
    setEmail('');
    setSenha('');
    setConfirmSenha('');
    setGenero(null);
    setSelectedAvatarIndex(0);
    setAceitouTermos(false);
    setShowTermsModal(false);
  }

  // Submit
  async function handleSubmit() {
    setErrorMessage(null);
    setShowErrorModal(false);
    const valido = validarFormulario();
    if (!valido) return;
    setLoading(true);
    try {
      const payload = {
        email,
        senha,
        codinome: codinomeAtual,
        genero: genero as 'M' | 'F' | 'N',
        avatar_url: avatars[selectedAvatarIndex],
      };
      await api.post('/register', payload);
      await setItem('eco_user', {
        email,
        codinome: codinomeAtual,
        avatar_url: avatars[selectedAvatarIndex],
        genero,
      });
      resetarFormulario();
      router.push('/ecoar');
    } catch (err: any) {
      // Apenas loga o erro, sem setar estado de erro
      console.error('Erro ao registrar usuário:', {
        message: err.message,
        response: err.response,
        data: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });
      // Mensagem UX para erros do backend
      let msg = 'Erro ao registrar. Tente novamente.';
      if (err.response?.data?.message) {
        if (err.response.data.message.includes('e-mail')) {
          msg = 'Já existe um usuário com este e-mail.';
        } else if (err.response.data.message.includes('Codinome')) {
          msg = 'Codinome já está em uso. Tente gerar outro.';
        } else {
          msg = err.response.data.message;
        }
      }
      setErrorMessage(msg);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }

  // Handlers auxiliares
  function onAvatarScroll(event: any) {
    const index = Math.round(event.nativeEvent.contentOffset.x / (300 / 3));
    setSelectedAvatarIndex(index);
  }
  function selectAvatar(index: number) {
    setSelectedAvatarIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }
  function handleOpenTerms() {
    setShowTermsModal(true);
  }
  function handleCloseTerms() {
    setShowTermsModal(false);
  }
  function toggleTermsAcceptance() {
    setAceitouTermos((prev) => !prev);
  }
  function handleGerarNovoCodinome() {
    if (genero) gerarNovoCodinome(genero);
  }

  return {
    // campos e setters
    email,
    setEmail,
    senha,
    setSenha,
    confirmSenha,
    setConfirmSenha,
    genero,
    setGenero,
    selectedAvatarIndex,
    setSelectedAvatarIndex,
    aceitouTermos,
    setAceitouTermos,
    showTermsModal,
    setShowTermsModal,
    flatListRef,
    // codinome
    codinomeAtual,
    isGenerating,
    codinomeError,
    handleGerarNovoCodinome,
    // loading/erro
    loading,
    errorMessage,
    showErrorModal,
    setShowErrorModal,
    // handlers
    handleSubmit,
    onAvatarScroll,
    selectAvatar,
    handleOpenTerms,
    handleCloseTerms,
    toggleTermsAcceptance,
    resetarFormulario,
    avatars,
  };
}
