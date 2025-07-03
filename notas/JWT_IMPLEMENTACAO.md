# Implementação do JWT no Backend

Este documento explica, de forma didática e detalhada, como a autenticação baseada em JWT (JSON Web Token) foi implementada neste backend, para referência de agentes de IA e desenvolvedores.

---

## 1. **Fluxo Geral da Autenticação JWT**

- **Registro e Login:**

  - Ao registrar ou autenticar um usuário, o backend gera um token JWT assinado, contendo o `id` do usuário como subject (`sub`).
  - O token é retornado ao frontend, que deve usá-lo para autenticar requisições futuras.

- **Rotas protegidas:**
  - Rotas sensíveis (ex: criar eco, criar sussurro) exigem o envio do token JWT no header `Authorization`.
  - O backend valida o token antes de permitir a ação.

---

## 2. **Geração do Token JWT**

- Utiliza a biblioteca `jsonwebtoken`.
- O segredo e tempo de expiração estão centralizados em `config/auth.ts` e usam variáveis de ambiente.
- O token é gerado assim:

```ts
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.ts';

const token = jwt.sign(
  {}, // Payload vazio, pois só há um tipo de usuário
  authConfig.jwt.secret,
  {
    subject: user.id, // ID do usuário
    expiresIn: authConfig.jwt.expiresIn, // Ex: '1d'
  }
);
```

---

## 3. **Middlewares de Segurança**

- **ensureAuthenticated:**
  - Middleware que valida o JWT presente no header `Authorization`.
  - Decodifica o token, extrai o `user_id` e adiciona em `request.user`.
  - Se o token estiver ausente ou inválido, retorna erro 401.

```ts
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.ts';

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;
  if (!authHeader) throw new AppError('JWT token is missing');
  const [, token] = authHeader.split(' ');
  const { sub: user_id } = jwt.verify(token, authConfig.jwt.secret);
  request.user = { id: String(user_id) };
  return next();
}
```

---

## 4. **Controllers: Uso do JWT**

- **No registro e login:**
  - Após validar o usuário, gera e retorna o token JWT junto com os dados públicos do usuário.
- **Na criação de eco e sussurro:**
  - O campo `user_id` não é mais enviado pelo frontend.
  - O backend usa `request.user.id` (preenchido pelo middleware) para associar o conteúdo ao usuário autenticado.

---

## 5. **Proteção de Rotas**

- As rotas de criação de eco e sussurro usam o middleware `ensureAuthenticated`:

```ts
ecoRoutes.post('/', ensureAuthenticated, ecoController.create);
sussurroRoutes.post('/', ensureAuthenticated, sussurroController.create);
```

---

## 6. **Resumo de Segurança**

- Apenas usuários autenticados podem criar ecos e sussurros.
- O token JWT é obrigatório e validado em cada requisição protegida.
- O backend nunca retorna a senha do usuário.
- O código está modularizado, com middlewares e tipagem customizada para `request.user`.

---

## 7. **Exemplo de uso no frontend**

- O frontend deve enviar o token JWT no header:

```
Authorization: Bearer SEU_TOKEN_JWT
```

---

## 8. **Extensões Futuras**

- O backend está pronto para receber melhorias como refresh token, roles, logout global, etc.

---

**Dúvidas ou sugestões? Consulte este arquivo ou os comentários no código!**
