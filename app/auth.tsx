import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ErrorModal from './components/ErrorModal';
import useLoginForm from './hooks/useLoginForm';

export default function LoginScreen() {
  // Hook de fluxo completo do login
  const loginForm = useLoginForm();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>eco.</Text>
      <Text style={styles.subtitle}>vozes sem ego.</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder='email'
          placeholderTextColor='#666'
          value={loginForm.email}
          onChangeText={loginForm.setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          textContentType='emailAddress'
        />
        <TextInput
          style={styles.input}
          placeholder='senha'
          placeholderTextColor='#666'
          value={loginForm.senha}
          onChangeText={loginForm.setSenha}
          secureTextEntry
          autoCapitalize='none'
          textContentType='password'
        />
        <TouchableOpacity
          style={styles.button}
          onPress={loginForm.handleSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>entrar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('./esqueci-senha')}>
        <Text style={styles.link}>esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('./register')}>
        <Text style={styles.link}>não tem conta? cadastre-se</Text>
      </TouchableOpacity>

      {/* Modal de erro UX global */}
      <ErrorModal
        visible={loginForm.showErrorModal}
        message={loginForm.errorMessage || ''}
        onClose={() => loginForm.setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
    marginBottom: 40,
    textTransform: 'lowercase',
    opacity: 0.8,
  },
  form: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    width: '92%',
    height: 38,
    backgroundColor: 'rgba(30,30,30,0.85)',
    borderRadius: 20,
    paddingHorizontal: 18,
    color: '#DDD',
    fontSize: 15,
    fontWeight: '300',
    marginBottom: 14,
    textAlign: 'center',
    borderWidth: 0,
  },
  button: {
    width: '92%',
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 12,
    opacity: 0.9,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    letterSpacing: 1,
    fontSize: 15,
    textTransform: 'lowercase',
  },
  link: {
    color: '#AAA',
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 1,
    textTransform: 'lowercase',
    opacity: 0.8,
    textAlign: 'center',
  },
});
