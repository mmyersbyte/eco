import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTagsService } from './hooks/useTagsService';

export default function App() {
  const router = useRouter();
  const {
    tags,
    loading: tagsLoading,
    error: tagsError,
    listarTags,
  } = useTagsService();

  // Busca as tags oficiais do backend apenas uma vez ao montar
  useEffect(() => {
    listarTags();
  }, []);

  // Tag "Geral" para filtrar todas as publicações
  const allTags = [{ id: 'all', nome: 'Geral' }, ...tags];

  function handleTagPress(tag: string) {
    // Se for a tag "Geral", não filtra por nenhuma tag específica
    if (tag === 'Geral' || tag === 'all') {
      router.push('/allEcos');
    } else {
      // Envia a tag pela query string
      router.push({ pathname: '/ecos', params: { tag } });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />

      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/auth')}
        >
          <Text style={styles.newButton}>ecoe</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.logo}>eco.</Text>
        <Text style={styles.subtitle}>vozes sem ego.</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.tagsContainer}
        showsVerticalScrollIndicator={false}
      >
        {allTags.map((tag) => (
          <TouchableOpacity
            key={tag.id}
            style={styles.tagWrapper}
            onPress={() => handleTagPress(tag.id)}
            activeOpacity={0.75}
          >
            <FontAwesome5
              name='tag'
              size={12}
              color='#888'
            />
            <Text style={styles.tagText}>{tag.nome}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 16,
  },
  topBar: {
    alignItems: 'flex-end',
    paddingTop: 16,
  },
  newButton: {
    fontSize: 13,
    color: '#AAA',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.6,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFF',
    textTransform: 'lowercase',
  },
  subtitle: {
    fontSize: 14,
    color: '#AAA',
    letterSpacing: 3,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 32,
    justifyContent: 'flex-start',
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 6,
  },
});
