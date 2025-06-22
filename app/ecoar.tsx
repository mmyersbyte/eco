import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ThreadInput from './components/ThreadInput';

// Tags disponíveis (mesmo array do index.tsx)
const TAGS_DISPONIVEIS = [
  'Geral',
  'Histórias boas',
  'Traumas',
  'Brigas de Rua',
  'Sobrenatural',
  'Histórias com Narcisista',
  'Relacionamentos',
  'Histórias no Trabalho',
  'Estudos',
  'Nunca contei para ninguém',
  'Vivendo em Outro País',
  'Acontecimentos Estranhos',
];

// Mock do usuário logado (em produção viria do contexto/storage)
const USUARIO_MOCK = {
  id: '123',
  codinome: 'sussurrocristal',
  genero: 'F' as 'M' | 'F' | 'N',
  avatar_url:
    'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/mulher-eco.png',
};

export default function EcoarScreen() {
  const router = useRouter();

  const [thread1, setThread1] = useState('');
  const [thread2, setThread2] = useState('');
  const [thread3, setThread3] = useState('');
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Estados para controlar visibilidade dos campos opcionais
  const [showThread2, setShowThread2] = useState(false);
  const [showThread3, setShowThread3] = useState(false);

  // Ícones por gênero
  const getGeneroIcon = (genero: 'M' | 'F' | 'N') => {
    switch (genero) {
      case 'M':
        return 'male';
      case 'F':
        return 'female';
      case 'N':
        return 'transgender-alt';
      default:
        return 'question';
    }
  };

  const getGeneroColor = (genero: 'M' | 'F' | 'N') => {
    switch (genero) {
      case 'M':
        return '#4A90E2';
      case 'F':
        return '#E24A90';
      case 'N':
        return '#9A4AE2';
      default:
        return '#AAA';
    }
  };

  const toggleTag = (tag: string) => {
    setTagsSelecionadas((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        // Limita a 3 tags
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, tag];
      }
    });
  };

  const handleAddThread = () => {
    if (!showThread2) {
      setShowThread2(true);
    } else if (!showThread3) {
      setShowThread3(true);
    }
  };

  const handleRemoveThread2 = () => {
    setThread2('');
    setShowThread2(false);
  };

  const handleRemoveThread3 = () => {
    setThread3('');
    setShowThread3(false);
  };

  const canAddMoreThreads = !showThread2 || !showThread3;

  const handlePublicar = async () => {
    if (!thread1.trim()) {
      Alert.alert('Ops!', 'A primeira thread é obrigatória para ecoar.');
      return;
    }

    if (tagsSelecionadas.length === 0) {
      Alert.alert('Ops!', 'Selecione pelo menos uma tag para seu eco.');
      return;
    }

    setIsPublishing(true);

    try {
      // Aqui seria a chamada para a API
      // const response = await api.post('/eco', {
      //   thread_1: thread1,
      //   thread_2: thread2 || null,
      //   thread_3: thread3 || null,
      //   tags: tagsSelecionadas
      // });

      // Simula delay da API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert('Eco enviado!', 'Seu eco foi compartilhado anonimamente.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar seu eco. Tente novamente.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com perfil */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name='arrow-back'
            size={24}
            color='#AAA'
          />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <Image
            source={{ uri: USUARIO_MOCK.avatar_url }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <View style={styles.codinomeRow}>
              <FontAwesome5
                name={getGeneroIcon(USUARIO_MOCK.genero)}
                size={14}
                color={getGeneroColor(USUARIO_MOCK.genero)}
              />
              <Text style={styles.codinome}>{USUARIO_MOCK.codinome}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Preview de tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>tags do seu eco</Text>
          <View style={styles.tagsContainer}>
            {TAGS_DISPONIVEIS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagChip,
                  tagsSelecionadas.includes(tag) && styles.tagChipSelected,
                ]}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.7}
              >
                <FontAwesome5
                  name='tag'
                  size={10}
                  color={tagsSelecionadas.includes(tag) ? '#FFF' : '#666'}
                />
                <Text
                  style={[
                    styles.tagText,
                    tagsSelecionadas.includes(tag) && styles.tagTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Campos de thread */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>seu eco</Text>

          {/* Thread 1 - Sempre visível e obrigatória */}
          <ThreadInput
            label='primeira thread'
            placeholder='conte sua história...'
            value={thread1}
            onChangeText={setThread1}
            isRequired={true}
          />

          {/* Thread 2 - Opcional */}
          {showThread2 && (
            <ThreadInput
              label='segunda thread'
              placeholder='continue se quiser...'
              value={thread2}
              onChangeText={setThread2}
              onRemove={handleRemoveThread2}
            />
          )}

          {/* Thread 3 - Opcional */}
          {showThread3 && (
            <ThreadInput
              label='terceira thread'
              placeholder='finalize se necessário...'
              value={thread3}
              onChangeText={setThread3}
              onRemove={handleRemoveThread3}
            />
          )}

          {/* Botão para adicionar thread */}
          {canAddMoreThreads && (
            <TouchableOpacity
              style={styles.addThreadButton}
              onPress={handleAddThread}
              activeOpacity={0.7}
            >
              <Ionicons
                name='add'
                size={20}
                color='#4A90E2'
              />
              <Text style={styles.addThreadText}>
                adicionar {!showThread2 ? 'segunda' : 'terceira'} thread
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Botão de publicar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.publishButton,
            (!thread1.trim() ||
              tagsSelecionadas.length === 0 ||
              isPublishing) &&
              styles.publishButtonDisabled,
          ]}
          onPress={handlePublicar}
          disabled={
            !thread1.trim() || tagsSelecionadas.length === 0 || isPublishing
          }
          activeOpacity={0.8}
        >
          {isPublishing ? (
            <Text style={styles.publishButtonText}>ecoando...</Text>
          ) : (
            <Text style={styles.publishButtonText}>ecoar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    padding: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  codinomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codinome: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    color: '#AAA',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    opacity: 0.8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagChipSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  tagText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 6,
  },
  tagTextSelected: {
    color: '#FFF',
  },
  addThreadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  addThreadText: {
    color: '#4A90E2',
    fontSize: 14,
    marginLeft: 8,
    textTransform: 'lowercase',
    letterSpacing: 0.5,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  publishButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  publishButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  publishButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'lowercase',
    letterSpacing: 1,
  },
});
