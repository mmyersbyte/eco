#!/bin/sh
set -e

# Não espera por um container postgres local (Neon é externo)

# Rodar migrations
echo "Executando migrations..."
npm run knex migrate:latest

# Iniciar aplicação
echo "Iniciando aplicação..."
exec "$@"