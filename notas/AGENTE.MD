# BACKEND - PROJETO ECO

## Documentação para Agentes de IA

### ESTADO ATUAL DO BACKEND

O backend do projeto Eco está em estágio inicial, mas já possui uma estrutura sólida e bem organizada. Aqui está o que foi implementado:

## STACK TECNOLÓGICA ATUAL

- **Runtime:** Node.js com TypeScript
- **Framework:** Express.js v4.19.2
- **Banco de Dados:** PostgreSQL
- **Query Builder:** Knex.js v3.1.0
- **Validação:** Zod v3.23.8
- **Desenvolvimento:** tsx (TypeScript executor)

## ESTRUTURA DE ARQUIVOS

```
backend/
├── server.ts                    # Servidor principal (porta 3333)
├── knexfile.ts                  # Configuração do Knex
├── tsconfig.json               # Configuração TypeScript
├── package.json                # Dependências e scripts
└── src/
    ├── controllers/            # Controllers (vazio)
    ├── routes/                 # Rotas (vazio)
    ├── middlewares/
    │   └── errorHandling.ts    # Middleware de tratamento de erros
    ├── utils/
    │   └── AppError.ts         # Classe de erro personalizada
    └── database/
        ├── knex.ts             # Instância do Knex
        └── migrations/
            └── 20250621210820_create-register.ts # Migration da tabela de usuários
```

## CONFIGURAÇÕES IMPORTANTES

### 1. TypeScript (tsconfig.json)

- **Target:** ES2022
- **Module:** node16 (ESM)
- **Flags importantes:**
  - `allowImportingTsExtensions: true` (permite importar .ts)
  - `esModuleInterop: true` (compatibilidade com CommonJS)
  - `noEmit: true` (não gera arquivos JS)
- **Inclui:** src/\*_/_ e server.ts

### 2. Package.json

- **Type:** "module" (ESM habilitado)
- **Scripts:**
  - `dev`: tsx watch src/server.ts (desenvolvimento)
  - `knex`: node --import tsx ./node_modules/.bin/knex (comandos Knex)

### 3. Configuração do Banco (knexfile.ts)

```typescript
{
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'admin123',
      database: 'ecodatabase'
    },
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './src/database/seeds',
      extension: 'ts'
    }
  }
}
```

## ESTRUTURA DO BANCO DE DADOS

### Tabela: register (usuários)

```sql
CREATE TABLE register (
  id UUID PRIMARY KEY,           -- UUID gerado pelo backend
  email VARCHAR UNIQUE NOT NULL,
  senha VARCHAR NOT NULL,
  codinome VARCHAR UNIQUE NOT NULL, -- Gerado automaticamente
  genero VARCHAR NOT NULL,       -- M/F/N
  avatar_url VARCHAR NOT NULL,   -- URL do avatar gerado
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## MIDDLEWARE E TRATAMENTO DE ERROS

### AppError (src/utils/AppError.ts)

Classe personalizada para erros da aplicação:

```typescript
class AppError {
  message: string;
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
```

### Error Handling Middleware

Trata três tipos de erro:

1. **AppError:** Erros personalizados da aplicação
2. **ZodError:** Erros de validação do Zod
3. **Erros gerais:** Retorna status 500

## COMANDOS KNEX IMPORTANTES

```bash
# Executar migrations
npm run knex migrate:latest

# Reverter migrations
npm run knex migrate:rollback

# Criar nova migration
npm run knex migrate:make nome_da_migration

# Criar seed
npm run knex seed:make nome_do_seed
```

## PRÓXIMOS PASSOS SUGERIDOS

1. **Implementar Controllers e Routes:**

   - AuthController (registro/login)
   - EcoController (CRUD de ecos)
   - SussurroController (CRUD de sussurros)

2. **Criar Migrations Faltantes:**

   - Tabela `ecos` (id, user_id, titulo, historia, tags, created_at)
   - Tabela `sussurros` (id, eco_id, conteudo, created_at)
   - Tabela `tags` (id, nome)

3. **Implementar Autenticação:**

   - JWT tokens
   - Middleware de autenticação
   - Hash de senhas (bcrypt)

4. **Validação com Zod:**
   - Schemas de validação para todas as rotas
   - Middleware de validação

## REGRAS DE NEGÓCIO IMPORTANTES

- **Anonimato:** Codinomes são gerados automaticamente
- **Limite:** Máximo 10 sussurros por eco
- **Autenticação:** Apenas usuários autenticados podem criar ecos/sussurros
- **Privacidade:** Nenhum dado pessoal é exposto publicamente

## NOTAS TÉCNICAS

- O servidor roda na porta 3333
- Todas as importações usam extensão .ts
- O projeto usa ESM (import/export)
- Banco local PostgreSQL configurado
- Middleware de erro já implementado e funcional

## COMANDOS PARA DESENVOLVIMENTO

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Executar migrations
npm run knex migrate:latest

# Verificar status das migrations
npm run knex migrate:status
```

Este backend está pronto para receber a implementação das rotas e controllers principais do projeto Eco.

---

📂 Rotas e Controllers – Projeto Eco
Estrutura implementada:

RegisterController:
Controller responsável pelo cadastro (POST /register) e listagem de usuários (GET /register).

Validação dos dados com Zod.

Hash seguro da senha com bcryptjs.

Tratamento de erros personalizados usando AppError.

Busca e cadastro no banco via Knex com tipagem TypeScript.

registerRoutes:
Arquivo de rotas dedicado ao usuário.

Define as rotas /register usando o Router do Express.

Garante o contexto do this do controller usando arrow functions ou .bind.

index.ts (routes):
Arquivo principal de rotas.

Junta todas as rotas do projeto e exporta como um único router.

Usa routes.use('/register', registerRoutes) para montar as rotas de cadastro.

Padrões e boas práticas adotadas:

Tipagem explícita dos dados do usuário (Register) usando o generic <Register> do Knex para maior segurança.

Nunca retorna a senha nos endpoints de listagem.

Imports organizados com alias @ (via tsconfig).
