import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
import EcoModal from './components/EcoModal';
import SussurrosModal from './components/SussurrosModal';
import { FeedItem, useFeed } from './hooks/useFeed';
const WIDTH = Dimensions.get('window').width;

export default function Ecos({ navigation }: any) {
  const { feed, adicionarSussurro } = useFeed();
  const [search, setSearch] = useState('');
  const [ecoModalVisible, setEcoModalVisible] = useState(false);
  const [sussurrosModalVisible, setSussurrosModalVisible] = useState(false);
  const [ecoSelecionado, setEcoSelecionado] = useState<FeedItem | null>(null);

  const filteredFeed = feed.filter(
    (item) =>
      item.codinome.toLowerCase().includes(search.toLowerCase()) ||
      item.titulo.toLowerCase().includes(search.toLowerCase()) ||
      item.historia.toLowerCase().includes(search.toLowerCase())
  );

  // Função para obter ícone por gênero
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

  const handleCardPress = (item: FeedItem) => {
    setEcoSelecionado(item);
    setEcoModalVisible(true);
  };

  const handleSussurrarPress = () => {
    setEcoModalVisible(false);
    setSussurrosModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBox}
          placeholder='buscar eco'
          placeholderTextColor='#444'
          value={search}
          onChangeText={setSearch}
          selectionColor='#4A90E2'
        />
      </View>
      <FlatList
        data={filteredFeed}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.flatlistContainer,
          { paddingVertical: 16 },
        ]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress(item)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: item.avatar_url }}
              style={styles.avatar}
            />
            <View style={styles.codinomeContainer}>
              <Text style={styles.codinome}>{item.codinome}</Text>
              <FontAwesome5
                name={getGeneroIcon(item.genero)}
                size={10}
                color={getGeneroColor(item.genero)}
                style={styles.generoIcon}
              />
            </View>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.historia}>
              {item.historia.length > 148
                ? item.historia.slice(0, 148) + '...'
                : item.historia}
            </Text>
            <TouchableOpacity
              style={styles.sussurrosBtn}
              onPress={(e) => {
                e.stopPropagation();
                setEcoSelecionado(item);
                setSussurrosModalVisible(true);
              }}
              disabled={item.sussurros.length >= 10}
              activeOpacity={item.sussurros.length >= 10 ? 1 : 0.7}
            >
              <Text
                style={[
                  styles.sussurrosText,
                  item.sussurros.length >= 10 && { color: '#A55' },
                ]}
              >
                {item.sussurros.length >= 10
                  ? 'eco cheio.'
                  : `${item.sussurros.length} sussurros.`}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {/* Modal do eco completo */}
      {ecoSelecionado && (
        <EcoModal
          visible={ecoModalVisible}
          onClose={() => setEcoModalVisible(false)}
          eco={ecoSelecionado}
          onSussurrar={handleSussurrarPress}
        />
      )}

      {/* Modal de sussurros */}
      {ecoSelecionado && (
        <SussurrosModal
          visible={sussurrosModalVisible}
          onClose={() => setSussurrosModalVisible(false)}
          sussurros={ecoSelecionado.sussurros}
          onSussurrar={(novo) => {
            adicionarSussurro(ecoSelecionado.id, novo);
            setEcoSelecionado((prev) =>
              prev
                ? {
                    ...prev,
                    sussurros:
                      prev.sussurros.length < 10
                        ? [...prev.sussurros, novo]
                        : prev.sussurros,
                  }
                : null
            );
          }}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() =>
            router.push({
              pathname: '/',
            })
          }
        >
          <Text style={styles.footerBtnText}>tags</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const CARD_WIDTH = WIDTH - 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
  },
  searchContainer: {
    alignItems: 'center',
    marginTop: 42,
    marginBottom: 8,
  },
  searchBox: {
    width: '70%',
    height: 34,
    backgroundColor: 'rgba(30,30,30,0.82)',
    borderRadius: 22,
    paddingHorizontal: 14,
    color: '#DDD',
    fontSize: 15,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 1,
    borderWidth: 0,
    opacity: 0.85,
  },
  flatlistContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  card: {
    width: CARD_WIDTH,
    minHeight: 330,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 40,
    paddingVertical: 24,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'transparent',
    marginBottom: 10,
    opacity: 0.55,
  },
  codinomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  codinome: {
    color: '#4A90E2',
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'lowercase',
    letterSpacing: 1,
    opacity: 0.6,
  },
  generoIcon: {
    marginLeft: 6,
    opacity: 0.4,
  },
  titulo: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '300',
    marginTop: 4,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
    opacity: 0.5,
    textTransform: 'lowercase',
  },
  historia: {
    color: '#CCC',
    fontSize: 19,
    textAlign: 'center',
    lineHeight: 27,
    fontWeight: '400',
    maxWidth: CARD_WIDTH - 12,
    opacity: 0.96,
    marginTop: 8,
    letterSpacing: 0.2,
  },
  sussurrosBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(30,30,30,0.35)',
  },
  sussurrosText: {
    color: '#AAA',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'lowercase',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 18,
    paddingTop: 14,
  },
  footerBtn: {
    paddingHorizontal: 26,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#181818',
    opacity: 0.65,
  },
  footerBtnText: {
    color: '#AAA',
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
});
