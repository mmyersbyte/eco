import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import TermsModal from './components/TermsModal';
import { useCodinomeGenerator } from './hooks/useCodinomeGenerator';

const WIDTH = Dimensions.get('window').width;

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

export default function CadastroScreen() {
  const router = useRouter();

  // Hook personalizado para geração de codinomes
  const {
    codinomeAtual,
    isGenerating,
    error: codinomeError,
    gerarNovoCodinome,
  } = useCodinomeGenerator();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [genero, setGenero] = useState<'M' | 'F' | 'N' | null>(null);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const flatListRef = useRef<FlatList<string>>(null);

  // Gera novo codinome quando o gênero muda
  useEffect(() => {
    if (genero) {
      gerarNovoCodinome(genero);
    }
    setSelectedAvatarIndex(0); // reset avatar ao mudar gênero
    // Scroll para início ao mudar gênero
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [genero]);

  function handleCriarConta() {
    if (!email || !senha || !confirmSenha || !genero) {
      Alert.alert('Preencha todos os campos e selecione o gênero');
      return;
    }
    if (senha !== confirmSenha) {
      Alert.alert('As senhas não coincidem');
      return;
    }
    if (!aceitouTermos) {
      Alert.alert('Aceite nossos termos para continuar');
      return;
    }
    if (!codinomeAtual) {
      Alert.alert('Aguarde a geração do codinome');
      return;
    }
    // lógica real de cadastro aqui
    Alert.alert('Conta criada com sucesso!', `Seu codinome é ${codinomeAtual}`);
    router.push('/');
  }

  function onAvatarScroll(event: any) {
    const index = Math.round(event.nativeEvent.contentOffset.x / (WIDTH / 3));
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
    setAceitouTermos(!aceitouTermos);
  }

  function handleGerarNovoCodinome() {
    if (genero) {
      gerarNovoCodinome(genero);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>eco.</Text>
      <Text style={styles.subtitle}>crie sua conta anônima</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder='email'
          placeholderTextColor='#666'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          textContentType='emailAddress'
        />
        <TextInput
          style={styles.input}
          placeholder='senha'
          placeholderTextColor='#666'
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize='none'
          textContentType='password'
        />
        <TextInput
          style={styles.input}
          placeholder='confirmar senha'
          placeholderTextColor='#666'
          value={confirmSenha}
          onChangeText={setConfirmSenha}
          secureTextEntry
          autoCapitalize='none'
          textContentType='password'
        />

        <Text style={styles.label}>selecione seu gênero</Text>
        <View style={styles.generoContainer}>
          {['M', 'F', 'N'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.generoBtn,
                genero === g && styles.generoBtnSelected,
              ]}
              onPress={() => setGenero(g as 'M' | 'F' | 'N')}
            >
              <Text
                style={[
                  styles.generoBtnText,
                  genero === g && styles.generoBtnTextSelected,
                ]}
              >
                {g === 'M'
                  ? 'Masculino'
                  : g === 'F'
                  ? 'Feminino'
                  : 'Não-binário'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {genero && (
          <>
            <Text style={[styles.label, { marginTop: 20 }]}>seu avatar</Text>
            <FlatList
              ref={flatListRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={avatars}
              keyExtractor={(item) => item}
              onScroll={onAvatarScroll}
              scrollEventThrottle={16}
              getItemLayout={(_, index) => ({
                length: WIDTH / 3,
                offset: (WIDTH / 3) * index,
                index,
              })}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => selectAvatar(index)}
                  style={[
                    styles.avatarWrapper,
                    index === selectedAvatarIndex && styles.avatarSelected,
                  ]}
                >
                  <Image
                    source={{ uri: item }}
                    style={[
                      styles.avatarPreview,
                      index !== selectedAvatarIndex && { opacity: 0.6 },
                    ]}
                    resizeMode='cover'
                  />
                </TouchableOpacity>
              )}
            />
            <Text style={styles.avatarCounter}>
              {selectedAvatarIndex + 1} / {avatars.length}
            </Text>

            <Text style={styles.label}>seu codinome</Text>
            <View style={styles.nicknameContainer}>
              <Text style={styles.nicknameText}>
                {isGenerating ? 'gerando...' : codinomeAtual || 'carregando...'}
              </Text>
              <TouchableOpacity
                onPress={handleGerarNovoCodinome}
                style={[
                  styles.gerarOutroBtn,
                  isGenerating && styles.gerarOutroBtnDisabled,
                ]}
                disabled={isGenerating}
              >
                <Text
                  style={[
                    styles.gerarOutroText,
                    isGenerating && styles.gerarOutroTextDisabled,
                  ]}
                >
                  {isGenerating ? 'gerando...' : 'gerar outro'}
                </Text>
              </TouchableOpacity>
            </View>

            {codinomeError && (
              <Text style={styles.errorText}>{codinomeError}</Text>
            )}
          </>
        )}

        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={toggleTermsAcceptance}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                aceitouTermos && styles.checkboxSelected,
              ]}
            >
              {aceitouTermos && <View style={styles.checkboxInner} />}
            </View>

            <Text style={styles.termsText}>
              aceito as{' '}
              <Text
                style={styles.termsLink}
                onPress={handleOpenTerms}
              >
                normas e condições
              </Text>{' '}
              do aplicativo
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCriarConta}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>criar conta</Text>
        </TouchableOpacity>
      </View>

      <TermsModal
        visible={showTermsModal}
        onClose={handleCloseTerms}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 2,
    textTransform: 'lowercase',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#AAA',
    letterSpacing: 2,
    marginBottom: 24,
    textTransform: 'lowercase',
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(30,30,30,0.85)',
    borderRadius: 20,
    paddingHorizontal: 16,
    color: '#DDD',
    fontSize: 15,
    fontWeight: '300',
    marginBottom: 14,
    textAlign: 'center',
  },
  label: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.7,
    textAlign: 'center',
  },
  generoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  generoBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: 'transparent',
  },
  generoBtnSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  generoBtnText: {
    color: '#888',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  generoBtnTextSelected: {
    color: '#FFF',
  },
  avatarWrapper: {
    width: WIDTH / 3,
    height: 120,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSelected: {
    borderWidth: 3,
    borderColor: '#4A90E2',
    borderRadius: 20,
  },
  avatarPreview: {
    width: '100%',
    height: 100,
    borderRadius: 20,
  },
  avatarCounter: {
    color: '#AAA',
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 6,
    letterSpacing: 1,
  },
  nicknameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  nicknameText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'lowercase',
    flex: 1,
    textAlign: 'center',
  },
  gerarOutroBtn: {
    marginLeft: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  gerarOutroBtnDisabled: {
    opacity: 0.5,
  },
  gerarOutroText: {
    color: '#AAA',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'lowercase',
  },
  gerarOutroTextDisabled: {
    color: '#555',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  termsContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#444',
    borderRadius: 9,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  checkboxInner: {
    width: 8,
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  termsText: {
    color: '#AAA',
    fontSize: 13,
    letterSpacing: 0.5,
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  termsLink: {
    color: '#4A90E2',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
