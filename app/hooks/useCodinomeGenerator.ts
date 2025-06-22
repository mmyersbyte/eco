import { useCallback, useEffect, useRef, useState } from 'react';
import {
  conectores,
  elementos,
  getElementosPorGenero,
  getRandomElement,
  prefixos,
  sufixos,
  variacoes,
} from '../utils/codinomeLibrary';

// Interface para o estado do hook
interface CodinomeGeneratorState {
  codinomeAtual: string;
  isGenerating: boolean;
  error: string | null;
  tentativasRestantes: number;
}

// Interface para o retorno do hook
interface UseCodinomeGenerator {
  codinomeAtual: string;
  isGenerating: boolean;
  error: string | null;
  tentativasRestantes: number;
  gerarNovoCodinome: (genero?: 'M' | 'F' | 'N') => void;
  limparError: () => void;
  resetCodinome: () => void;
}

// Cache local para codinomes já gerados (evita repetições na sessão)
const codinomesUsados = new Set<string>();

// Algoritmos de geração - APENAS DOIS COMPONENTES
const algoritmos = {
  // Método 1: Prefixo + Sufixo
  prefixoSufixo: (genero?: 'M' | 'F' | 'N') => {
    const prefixo = getRandomElement(prefixos);
    const sufixo = getRandomElement(sufixos);
    return `${prefixo}${sufixo}`;
  },

  // Método 2: Elemento + Sufixo
  elementoSufixo: (genero?: 'M' | 'F' | 'N') => {
    const elementosDisponiveis = genero
      ? getElementosPorGenero(genero)
      : elementos;
    const elemento = getRandomElement(elementosDisponiveis);
    const sufixo = getRandomElement(sufixos);
    return `${elemento}${sufixo}`;
  },

  // Método 3: Prefixo + Elemento
  prefixoElemento: (genero?: 'M' | 'F' | 'N') => {
    const prefixo = getRandomElement(prefixos);
    const elementosDisponiveis = genero
      ? getElementosPorGenero(genero)
      : elementos;
    const elemento = getRandomElement(elementosDisponiveis);
    return `${prefixo}${elemento}`;
  },

  // Método 4: Com variação numérica/textual
  comVariacao: (genero?: 'M' | 'F' | 'N') => {
    // Escolhe aleatoriamente um dos métodos base
    const metodos = [
      algoritmos.prefixoSufixo,
      algoritmos.elementoSufixo,
      algoritmos.prefixoElemento,
    ];
    const metodoEscolhido = getRandomElement(metodos);
    const base = metodoEscolhido(genero);
    const variacao = getRandomElement(variacoes);
    const conector = getRandomElement(conectores);
    return variacao ? `${base}${conector}${variacao}` : base;
  },
};

export const useCodinomeGenerator = (): UseCodinomeGenerator => {
  const [state, setState] = useState<CodinomeGeneratorState>({
    codinomeAtual: '',
    isGenerating: false,
    error: null,
    tentativasRestantes: 100, // Limite de tentativas para evitar loops infinitos
  });

  const algoritmoAtual = useRef(0); // Índice do algoritmo atual
  const metodosGeracao = [
    algoritmos.prefixoSufixo,
    algoritmos.elementoSufixo,
    algoritmos.prefixoElemento,
    algoritmos.comVariacao,
  ];

  // Função para gerar um codinome único
  const gerarCodinomeUnico = useCallback(
    (genero?: 'M' | 'F' | 'N', tentativas = 0): string | null => {
      if (tentativas >= 50) {
        // Se esgotar tentativas com o algoritmo atual, muda para o próximo
        algoritmoAtual.current =
          (algoritmoAtual.current + 1) % metodosGeracao.length;
        if (algoritmoAtual.current === 0) {
          // Se voltou ao primeiro algoritmo, limpa o cache (permite reutilização)
          codinomesUsados.clear();
        }
        return null;
      }

      const metodo = metodosGeracao[algoritmoAtual.current];
      const novoCodinome = metodo(genero);

      // Verifica se já foi usado na sessão
      if (codinomesUsados.has(novoCodinome)) {
        return gerarCodinomeUnico(genero, tentativas + 1);
      }

      return novoCodinome;
    },
    []
  );

  // Função principal para gerar novo codinome
  const gerarNovoCodinome = useCallback(
    (genero?: 'M' | 'F' | 'N') => {
      setState((prev) => ({ ...prev, isGenerating: true, error: null }));

      // Simula um pequeno delay para dar feedback visual
      setTimeout(() => {
        try {
          const novoCodinome = gerarCodinomeUnico(genero);

          if (!novoCodinome) {
            setState((prev) => ({
              ...prev,
              isGenerating: false,
              error:
                'Não foi possível gerar um codinome único. Tente novamente.',
              tentativasRestantes: prev.tentativasRestantes - 1,
            }));
            return;
          }

          // Adiciona ao cache de usados
          codinomesUsados.add(novoCodinome);

          setState((prev) => ({
            ...prev,
            codinomeAtual: novoCodinome,
            isGenerating: false,
            error: null,
            tentativasRestantes: 100, // Reset tentativas
          }));
        } catch (error) {
          setState((prev) => ({
            ...prev,
            isGenerating: false,
            error: 'Erro interno ao gerar codinome.',
            tentativasRestantes: prev.tentativasRestantes - 1,
          }));
        }
      }, 200);
    },
    [gerarCodinomeUnico]
  );

  // Função para limpar erro
  const limparError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Função para resetar codinome
  const resetCodinome = useCallback(() => {
    setState((prev) => ({
      ...prev,
      codinomeAtual: '',
      error: null,
      tentativasRestantes: 100,
    }));
  }, []);

  // Gera um codinome inicial ao montar o hook
  useEffect(() => {
    if (!state.codinomeAtual) {
      gerarNovoCodinome();
    }
  }, []);

  return {
    codinomeAtual: state.codinomeAtual,
    isGenerating: state.isGenerating,
    error: state.error,
    tentativasRestantes: state.tentativasRestantes,
    gerarNovoCodinome,
    limparError,
    resetCodinome,
  };
};
