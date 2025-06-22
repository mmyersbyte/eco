import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Salva um valor no AsyncStorage.
 * @param key Chave de armazenamento
 * @param value Valor a ser salvo (qualquer tipo serializável)
 */
export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/**
 * Recupera um valor do AsyncStorage.
 * @param key Chave de armazenamento
 * @returns Valor desserializado ou null
 */
export async function getItem<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

/**
 * Remove um item do AsyncStorage.
 * @param key Chave de armazenamento
 */
export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
