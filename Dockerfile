## Usei a imagem oficial do Node.js e a que usei no projeto.
FROM node:18-alpine
 
## Diretório de trabalho
WORKDIR /app

# Install
RUN apk add --no-cache postgresql-client

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Copiar script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expor porta
EXPOSE 4000

# Usar script de inicialização
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]