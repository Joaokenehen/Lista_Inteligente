FROM node:20-alpine

WORKDIR /usr/src/app

# Copia os arquivos de dependência primeiro para aproveitar o cache do Docker
COPY package*.json ./

RUN npm install

# Copia todo o restante do código (respeitando o .dockerignore)
COPY . .

# Porta interna onde o Express vai rodar no container
EXPOSE 3001

# Comando para iniciar o servidor em modo de desenvolvimento
CMD ["npm", "run", "dev"]