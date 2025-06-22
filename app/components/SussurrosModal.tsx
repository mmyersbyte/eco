import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const WIDTH = Dimensions.get('window').width;

interface SussurrosModalProps {
  visible: boolean;
  onClose: () => void;
  sussurros: string[];
  onSussurrar: (novoSussurro: string) => void;
}

// Interface para cada sussurro (mock/futuro backend)
interface SussurroItem {
  id: string;
  conteudo: string;
  codinome: string;
  avatar_url: string;
  created_at: string | Date;
}

// Função mock para hora relativa (substituir por util real depois)
function horaRelativa(date: string | Date) {
  return 'há pouco'; // TODO: integrar dayjs ou date-fns
}

// Componente para exibir cada sussurro
function SussurroCard({ sussurro }: { sussurro: SussurroItem }) {
  return (
    <View style={styles.sussurroCard}>
      <Image
        source={{ uri: sussurro.avatar_url }}
        style={styles.sussurroAvatar}
      />
      <View style={styles.sussurroInfo}>
        <View style={styles.sussurroHeader}>
          <Text style={styles.sussurroCodinome}>{sussurro.codinome}</Text>
          <Text style={styles.sussurroHora}>
            {horaRelativa(sussurro.created_at)}
          </Text>
        </View>
        <Text style={styles.sussurroConteudo}>{sussurro.conteudo}</Text>
      </View>
    </View>
  );
}

export default function SussurrosModal({
  visible,
  onClose,
  sussurros,
  onSussurrar,
}: SussurrosModalProps) {
  const [novo, setNovo] = useState('');

  // MOCK: transformar array simples em array de objetos (futuro: virá do backend)
  const sussurrosData: SussurroItem[] = sussurros.map((conteudo, idx) => ({
    id: String(idx),
    conteudo,
    codinome: 'eco_anon', // TODO: backend
    avatar_url:
      'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/anon-eco.png', // TODO: backend
    created_at: new Date(), // TODO: backend
  }));

  // TODO: estados de loading/erro vindos do backend futuramente
  const loading = false;
  const error = null;

  const handleSussurrar = () => {
    if (novo.trim() && sussurros.length < 10) {
      onSussurrar(novo.trim());
      setNovo('');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType='fade'
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>sussurros.</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityRole='button'
              accessibilityLabel='Fechar modal'
            >
              <FontAwesome5
                name='times'
                size={16}
                color='#666'
              />
            </TouchableOpacity>
          </View>

          {/* Espaço para loading/erro do backend */}
          {loading && <Text style={styles.semSussurros}>carregando...</Text>}
          {error && (
            <Text style={styles.semSussurros}>erro ao carregar sussurros.</Text>
          )}

          {!loading && !error && sussurrosData.length === 0 && (
            <Text style={styles.semSussurros}>nenhum sussurro ainda.</Text>
          )}

          <FlatList
            data={sussurrosData}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sussurrosList}
            renderItem={({ item }) => <SussurroCard sussurro={item} />}
          />

          {sussurros.length < 10 ? (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder='deixe um sussurro...'
                placeholderTextColor='#666'
                value={novo}
                onChangeText={setNovo}
                maxLength={100}
                editable={sussurros.length < 10}
                onSubmitEditing={handleSussurrar}
                returnKeyType='send'
              />
              <TouchableOpacity
                style={[
                  styles.enviarBtn,
                  (!novo.trim() || sussurros.length >= 10) && { opacity: 0.4 },
                ]}
                onPress={handleSussurrar}
                disabled={!novo.trim() || sussurros.length >= 10}
              >
                <Text style={styles.enviarText}>sussurrar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.ecoCheio}>eco cheio.</Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,16,16,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: WIDTH - 36,
    backgroundColor: '#141414',
    borderRadius: 26,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 26,
    color: '#EEE',
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'lowercase',
    flex: 1,
  },
  semSussurros: {
    color: '#555',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  sussurrosList: {
    minHeight: 40,
    maxHeight: 200,
    marginBottom: 26,
    width: '100%',
    alignItems: 'center',
  },
  sussurroCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    width: '100%',
  },
  sussurroAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: '#222',
    opacity: 0.85,
  },
  sussurroInfo: {
    flex: 1,
  },
  sussurroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sussurroCodinome: {
    color: '#4A90E2',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 8,
    textTransform: 'lowercase',
  },
  sussurroHora: {
    color: '#AAA',
    fontSize: 11,
    fontWeight: '400',
  },
  sussurroConteudo: {
    color: '#DDD',
    fontSize: 15,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
    marginTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#232323',
    color: '#EEE',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 10,
    borderWidth: 0,
    letterSpacing: 1,
  },
  enviarBtn: {
    backgroundColor: '#222',
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  enviarText: {
    color: '#AAA',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  ecoCheio: {
    color: '#A55',
    fontSize: 15,
    fontWeight: '500',
    marginVertical: 20,
    letterSpacing: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 5,
  },
});
