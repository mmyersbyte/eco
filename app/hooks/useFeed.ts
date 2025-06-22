import { useState } from 'react';

export interface FeedItem {
  id: string;
  codinome: string;
  titulo: string;
  historia: string;
  sussurros: string[];
  avatar_url: string;
  genero: 'M' | 'F' | 'N';
  thread_1: string;
  thread_2?: string;
  thread_3?: string;
  tags: string[];
}

const FEED: FeedItem[] = [
  {
    id: '1',
    codinome: 'vaga-lume37',
    titulo: 'primeiro emprego',
    historia:
      'foi assustador e libertador. ninguém acreditava que eu ia conseguir, mas consegui. até hoje me lembro do frio na barriga.',
    sussurros: ['você não está só.', 'força!', 'também passei por isso.'],
    avatar_url:
      'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/mulher-eco.png',
    genero: 'F',
    thread_1:
      'foi assustador e libertador. ninguém acreditava que eu ia conseguir, mas consegui. até hoje me lembro do frio na barriga.',
    thread_2:
      'o mais difícil foi a primeira semana. tudo era novo, não conhecia ninguém e tinha medo de fazer algo errado.',
    thread_3:
      'hoje, anos depois, percebo que foi o primeiro passo para me tornar quem sou. aquele medo virou coragem.',
    tags: ['Histórias no Trabalho', 'Nunca contei para ninguém'],
  },
  {
    id: '2',
    codinome: 'coruja_noturna',
    titulo: 'nunca contei pra ninguém',
    historia:
      'aquela noite mudou tudo. guardei segredo por anos, mas aqui finalmente pude escrever.',
    sussurros: [],
    avatar_url:
      'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/homem-eco.png',
    genero: 'M',
    thread_1:
      'aquela noite mudou tudo. guardei segredo por anos, mas aqui finalmente pude escrever.',
    tags: ['Nunca contei para ninguém', 'Traumas'],
  },
  {
    id: '3',
    codinome: 'astral_anon',
    titulo: 'sobre viver em outro país',
    historia:
      'a solidão bate forte, mas cada dia longe é um novo começo. ninguém imagina o quanto mudei.',
    sussurros: [
      'me identifiquei muito.',
      'um abraço anônimo pra você.',
      'coragem!',
    ],
    avatar_url:
      'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/nao-binario-eco.png',
    genero: 'N',
    thread_1:
      'a solidão bate forte, mas cada dia longe é um novo começo. ninguém imagina o quanto mudei.',
    thread_2:
      'deixei tudo para trás: família, amigos, trabalho. foi a decisão mais difícil e necessária da minha vida.',
    tags: ['Vivendo em Outro País', 'Geral'],
  },
  {
    id: '4',
    codinome: 'sombra-lunar',
    titulo: 'ansiedade social',
    historia:
      'sempre fui tímida, mas na pandemia piorou muito. agora estou tentando sair de casa novamente.',
    sussurros: ['força!', 'também sofro com isso.'],
    avatar_url:
      'https://eco-avatars.s3.sa-east-1.amazonaws.com/eco-avatars/mulher-eco.png',
    genero: 'F',
    thread_1:
      'sempre fui tímida, mas na pandemia piorou muito. agora estou tentando sair de casa novamente.',
    thread_2:
      'ontem consegui ir ao mercado sozinha pela primeira vez em meses. parece pouco, mas pra mim foi uma vitória.',
    tags: ['Saúde Mental', 'Geral'],
  },
];

export function useFeed() {
  const [feed, setFeed] = useState<FeedItem[]>(FEED);

  function adicionarSussurro(id: string, sussurro: string) {
    setFeed((atual) =>
      atual.map((eco) =>
        eco.id === id && eco.sussurros.length < 10
          ? { ...eco, sussurros: [...eco.sussurros, sussurro] }
          : eco
      )
    );
  }

  return { feed, setFeed, adicionarSussurro };
}
