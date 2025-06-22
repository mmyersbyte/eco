import { FontAwesome5 } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FeedItem } from '../hooks/useFeed';

const WIDTH = Dimensions.get('window').width;

// Constantes para cores e espaçamentos
const COLORS = {
  primary: '#4A90E2',
  secondary: '#E24A90',
  tertiary: '#9A4AE2',
  text: '#DDD',
  textSecondary: '#666',
  textTertiary: '#AAA',
  background: '#141414',
  backgroundSecondary: '#1A1A1A',
  border: '#222',
  borderSecondary: '#333',
  overlay: 'rgba(16,16,16,0.85)',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Funções auxiliares movidas para fora do componente
const getGeneroIcon = (genero: 'M' | 'F' | 'N'): string => {
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

const getGeneroColor = (genero: 'M' | 'F' | 'N'): string => {
  switch (genero) {
    case 'M':
      return COLORS.primary;
    case 'F':
      return COLORS.secondary;
    case 'N':
      return COLORS.tertiary;
    default:
      return COLORS.textTertiary;
  }
};

interface EcoModalProps {
  visible: boolean;
  onClose: () => void;
  eco: FeedItem | null;
  onSussurrar?: () => void;
}

export default function EcoModal({
  visible,
  onClose,
  eco,
  onSussurrar,
}: EcoModalProps) {
  if (!eco) return null;

  // Memoização das threads para otimizar performance
  const threads = useMemo(
    () => [eco.thread_1, eco.thread_2, eco.thread_3].filter(Boolean),
    [eco.thread_1, eco.thread_2, eco.thread_3]
  );

  return (
    <Modal
      visible={visible}
      animationType='fade'
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header com perfil */}
          <View style={styles.header}>
            <Image
              source={{ uri: eco.avatar_url }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <View style={styles.codinomeRow}>
                <Text style={styles.codinome}>{eco.codinome}</Text>
                <FontAwesome5
                  name={getGeneroIcon(eco.genero)}
                  size={12}
                  color={getGeneroColor(eco.genero)}
                  style={styles.generoIcon}
                />
              </View>
            </View>
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
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Conteúdo scrollável */}
          <View style={styles.content}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Tags */}
              {eco.tags.length > 0 && (
                <View style={styles.tagsSection}>
                  <View style={styles.tagsContainer}>
                    {eco.tags.map((tag, index) => (
                      <View
                        key={index}
                        style={[
                          styles.tagChip,
                          index > 0 && { marginLeft: SPACING.xs },
                          index >= 2 &&
                            index % 2 === 0 && { marginTop: SPACING.xs },
                        ]}
                      >
                        <FontAwesome5
                          name='tag'
                          size={8}
                          color={COLORS.textSecondary}
                        />
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Threads */}
              <View style={styles.threadsSection}>
                {threads.map((thread, index) => (
                  <View
                    key={index}
                    style={styles.threadContainer}
                  >
                    <View style={styles.threadHeader}>
                      <Text style={styles.threadNumber}>thread{index + 1}</Text>
                    </View>
                    <Text style={styles.threadText}>{thread}</Text>
                    {index < threads.length - 1 && (
                      <View style={styles.threadSeparator} />
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Footer com ações */}
          <View style={styles.footer}>
            {eco.sussurros.length < 10 && onSussurrar && (
              <TouchableOpacity
                style={styles.sussurrarBtn}
                onPress={onSussurrar}
                activeOpacity={0.7}
                accessibilityRole='button'
                accessibilityLabel='Sussurrar neste eco'
              >
                <Text style={styles.sussurrarText}>sussurrar</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.sussurrosCount}>
              {eco.sussurros.length >= 10
                ? 'eco cheio.'
                : `${eco.sussurros.length} sussurros.`}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContainer: {
    width: WIDTH - 32,
    maxHeight: '85%',
    backgroundColor: COLORS.background,
    borderRadius: SPACING.xxl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: SPACING.lg,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: SPACING.md,
    opacity: 0.8,
  },
  profileInfo: {
    flex: 1,
  },
  codinomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codinome: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'lowercase',
    letterSpacing: 0.5,
  },
  generoIcon: {
    marginLeft: SPACING.sm,
    opacity: 0.6,
  },
  content: {
    paddingHorizontal: SPACING.xl,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: SPACING.lg,
  },
  tagsSection: {
    marginBottom: SPACING.xl,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  tagText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginLeft: SPACING.xs,
    textTransform: 'lowercase',
  },
  threadsSection: {
    marginBottom: SPACING.lg,
  },
  threadContainer: {
    marginBottom: SPACING.lg,
  },
  threadHeader: {
    marginBottom: SPACING.sm,
  },
  threadNumber: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'lowercase',
    letterSpacing: 1,
    opacity: 0.6,
  },
  threadText: {
    color: COLORS.text,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '400',
    letterSpacing: 0.3,
    textAlign: 'left',
  },
  threadSeparator: {
    width: 30,
    height: 1,
    backgroundColor: COLORS.borderSecondary,
    alignSelf: 'center',
    marginTop: SPACING.lg,
    opacity: 0.5,
  },
  footer: {
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  sussurrarBtn: {
    backgroundColor: '#222',
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: SPACING.md,
  },
  sussurrarText: {
    color: COLORS.textTertiary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'lowercase',
    letterSpacing: 1,
  },
  sussurrosCount: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: SPACING.md,
    textTransform: 'lowercase',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: SPACING.sm,
  },
});
