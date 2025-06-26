import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EcoModal from './components/EcoModal';
import SussurrosModal from './components/SussurrosModal';
import { FeedItem, useFeed } from './hooks/useFeed';

const WIDTH = Dimensions.get('window').width;

/**
 * Feed geral de ecos (sem filtro de tag).
 * Tela única, clean, sem headers ou tags antigos.
 */
export default function AllEcos() {
  const router = useRouter();
  // Busca o feed real do backend, sem filtro de tag
  const { feed, listarFeed, loading } = useFeed();
  // Controla visibilidade dos modais
  const [ecoModalVisible, setEcoModalVisible] = React.useState(false);
  const [sussurrosModalVisible, setSussurrosModalVisible] =
    React.useState(false);

  // Hook para buscar detalhes completos do eco selecionado
  const {
    eco: ecoDetalhe,
    loading: loadingEco,
    error: errorEco,
    buscarEco,
  } = require('./hooks/useEcoDetalhe').useEcoDetalhe();

  useEffect(() => {
    listarFeed();
  }, []);

  // Função utilitária para garantir compatibilidade do gênero
  function normalizarGenero(genero: string): 'M' | 'F' | 'O' {
    if (genero === 'N') return 'O';
    if (genero === 'M' || genero === 'F' || genero === 'O') return genero;
    return 'O';
  }

  // Funções auxiliares para ícone e cor do gênero
  function getGeneroIcon(genero: 'M' | 'F' | 'O'): string {
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
  }

  function getGeneroColor(genero: 'M' | 'F' | 'O'): string {
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
  }

  // Função utilitária para contar quantas threads existem no eco
  function contarThreads(item: FeedItem): number {
    let count = 0;
    if (item.thread_1) count++;
    if (item.thread_2) count++;
    if (item.thread_3) count++;
    return count;
  }

  // Função utilitária para formatar a data (DD/MM/YYYY)
  function formatarData(dataISO: string) {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  // Handler para abrir modal de eco
  const handleCardPress = async (item: FeedItem) => {
    await buscarEco(item.id);
    setEcoModalVisible(true);
  };

  // Handler para abrir modal de sussurros
  const handleSussurrarPress = () => {
    setEcoModalVisible(false);
    setSussurrosModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header minimalista: botão de voltar à esquerda, título centralizado, sem cor azul */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole='button'
          accessibilityLabel='Voltar'
        >
          <Ionicons
            name='arrow-back'
            size={22}
            color='#AAA'
          />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <FontAwesome5
            name='tag'
            size={15}
            color='#AAA'
            style={styles.headerTagIcon}
          />
          <Text style={styles.headerTitle}>geral.</Text>
        </View>
        {/* Espaço para manter o título centralizado */}
        <View style={styles.rightSpacer} />
      </View>
      {/* Lista de ecos reais do backend */}
      {loading ? (
        <Text style={{ color: '#4A90E2', textAlign: 'center', marginTop: 40 }}>
          carregando ecos...
        </Text>
      ) : (
        <FlatList
          data={feed}
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
              {/* Avatar e codinome do usuário */}
              <View style={styles.userInfoRow}>
                <Image
                  source={{ uri: item.avatar_url }}
                  style={styles.avatar}
                />
                <View style={styles.userInfoTextContainer}>
                  <View style={styles.codinomeContainer}>
                    <Text style={styles.codinome}>{item.codinome}</Text>
                    <FontAwesome5
                      name={getGeneroIcon(normalizarGenero(item.genero))}
                      size={10}
                      color={getGeneroColor(normalizarGenero(item.genero))}
                      style={styles.generoIcon}
                    />
                  </View>
                  {/* Data de publicação */}
                  <Text style={styles.dataPublicacao}>
                    {formatarData(item.created_at || '')}
                  </Text>
                </View>
              </View>
              {/* Exibe apenas a primeira thread */}
              <View style={{ width: '100%', marginTop: 8 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginBottom: 2,
                  }}
                >
                  <Text style={styles.threadCount}>
                    {contarThreads(item)} thread
                    {contarThreads(item) > 1 ? 's' : ''}
                  </Text>
                </View>
                <Text style={styles.historia}>{item.thread_1}</Text>
              </View>
              {/* Tags do eco - apenas visual, sem filtro */}
              <View
                style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}
              >
                {item.tags.map((tagObj) => (
                  <View
                    key={tagObj.id}
                    style={{
                      backgroundColor: '#232A34',
                      borderRadius: 10,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      marginRight: 6,
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ color: '#4A90E2', fontSize: 11 }}>
                      {tagObj.nome}
                    </Text>
                  </View>
                ))}
              </View>
              {/* Divisor UX agradável entre cards */}
              <View style={styles.cardDivider} />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal do eco completo (detalhes) */}
      {ecoModalVisible && (
        <EcoModal
          visible={ecoModalVisible}
          onClose={() => setEcoModalVisible(false)}
          eco={ecoDetalhe}
          onSussurrar={handleSussurrarPress}
        />
      )}

      {/* Modal de sussurros do eco */}
      {sussurrosModalVisible && (
        <SussurrosModal
          visible={sussurrosModalVisible}
          onClose={() => setSussurrosModalVisible(false)}
          sussurros={ecoDetalhe?.sussurros || []}
          onSussurrar={(novo) => {
            // Implemente a lógica para adicionar um novo sussurro ao eco
          }}
        />
      )}

      {/* Loading/erro do eco detalhado */}
      {ecoModalVisible && loadingEco && (
        <View style={{ position: 'absolute', top: '50%', left: 0, right: 0 }}>
          <Text style={{ color: '#4A90E2', textAlign: 'center' }}>
            carregando eco...
          </Text>
        </View>
      )}
      {ecoModalVisible && errorEco && (
        <View style={{ position: 'absolute', top: '50%', left: 0, right: 0 }}>
          <Text style={{ color: 'red', textAlign: 'center' }}>{errorEco}</Text>
        </View>
      )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    marginBottom: 2,
    minHeight: 40,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 0,
    marginRight: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 6,
  },
  headerTagIcon: {
    marginRight: 4,
    marginTop: 1,
  },
  headerTitle: {
    color: '#DDD',
    fontSize: 15,
    fontWeight: '500',
    textTransform: 'lowercase',
    letterSpacing: 1,
    opacity: 0.7,
    marginLeft: 2,
  },
  rightSpacer: {
    width: 32,
    height: 32,
  },
  addButton: {
    display: 'none', // Esconde o botão + para o header minimalista
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
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },
  userInfoTextContainer: {
    flex: 1,
    justifyContent: 'center',
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
  dataPublicacao: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
    marginLeft: 2,
    letterSpacing: 0.5,
    textTransform: 'lowercase',
  },
  threadCount: {
    color: '#AAA',
    fontSize: 11,
    opacity: 0.6,
    letterSpacing: 0.5,
    textTransform: 'lowercase',
    textAlign: 'right',
    flex: 0,
    minWidth: 54,
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
  cardDivider: {
    height: 1,
    backgroundColor: '#232A34',
    marginTop: 18,
    marginBottom: 8,
    borderRadius: 1,
    opacity: 0.18,
    width: '100%',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'transparent',
    marginBottom: 10,
    opacity: 0.55,
  },
});
