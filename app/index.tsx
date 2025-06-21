import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const TAGS = [
  'Geral', // Todas as histórias
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

export default function App() {
  const router = useRouter();

  function handleTagPress(tag: string) {
    // Envia a tag pela query string
    router.push({ pathname: '/ecos', params: { tag } });
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
        {TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={styles.tagWrapper}
            onPress={() => handleTagPress(tag)}
            activeOpacity={0.75}
          >
            <FontAwesome5
              name='tag'
              size={12}
              color='#888'
            />
            <Text style={styles.tagText}>{tag}</Text>
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
