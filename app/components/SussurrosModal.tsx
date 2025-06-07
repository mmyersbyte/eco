import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
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

export default function SussurrosModal({
  visible,
  onClose,
  sussurros,
  onSussurrar,
}: SussurrosModalProps) {
  const [novo, setNovo] = useState('');

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
          <Text style={styles.modalTitle}>sussurros.</Text>

          {sussurros.length === 0 && (
            <Text style={styles.semSussurros}>nenhum sussurro ainda.</Text>
          )}

          <FlatList
            data={sussurros}
            keyExtractor={(_, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sussurrosList}
            renderItem={({ item }) => (
              <Text style={styles.sussurroItem}>{item}</Text>
            )}
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

          <TouchableOpacity
            style={styles.fecharBtn}
            onPress={onClose}
          >
            <Text style={styles.fecharText}>fechar</Text>
          </TouchableOpacity>
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
  modalTitle: {
    fontSize: 26,
    color: '#EEE',
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'lowercase',
    marginBottom: 24,
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
  sussurroItem: {
    color: '#AAA',
    fontSize: 16,
    marginVertical: 6,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.92,
    width: '98%',
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
  fecharBtn: {
    marginTop: 10,
    alignSelf: 'center',
    padding: 7,
    paddingHorizontal: 24,
  },
  fecharText: {
    color: '#666',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
});
