import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Executar testes sequencialmente para evitar conflitos no banco
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Configurações adicionais
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
