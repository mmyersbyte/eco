import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Header minimalista para telas filtradas por tag ou geral.
 * Mostra seta de voltar (opcional), ícone de tag e nome da seção/tag.
 *
 * Props:
 * - onBack: função chamada ao clicar na seta de voltar (opcional)
 * - nomeTag: nome da seção/tag (ex: 'geral', 'sobrenatural')
 * - iconColor: cor do ícone da tag (opcional, padrão cinza claro)
 * - iconSize: tamanho do ícone da tag (opcional, padrão 15)
 */
interface TagHeaderProps {
  onBack?: () => void;
  nomeTag: string;
  iconColor?: string;
  iconSize?: number;
}

export default function TagHeader({
  onBack,
  nomeTag,
  iconColor = '#AAA',
  iconSize = 15,
}: TagHeaderProps) {
  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
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
      )}
      <View style={styles.headerTitleRow}>
        <FontAwesome5
          name='tag'
          size={iconSize}
          color={iconColor}
          style={styles.tagIcon}
          accessibilityLabel='Tag filtrada'
        />
        <Text
          style={styles.nomeTag}
          numberOfLines={1}
        >
          {nomeTag.toLowerCase() + '.'}
        </Text>
      </View>
      <View style={styles.rightSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
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
  tagIcon: {
    marginRight: 4,
    marginTop: 1,
  },
  nomeTag: {
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
});
