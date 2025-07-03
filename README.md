# Eco Backend

API Backend para o aplicativo Eco - Uma plataforma minimalista para compartilhamento de histórias pessoais com foco em sensibilidade, privacidade e intencionalidade.

## 🎯 Sobre o Projeto

O Eco é uma aplicação backend que oferece:

- **Autenticação JWT** com email/senha
- **Sistema de Codinomes Psicodélicos** - Geração automática de nomes únicos
- **Publicação de Ecos** - Histórias pessoais com até 3 threads
- **Sistema de Tags** - Categorização sensível por temas
- **Sussurros** - Comentários limitados (máximo 10 por eco)
- **Privacidade Radical** - Nenhum dado pessoal exposto publicamente

## 🚀 Tecnologias

- **Node.js** com TypeScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Knex.js** - Query builder e migrations
- **JWT** - Autenticação
- **Zod** - Validação de dados
- **Bcrypt** - Hash de senhas
- **Helmet** - Segurança
- **Rate Limiting** - Proteção contra abuso

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrations
npm run knex migrate:latest

# Executar seeds (opcional)
npm run knex seed:run

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🔧 Configuração

Crie um arquivo `.env` com as seguintes variáveis:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/eco
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
```

## 📚 Endpoints da API

### Autenticação

- `POST /register` - Registro de usuário
- `POST /login` - Login de usuário

### Ecos

- `GET /eco` - Listar ecos (com filtro por tag opcional)
- `POST /eco` - Criar novo eco (autenticado)
- `GET /eco/:id` - Visualizar eco específico
- `PUT /eco/:id` - Atualizar eco (autenticado)
- `DELETE /eco/:id` - Deletar eco (autenticado)

### Tags

- `GET /tags` - Listar todas as tags
- `POST /tags` - Criar nova tag (admin)

### Sussurros

- `GET /sussurro` - Listar sussurros
- `POST /sussurro` - Criar sussurro (autenticado)
- `PUT /sussurro/:id` - Atualizar sussurro (autenticado)
- `DELETE /sussurro/:id` - Deletar sussurro (autenticado)

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch
```

## 📁 Estrutura do Projeto

```
src/
├── @types/           # Definições de tipos TypeScript
├── config/           # Configurações (JWT, etc.)
├── controllers/      # Controladores da API
├── database/         # Configuração do banco e migrations
├── middlewares/      # Middlewares customizados
├── routes/           # Definição das rotas
└── utils/            # Utilitários e helpers

tests/                # Testes da aplicação
```

## 🔐 Segurança

- **Rate Limiting** - 100 requisições por IP a cada 15 minutos
- **Helmet** - Headers de segurança
- **JWT** - Autenticação stateless
- **Bcrypt** - Hash seguro de senhas
- **Validação Zod** - Validação rigorosa de dados

## 🌱 Filosofia do Projeto

O Eco prioriza:

- **Anonimato** - Codinomes gerados automaticamente
- **Privacidade** - Nenhum dado pessoal exposto
- **Sensibilidade** - Ambiente seguro para expressão
- **Intencionalidade** - Interações limitadas e significativas

## 📄 Licença

Este projeto está sob a licença MIT.
