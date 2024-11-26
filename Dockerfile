# Use uma imagem Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todos os arquivos para dentro do contêiner
COPY . .

# Expõe a porta usada pela aplicação
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
