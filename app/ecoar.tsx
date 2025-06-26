import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ErrorModal from './components/ErrorModal';
import SuccessModal from './components/SuccessModal';
import ThreadInput from './components/ThreadInput';
import useEcoForm from './hooks/useEcoForm';
import { useTagsService } from './hooks/useTagsService';

export default function EcoarScreen() {
  const router = useRouter();
  // Hook de fluxo completo do eco
  const ecoForm = useEcoForm();
  // Estados para controlar visibilidade dos campos opcionais
  const [showThread2, setShowThread2] = React.useState(false);
  const [showThread3, setShowThread3] = React.useState(false);

  // Hook de tags oficiais
  const {
    tags,
    loading: tagsLoading,
    error: tagsError,
    listarTags,
  } = useTagsService();
  React.useEffect(() => {
    listarTags();
  }, []);

  // Ícones por gênero
  const getGeneroIcon = (genero: 'M' | 'F' | 'O') => {
    switch (genero) {
      case 'M':
        return 'male';
      case 'F':
        return 'female';
      case 'O':
        return 'transgender-alt'; // 'O' representa não-binário/outro
      default:
        return 'question';
    }
  };

  const getGeneroColor = (genero: 'M' | 'F' | 'O') => {
    switch (genero) {
      case 'M':
        return '#4A90E2';
      case 'F':
        return '#E24A90';
      case 'O':
        return '#9A4AE2';
      default:
        return '#AAA';
    }
  };

  const toggleTag = (tagId: string) => {
    ecoForm.setSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((t) => t !== tagId);
      } else {
        if (prev.length >= 3) return prev;
        return [...prev, tagId];
      }
    });
  };

  const handleAddThread = () => {
    if (!showThread2) setShowThread2(true);
    else if (!showThread3) setShowThread3(true);
  };

  const handleRemoveThread2 = () => {
    ecoForm.setThread2('');
    setShowThread2(false);
  };

  const handleRemoveThread3 = () => {
    ecoForm.setThread3('');
    setShowThread3(false);
  };

  const canAddMoreThreads = !showThread2 || !showThread3;

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
          {ecoForm.user && (
            <>
              <Image
                source={{ uri: ecoForm.user.avatar_url }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <View style={styles.codinomeRow}>
                  <FontAwesome5
                    name={getGeneroIcon(ecoForm.user.genero)}
                    size={14}
                    color={getGeneroColor(ecoForm.user.genero)}
                  />
                  <Text style={styles.codinome}>{ecoForm.user.codinome}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Preview de tags oficiais do backend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>tags do seu eco</Text>
          <View style={styles.tagsContainer}>
            {tagsLoading && (
              <Text style={{ color: '#4A90E2' }}>carregando tags...</Text>
            )}
            {tagsError && <Text style={{ color: '#FF6B6B' }}>{tagsError}</Text>}
            {!tagsLoading &&
              !tagsError &&
              tags.map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  style={[
                    styles.tagChip,
                    ecoForm.selectedTagIds.includes(tag.id) &&
                      styles.tagChipSelected,
                  ]}
                  onPress={() => toggleTag(tag.id)}
                  activeOpacity={0.7}
                >
                  <FontAwesome5
                    name='tag'
                    size={10}
                    color={
                      ecoForm.selectedTagIds.includes(tag.id) ? '#FFF' : '#666'
                    }
                  />
                  <Text
                    style={[
                      styles.tagText,
                      ecoForm.selectedTagIds.includes(tag.id) &&
                        styles.tagTextSelected,
                    ]}
                  >
                    {tag.nome}
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
            value={ecoForm.thread1}
            onChangeText={ecoForm.setThread1}
            isRequired={true}
          />

          {/* Thread 2 - Opcional */}
          {showThread2 && (
            <ThreadInput
              label='segunda thread'
              placeholder='continue se quiser...'
              value={ecoForm.thread2}
              onChangeText={ecoForm.setThread2}
              onRemove={handleRemoveThread2}
            />
          )}

          {/* Thread 3 - Opcional */}
          {showThread3 && (
            <ThreadInput
              label='terceira thread'
              placeholder='finalize se necessário...'
              value={ecoForm.thread3}
              onChangeText={ecoForm.setThread3}
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
            (ecoForm.loading ||
              !ecoForm.thread1.trim() ||
              ecoForm.selectedTagIds.length === 0) &&
              styles.publishButtonDisabled,
          ]}
          onPress={ecoForm.handleSubmit}
          disabled={
            ecoForm.loading ||
            !ecoForm.thread1.trim() ||
            ecoForm.selectedTagIds.length === 0
          }
          activeOpacity={0.8}
        >
          <Text style={styles.publishButtonText}>
            {ecoForm.loading ? 'publicando...' : 'publicar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de erro UX global */}
      <ErrorModal
        visible={ecoForm.showErrorModal}
        message={ecoForm.errorMessage || ''}
        onClose={() => ecoForm.setShowErrorModal(false)}
      />

      {/* Modal de sucesso UX global */}
      <SuccessModal
        visible={ecoForm.showSuccessModal}
        message={'Seu eco foi publicado!'}
        onClose={() => {
          ecoForm.setShowSuccessModal(false);
          router.push('/ecos');
        }}
      />
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
