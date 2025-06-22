import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ThreadInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  isRequired?: boolean;
  onRemove?: () => void;
}

export default function ThreadInput({
  label,
  placeholder,
  value,
  onChangeText,
  isRequired = false,
  onRemove,
}: ThreadInputProps) {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputHeader}>
        <Text style={styles.inputLabel}>
          {label} {isRequired && '*'}
          <Text style={styles.charCount}> {value.length}/144</Text>
        </Text>
        {!isRequired && onRemove && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
            activeOpacity={0.7}
          >
            <Ionicons
              name='close'
              size={16}
              color='#666'
            />
          </TouchableOpacity>
        )}
      </View>
      <TextInput
        style={[styles.textInput, isRequired && styles.requiredInput]}
        placeholder={placeholder}
        placeholderTextColor='#555'
        value={value}
        onChangeText={onChangeText}
        maxLength={144}
        multiline
        numberOfLines={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    color: '#AAA',
    fontSize: 12,
    textTransform: 'lowercase',
    letterSpacing: 1,
  },
  charCount: {
    color: '#555',
    fontSize: 10,
  },
  removeButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 80,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  requiredInput: {
    borderColor: '#333',
  },
});
