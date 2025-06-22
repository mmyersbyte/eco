import React from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const WIDTH = Dimensions.get('window').width;

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TermsModal({ visible, onClose }: TermsModalProps) {
  return (
    <Modal
      visible={visible}
      animationType='fade'
      transparent
      onRequestClose={onClose}
    >
      {/* Overlay escuro que cobre toda a tela */}
      <View style={styles.modalOverlay}>
        {/* Container principal do modal */}
        <View style={styles.modalContainer}>
          {/* Cabeçalho do modal */}
          <Text style={styles.modalTitle}>nosso compromisso.</Text>

          {/* Conteúdo scrollável dos termos */}
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Seção sobre privacidade - conceito central do Eco */}
            <Text style={styles.sectionTitle}>privacidade radical</Text>
            <Text style={styles.termsText}>
              no eco, sua privacidade é sagrada. não coletamos dados pessoais,
              não vendemos informações e não criamos perfis de comportamento.
            </Text>

            {/* Seção sobre anonimato */}
            <Text style={styles.sectionTitle}>anonimato real</Text>
            <Text style={styles.termsText}>
              seu codinome é gerado automaticamente. não há como rastrear suas
              publicações até você. seus ecos são verdadeiramente anônimos.
            </Text>

            {/* Seção sobre responsabilidade */}
            <Text style={styles.sectionTitle}>espaço seguro</Text>
            <Text style={styles.termsText}>
              este é um lugar de escuta e acolhimento. conteúdo ofensivo,
              discriminatório ou que viole a dignidade humana será removido.
            </Text>

            {/* Seção sobre limites */}
            <Text style={styles.sectionTitle}>limites saudáveis</Text>
            <Text style={styles.termsText}>
              cada eco pode receber até 10 sussurros. isso preserva a qualidade
              das interações e evita sobrecarga emocional.
            </Text>

            {/* Seção sobre dados mínimos */}
            <Text style={styles.sectionTitle}>dados mínimos</Text>
            <Text style={styles.termsText}>
              armazenamos apenas seu e-mail (para login) e suas publicações
              anônimas. nada mais. seu avatar e codinome são gerados
              aleatoriamente pelo sistema.
            </Text>

            {/* Mensagem final empática */}
            <Text style={styles.finalMessage}>
              ao usar o eco, você concorda em criar um espaço de escuta
              respeitosa e compartilhamento seguro.
            </Text>
          </ScrollView>

          {/* Botão para fechar o modal */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>entendi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Overlay que escurece o fundo da tela
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 15, 0.9)', // Fundo escuro semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // Container principal do modal
  modalContainer: {
    width: WIDTH - 40,
    maxHeight: '80%', // Limita altura para não ocupar tela toda
    backgroundColor: '#1A1A1A', // Fundo escuro consistente com o app
    borderRadius: 24, // Bordas arredondadas suaves
    padding: 24,
    alignItems: 'center',
  },

  // Título principal do modal
  modalTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'lowercase', // Consistente com o design do app
    marginBottom: 20,
    textAlign: 'center',
  },

  // Container do conteúdo scrollável
  scrollContent: {
    width: '100%',
    maxHeight: 400, // Altura máxima para permitir scroll
  },

  // Títulos das seções
  sectionTitle: {
    fontSize: 16,
    color: '#4A90E2', // Cor azul do tema do app
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'lowercase',
    marginTop: 16,
    marginBottom: 8,
  },

  // Texto principal dos termos
  termsText: {
    fontSize: 14,
    color: '#CCCCCC', // Cinza claro para boa legibilidade
    lineHeight: 20, // Espaçamento entre linhas para facilitar leitura
    marginBottom: 12,
    textAlign: 'left',
  },

  // Mensagem final mais destacada
  finalMessage: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
    lineHeight: 22,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic', // Destaque sutil
  },

  // Botão para fechar o modal
  closeButton: {
    backgroundColor: '#4A90E2', // Cor principal do app
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop: 20,
  },

  // Texto do botão de fechar
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'lowercase', // Consistente com o design
  },
});
