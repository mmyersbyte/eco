#!/bin/sh
set -e

# Aguardar PostgreSQL estar pronto
echo "Aguardando PostgreSQL..."
while ! pg_isready -h postgres -p 5432 -U postgres; do
  echo "PostgreSQL não está pronto ainda..."
  sleep 2
done

echo "PostgreSQL está pronto!"

# Rodar migrations
echo "Executando migrations..."
npm run knex migrate:latest

# Rodar seeds (histórico fake)
echo "Executando seeds com historias falsas"
npm run knex seed:run || echo "Nenhum seed encontrado"

# Iniciar aplicação
echo "Iniciando aplicação..."
exec "$@"