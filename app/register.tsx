import React from 'react';
import {
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
import ErrorModal from './components/ErrorModal';
import TermsModal from './components/TermsModal';
import useRegisterForm from './hooks/useRegisterForm';

const WIDTH = Dimensions.get('window').width;

export default function CadastroScreen() {
  // Hook de fluxo completo do cadastro
  const cadastro = useRegisterForm();

  return (
    <SafeAreaView style={styles.container}>
      {/* Exibe loading global do cadastro */}
      {cadastro.loading && (
        <Text style={{ color: '#4A90E2', textAlign: 'center' }}>
          carregando...
        </Text>
      )}
      <Text style={styles.logo}>eco.</Text>
      <Text style={styles.subtitle}>crie sua conta anônima</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder='email'
          placeholderTextColor='#666'
          value={cadastro.email}
          onChangeText={cadastro.setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          textContentType='emailAddress'
        />
        <TextInput
          style={styles.input}
          placeholder='senha'
          placeholderTextColor='#666'
          value={cadastro.senha}
          onChangeText={cadastro.setSenha}
          secureTextEntry
          autoCapitalize='none'
          textContentType='password'
        />
        <TextInput
          style={styles.input}
          placeholder='confirmar senha'
          placeholderTextColor='#666'
          value={cadastro.confirmSenha}
          onChangeText={cadastro.setConfirmSenha}
          secureTextEntry
          autoCapitalize='none'
          textContentType='password'
        />

        <Text style={styles.label}>selecione seu gênero</Text>
        <View style={styles.generoContainer}>
          {/* O backend espera 'O' para não binário, não 'N' */}
          {['M', 'F', 'O'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.generoBtn,
                cadastro.genero === g && styles.generoBtnSelected,
              ]}
              onPress={() => cadastro.setGenero(g as 'M' | 'F' | 'O')}
            >
              <Text
                style={[
                  styles.generoBtnText,
                  cadastro.genero === g && styles.generoBtnTextSelected,
                ]}
              >
                {g === 'M' ? 'Masculino' : g === 'F' ? 'Feminino' : 'Outro'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {cadastro.genero && (
          <>
            <Text style={[styles.label, { marginTop: 20 }]}>seu avatar</Text>
            <FlatList
              ref={cadastro.flatListRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={cadastro.avatars}
              keyExtractor={(item) => item}
              onScroll={cadastro.onAvatarScroll}
              scrollEventThrottle={16}
              getItemLayout={(_, index) => ({
                length: WIDTH / 3,
                offset: (WIDTH / 3) * index,
                index,
              })}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => cadastro.selectAvatar(index)}
                  style={[
                    styles.avatarWrapper,
                    index === cadastro.selectedAvatarIndex &&
                      styles.avatarSelected,
                  ]}
                >
                  <Image
                    source={{ uri: item }}
                    style={[
                      styles.avatarPreview,
                      index !== cadastro.selectedAvatarIndex && {
                        opacity: 0.6,
                      },
                    ]}
                    resizeMode='cover'
                  />
                </TouchableOpacity>
              )}
            />
            <Text style={styles.avatarCounter}>
              {cadastro.selectedAvatarIndex + 1} / {cadastro.avatars.length}
            </Text>

            <Text style={styles.label}>seu codinome</Text>
            <View style={styles.nicknameContainer}>
              <Text style={styles.nicknameText}>
                {cadastro.isGenerating
                  ? 'gerando...'
                  : cadastro.codinomeAtual || 'carregando...'}
              </Text>
              <TouchableOpacity
                onPress={cadastro.handleGerarNovoCodinome}
                style={[
                  styles.gerarOutroBtn,
                  cadastro.isGenerating && styles.gerarOutroBtnDisabled,
                ]}
                disabled={cadastro.isGenerating}
              >
                <Text
                  style={[
                    styles.gerarOutroText,
                    cadastro.isGenerating && styles.gerarOutroTextDisabled,
                  ]}
                >
                  {cadastro.isGenerating ? 'gerando...' : 'gerar outro'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={cadastro.toggleTermsAcceptance}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                cadastro.aceitouTermos && styles.checkboxSelected,
              ]}
            >
              {cadastro.aceitouTermos && <View style={styles.checkboxInner} />}
            </View>

            <Text style={styles.termsText}>
              aceito as{' '}
              <Text
                style={styles.termsLink}
                onPress={cadastro.handleOpenTerms}
              >
                normas e condições
              </Text>{' '}
              do aplicativo
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={cadastro.handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>criar conta</Text>
        </TouchableOpacity>
      </View>

      <TermsModal
        visible={cadastro.showTermsModal}
        onClose={cadastro.handleCloseTerms}
      />

      {/* Modal de erro UX global */}
      <ErrorModal
        visible={cadastro.showErrorModal}
        message={cadastro.errorMessage || ''}
        onClose={() => cadastro.setShowErrorModal(false)}
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
