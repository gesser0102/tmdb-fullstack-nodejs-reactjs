# TMDB Fullstack Application 

> Aplicação Fullstack que permite fazer requisições na API do TMDB, retornando as medias. 
> Adicione e Remova filmes da sua lista de favoritos 

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Node.JS
- React
- MongoDB

## 🚀 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/gesser0102/tmdb-fullstack-nodejs-reactjs
```
2. Navegue até a pasta do projeto:

```bash
cd tmdb-fullstack-nodejs-reactjs
```
3. Instale as dependências:

```bash
npm install
```

## ☕ Configurando as Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo .env:

```
MONGODB_URI=
PORT=
TOKEN_SECRET=<JWT>
BASE_URL=https://api.themoviedb.org/3
TMDB_KEY=
```

## 🌍 Configuração dos clients

Certifique-se de alterar a URL dos arquivos privateClient.jsx e publicClient.jsx

```
const baseURL = "URL_DO_SERVIDOR_DA_SUA_API";
```

## 💻 Gerando seu Token do JWT (JsonWebTOken)

```
1 - Abra seu terminal ou prompt de comando.

2 - Execute o seguinte script Node.js para gerar uma string aleatória:

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```


