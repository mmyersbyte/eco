import { useState } from 'react';

export interface FeedItem {
  id: string;
  codinome: string;
  titulo: string;
  historia: string;
  sussurros: string[];
}

const FEED: FeedItem[] = [
  {
    id: '1',
    codinome: 'vaga-lume37',
    titulo: 'primeiro emprego',
    historia:
      'foi assustador e libertador. ninguém acreditava que eu ia conseguir, mas consegui. até hoje me lembro do frio na barriga.',
    sussurros: ['você não está só.', 'força!', 'também passei por isso.'],
  },
  {
    id: '2',
    codinome: 'coruja_noturna',
    titulo: 'nunca contei pra ninguém',
    historia:
      'aquela noite mudou tudo. guardei segredo por anos, mas aqui finalmente pude escrever.',
    sussurros: [],
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
