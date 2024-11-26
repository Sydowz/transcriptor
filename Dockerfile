# Use uma imagem base Node.js
FROM node:18-alpine

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie os arquivos do repositório original
COPY . .

# Instale as dependências
RUN npm install

# Compile a aplicação para produção
RUN npm run build

# Exponha a porta que o app usa
EXPOSE 8000

# Inicie o servidor
CMD ["npm", "start"]
