import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

/**
 * Modal de erro minimalista e confortável, alinhado ao conceito do Eco.
 * Fundo escuro, mensagem centralizada, ícone sutil e botão de fechar.
 */
export default function ErrorModal({
  visible,
  message,
  onClose,
}: ErrorModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <FontAwesome5
            name='exclamation-circle'
            size={36}
            color='#4A90E2'
            style={styles.icon}
          />
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.8}
            accessibilityLabel='Fechar aviso de erro'
          >
            <Text style={styles.closeText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,10,20,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#181A20',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    minWidth: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.85,
  },
  message: {
    color: '#EEE',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 22,
    fontWeight: '400',
    letterSpacing: 0.2,
    opacity: 0.95,
  },
  closeBtn: {
    backgroundColor: '#232A34',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
  closeText: {
    color: '#4A90E2',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
