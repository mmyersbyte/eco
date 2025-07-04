import { randomUUID } from 'crypto';
import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os ecos existentes
  await knex('eco_tags').del();
  await knex('eco').del();

  // Busca usuários e tags para associar aos ecos
  const users = await knex('register').select('id');
  const tags = await knex('tags').select('id', 'nome');

  // Histórias fictícias para os ecos
  const ecoStories = [
    {
      titulo: 'Noite de Insônia',
      conteudo:
        'Mais uma noite em claro, pensando em tudo que poderia ter sido diferente. Os pensamentos não param de girar e o sono não vem. Às vezes me pergunto se existe um botão para desligar a mente.',
      tags: ['Ansiedade', 'Insônia', 'Reflexão'],
    },
    {
      titulo: 'Primeira Vez no Terapia',
      conteudo:
        'Hoje foi minha primeira sessão de terapia. Estava nervoso, mas a psicóloga foi muito acolhedora. Falamos sobre meus medos e ansiedades. Sinto que foi um primeiro passo importante.',
      tags: ['Terapia', 'Ansiedade', 'Autoconhecimento'],
    },
    {
      titulo: 'Amor Não Correspondido',
      conteudo:
        'Declarei meus sentimentos hoje e não foi correspondido. Dói, mas ao mesmo tempo me sinto livre por ter tido coragem. Talvez seja melhor assim, pelo menos agora posso seguir em frente.',
      tags: ['Amor', 'Rejeição', 'Coragem'],
    },
    {
      titulo: 'Crise de Pânico no Trabalho',
      conteudo:
        'Tive uma crise de pânico durante uma reunião importante. Meu coração disparou, suei frio e senti que ia desmaiar. Consegui me recompor, mas estou preocupado que isso aconteça novamente.',
      tags: ['Pânico', 'Trabalho', 'Ansiedade'],
    },
    {
      titulo: 'Dia Bom Depois de Muito Tempo',
      conteudo:
        'Hoje acordei e pela primeira vez em semanas me senti bem. Fiz uma caminhada, comi algo gostoso e conversei com um amigo. Pequenos momentos, mas que fizeram toda a diferença.',
      tags: ['Felicidade', 'Autocuidado', 'Gratidão'],
    },
    {
      titulo: 'Perdendo um Ente Querido',
      conteudo:
        'Minha avó faleceu ontem. Ela era minha melhor amiga e confidente. Não sei como vou lidar com essa dor. A casa parece vazia sem ela, mas sei que ela gostaria que eu fosse forte.',
      tags: ['Luto', 'Família', 'Saudade'],
    },
    {
      titulo: 'Começando a Meditar',
      conteudo:
        'Comecei a praticar meditação há uma semana. No início era difícil focar, mas aos poucos estou conseguindo. Sinto que está me ajudando a lidar melhor com a ansiedade.',
      tags: ['Meditação', 'Autocuidado', 'Ansiedade'],
    },
    {
      titulo: 'Bullying na Escola',
      conteudo:
        'Os colegas da escola continuam me provocando. Hoje foi pior, me empurraram no corredor. Não sei mais o que fazer. Contei para meus pais, mas parece que nada muda.',
      tags: ['Bullying', 'Escola', 'Tristeza'],
    },
    {
      titulo: 'Descobrindo Minha Sexualidade',
      conteudo:
        'Estou me descobrindo e entendendo melhor minha sexualidade. É confuso às vezes, mas também libertador. Estou aprendendo a me aceitar como sou.',
      tags: ['Sexualidade', 'Autoconhecimento', 'Aceitação'],
    },
    {
      titulo: 'Vício em Redes Sociais',
      conteudo:
        'Percebi que passo horas demais nas redes sociais. Sempre comparando minha vida com a dos outros. Decidi fazer um detox digital por uma semana para ver como me sinto.',
      tags: ['Vício', 'Redes Sociais', 'Autoconhecimento'],
    },
    {
      titulo: 'Depressão Pós-Parto',
      conteudo:
        'Meu bebê nasceu há dois meses e eu deveria estar feliz, mas me sinto triste e vazia. Não consigo sentir o amor que todos dizem que deveria sentir. Estou com medo de ser uma mãe ruim.',
      tags: ['Depressão', 'Maternidade', 'Culpa'],
    },
    {
      titulo: 'Conquistando um Sonho',
      conteudo:
        'Depois de anos estudando, finalmente passei no vestibular para o curso que sempre quis. Estou emocionado e orgulhoso. Todos os sacrifícios valeram a pena.',
      tags: ['Conquista', 'Felicidade', 'Sonhos'],
    },
    {
      titulo: 'Término de Relacionamento',
      conteudo:
        'Terminei um relacionamento de 3 anos hoje. Ainda amo a pessoa, mas sabemos que não está funcionando. É doloroso, mas necessário. Agora preciso aprender a viver sozinho novamente.',
      tags: ['Término', 'Amor', 'Solidão'],
    },
    {
      titulo: 'Ansiedade Social',
      conteudo:
        'Fui convidado para uma festa, mas não consegui ir. A ansiedade social me paralisa. Fico imaginando todas as situações embaraçosas que poderiam acontecer.',
      tags: ['Ansiedade', 'Social', 'Isolamento'],
    },
    {
      titulo: 'Encontrando Esperança',
      conteudo:
        'Estava em um momento muito difícil, mas hoje encontrei um livro que mudou minha perspectiva. Às vezes a esperança vem dos lugares mais inesperados.',
      tags: ['Esperança', 'Livros', 'Mudança'],
    },
  ];

  // Cria os ecos
  const ecos = [];
  for (let i = 0; i < ecoStories.length; i++) {
    const story = ecoStories[i];
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const eco = {
      id: randomUUID(),
      thread_1: story.titulo,
      thread_2: story.conteudo.substring(0, 144),
      thread_3:
        story.conteudo.length > 144 ? story.conteudo.substring(144, 288) : null,
      user_id: randomUser.id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    ecos.push(eco);
  }

  // Insere os ecos
  await knex('eco').insert(ecos);

  // Cria as associações eco-tag
  const ecoTags = [];
  for (let i = 0; i < ecos.length; i++) {
    const eco = ecos[i];
    const story = ecoStories[i];

    // Associa as tags específicas da história
    for (const tagName of story.tags) {
      const tag = tags.find((t) => t.nome === tagName);
      if (tag) {
        ecoTags.push({
          eco_id: eco.id,
          tag_id: tag.id,
        });
      }
    }
  }

  // Insere as associações eco-tag
  await knex('eco_tags').insert(ecoTags);
}
