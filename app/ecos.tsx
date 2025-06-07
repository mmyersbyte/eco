// App.tsx
import { FontAwesome5 } from '@expo/vector-icons';
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
  'Conquista',
  'Traumas',
  'Histórias com Narcisista',
  'Traumas Familiares',
  'Relacionamentos',
  'Emprego Novo',
  'Histórias no Trabalho',
  'Estudos',
  'Nunca contei para ninguém',
  'Brigas de Rua',
  'Vivendo em Outro País',
  'Namorado/a Estrangeiro',
  'Acontecimentos Estranhos',
  'Sobrenatural',
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />

      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.7}>
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
          <View
            key={tag}
            style={styles.tagWrapper}
          >
            <FontAwesome5
              name='tag'
              size={12}
              color='#888'
            />
            <Text style={styles.tagText}>{tag}</Text>
          </View>
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
