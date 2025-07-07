#!/bin/sh
set -e

# Não espera por um container postgres local (Neon é externo)

# Rodar migrations
echo "Executando migrations..."
npm run knex migrate:latest

# Rodar seeds (opcional)
echo "Executando seeds..."
npm run knex seed:run || echo "Nenhum seed encontrado"

# Iniciar aplicação
echo "Iniciando aplicação..."
exec "$@"