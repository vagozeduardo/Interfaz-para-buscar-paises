
# ETAPA 1: Construcción (Build)
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y generamos la carpeta 'dist'
COPY . .
RUN npm run build

# ETAPA 2: Servidor de producción (Nginx)
FROM nginx:stable-alpine

# Copiamos los archivos construidos desde la etapa anterior a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos una configuración básica de Nginx para manejar rutas de React
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]