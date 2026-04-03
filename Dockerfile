FROM node:20-bookworm

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar todo el código
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Usar el servidor standalone de Next.js
CMD ["node", ".next/standalone/server.js"]
