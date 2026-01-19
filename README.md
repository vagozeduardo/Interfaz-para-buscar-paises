
# 🌍 Buscador de Países - React + TypeScript

Este proyecto es una aplicación sencilla de practica que consume la API de [REST Countries](https://restcountries.com/) para visualizar información de los paises a consultar.

## 🚀 Tecnologías Utilizadas

- **Frontend:** React 18 + Vite
- **Lenguaje:** TypeScript (Tipado estricto)
- **Estado del Servidor:** TanStack Query (React Query) para cacheo y persistencia.
- **Estilos:** Bootstrap 5.3 + CSS Custom Properties (Variables).
- **Despliegue:** Docker + Nginx (Servidor de producción).

## 🛠️ Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker](https://www.docker.com/) (NECESARIO PARA EJECUTAR LA IMAGEN)

## 📦 Instalación y Uso Local

1. Clonar el repositorio desde DockerHub :
   ```bash
      docker pull eduardovazquezgo/buscador-paises:v1
2. Verificar que la imagen se descargó
   ```bash
      docker images
- deberia aparecer la imagen con el nombre que tiene la imagen `eduardovazquezgo/buscador-paises:v1` 
3. Ejecuatarlo:
   ```bash
      docker run -d -p 9096:80 --name contenedor-paises buscador-paises
 
> [!IMPORTANT]
> SI el puerto esta siendo usado puede realizar lo siguiente:
> en el `-p` se define el puerto, por ejemplo si el puerto 8080 esta ocupado puede cambiarlo
> a por ejemplo: `9090` o `9096`
>


