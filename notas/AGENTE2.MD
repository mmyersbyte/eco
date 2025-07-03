AGENTE.MD
Projeto: Eco
Descrição geral
Eco é um app mobile minimalista e anônimo para relatos sensíveis, focando em escuta, empatia e privacidade.
Cada publicação é um eco (relato anônimo, em threads curtas), que pode receber até 10 comentários chamados sussurros.

Fluxo e regras do app
Usuários não têm perfil público: codinome e avatar gerados automaticamente.

Cadastro via e-mail e senha (sem nome real, sem foto do usuário).

Ecos (posts):

São criados apenas por usuários autenticados.

Formato: até 3 threads curtas (máx. 144 caracteres cada), no estilo “mini-relato”, inspirados em threads do Twitter.

Podem conter array de tags sensíveis (ex: “Conquistas”, “Luto”, “Ansiedade”...).

Sussurros (comentários):

Até 10 por eco.

São curtos (máx. 144 caracteres) e só por usuários autenticados.

Privacidade radical:

Não existe busca por usuário, seguidores ou curtidas.

Nenhum dado pessoal é exposto.

Não há timeline pessoal.

Moderação mínima:

Limite de comentários, palavras bloqueadas, relatos expiram a cada 7 dias.

Principais endpoints do backend
Auth
POST /register — Cadastro de usuário
Body: { email, senha, genero, codinome, avatar_url }
Retorno: mensagem de sucesso

POST /login — Login
Body: { email, senha }
Retorno: dados mínimos do usuário (sem senha)

Ecos
POST /eco — Cria novo eco
Body:

json
Copiar
Editar
{
"user_id": "...",
"thread_1": "...", // obrigatória
"thread_2": "...", // opcional
"thread_3": "...", // opcional
"tags": ["...", "..."] // opcional
}
GET /eco — Lista todos os ecos
Retorno: array de ecos (cada um com threads, user_id, tags, created_at...)

GET /eco/:id — Detalha um eco (com suas threads e comentários/sussurros)
Retorno:

json
Copiar
Editar
{
"id": "...",
"user_id": "...",
"thread_1": "...",
"thread_2": "...",
"thread_3": "...",
"tags": ["...", "..."],
"created_at": "...",
"sussurros": [
{ "id": "...", "eco_id": "...", "conteudo": "...", ... }
// até 10 comentários
]
}
PATCH /eco/:id — Edita threads (opcional, para MVP)

DELETE /eco/:id — Deleta eco

Sussurros (comentários)
POST /sussurro — Adiciona comentário ao eco
Body: { eco_id, conteudo }

GET /sussurro?eco_id=... — Lista comentários de um eco específico

PATCH /sussurro/:id — Edita comentário

DELETE /sussurro/:id — Remove comentário

Regras para integração
Sempre autenticar o usuário antes de permitir publicar eco ou sussurrar.

O front pode filtrar tags localmente (tags vêm como array em cada eco).

Os ecos vêm em formato de threads: sempre 1 a 3 campos (thread_1 obrigatória, thread_2 e thread_3 opcionais).

O front não deve mostrar informações pessoais do usuário (nem e-mail, nem ID).

Para comentários: ao atingir 10 sussurros em um eco, o front deve bloquear o envio de novos comentários para aquele post.

Ecos são excluídos automaticamente após 7 dias (o front pode indicar data de expiração, mas não precisa fazer limpeza).

Stack e integração
Frontend: React Native + TypeScript (Axios para chamadas HTTP)

Backend: Express.js/Node + Knex/PostgreSQL (deployável em Render/Railway, banco Neon)

Todos os endpoints retornam mensagens amigáveis e dados no padrão JSON.

Todas as respostas e validações priorizam UX, privacidade e clareza.

Palavras-chave & diferenciais
anonimato · escuta · relatos · sussurros · privacidade · conforto · limite de interações · tags sensíveis · threads curtas · moderação mínima

Importante para integração
Todos os endpoints estão prontos e testados.

As validações (como limite de threads, tamanho, máximo de 10 sussurros, etc) já são feitas no backend, mas o front pode reforçar para UX.

Para sugestões de código, loading, erro, estado vazio, loading state e UX: sempre priorizar clareza, empatia e privacidade!

O MVP já cobre todo o fluxo central, e está pronto para integração imediata.
