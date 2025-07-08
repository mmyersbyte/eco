FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos de dependências
COPY package*.json ./

# Instala todas as dependências (incluindo dev, necessário para build)
RUN npm install

# Copia o restante do código fonte
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# (Opcional) Torna o entrypoint executável, se for usar migrations automáticas
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 4000

# Se quiser rodar migrations/seeds automaticamente, mantenha o entrypoint:
ENTRYPOINT ["docker-entrypoint.sh"]

# Se NÃO quiser rodar migrations automáticas, comente a linha acima e descomente a de baixo:
# CMD ["npm", "start"]

# O comando padrão para iniciar a aplicação
CMD ["npm", "start"]