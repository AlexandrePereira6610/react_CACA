# CACA - Centro Académico Clínico dos Açores

## Identificação do Grupo
- Alexandre Pereira - 2023108733
- Joana Rego - 2023103196
- Pedro Anselmo - 2023109163
- Tomás Moreira - 2023108679

---

## Tecnologias Utilizadas

### Frontend
- **React** - Biblioteca para UI
- **React Router DOM** - Navegação e rotas protegidas
- **Framer Motion** - Animações fluidas
- **Leaflet** - Mapas interativos
- **Chart.js** - Visualização de dados
- **IndexedDB** - Armazenamento local (eventos e newsletter)

### Backend
- **Node.js + Express** - API REST
- **MongoDB Atlas** - Base de dados na nuvem
- **JWT** - Autenticação segura
- **bcryptjs** - Encriptação de passwords

### APIs Externas
- Open-Meteo (previsão do tempo)
- RSS2JSON (notícias de saúde)
- Nominatim/OpenStreetMap (geocodificação)

---

## Arquitetura da Aplicação
Frontend (React) ←→ API (Express) ←→ MongoDB (Atlas)
↓ ↓
IndexedDB JWT Auth
(cache local) (validação)

---

## Funcionalidades Implementadas

### Refatorizadas (PEI1, PEI2, PEI3)
- Landing page com componentes React modulares
- Animações com Framer Motion (scroll reveals, hover effects)
- CRUD de eventos com IndexedDB
- Newsletter com IndexedDB
- Mapas interativos com Leaflet
- Consumo de APIs externas (meteorologia, notícias RSS)

### Novas (API de Utilizadores)
- Registo de novos utilizadores
- Login com JWT
- Gestão de perfil (editar nome, contacto, instituição)
- Sistema de permissões (Admin vs Utilizador regular)
- Rotas protegidas no frontend
- Admin pode ver/editar/remover todos os utilizadores

---

## Como Correr a Aplicação

### Pré-requisitos
- Node.js 
- MongoDB Atlas

### Backend
```bash
cd backend
npm install
npm run dev

O servidor irá correr em http://localhost:5000

Frontend
bash
npm install
npm start
A aplicação irá abrir em http://localhost:3000

Variáveis de Ambiente (backend/.env)
text
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/caca_db
JWT_SECRET=superSecretKeyCACA2026
JWT_EXPIRE=7d
Credenciais para Teste
Tipo	Email	Password
Utilizador Normal	marmita@teste.com	123456
Administrador	admin@caca.com	admin123
Nota: O administrador precisa ter o campo role: "admin" na base de dados.


Segurança Implementada
Passwords hasheadas com bcrypt
Tokens JWT com expiração
Validação de inputs (express-validator)
Rotas protegidas no frontend e backend
Acessibilidade e Responsividade
Navegação por teclado
Media queries para mobile (320px - 768px)
Layout flexível com grid/flexbox

