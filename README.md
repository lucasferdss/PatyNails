<div align="center">
  <img src="public/pwa-512x512.png" alt="PatyNails Logo" width="180"/>

  # PatyNails

  **Aplicativo de Gestao para Studio de Unhas**

  Uma Progressive Web App moderna para gerenciar agenda, servicos e financeiro de um studio de beleza de forma simples, rapida e organizada.

  [patynails.vercel.app](https://patynails.vercel.app)
</div>

---

## Sobre o Projeto

PatyNails e uma aplicacao web desenvolvida para facilitar a rotina de studios de unhas e profissionais da beleza. A plataforma permite cadastrar servicos, criar agendamentos, acompanhar atendimentos do dia e controlar o faturamento semanal e mensal.

O projeto foi pensado para uso mobile-first, com interface simples, instalacao como PWA e dados salvos em nuvem com Firebase.

### Principais Funcionalidades

- Cadastro e login de usuarios
- Gerenciamento de servicos oferecidos
- Cadastro de agendamentos por cliente, data, horario e servico
- Visualizacao de agenda em calendario
- Marcacao de atendimentos como concluidos ou cancelados
- Resumo de agendamentos de hoje e amanha
- Controle financeiro semanal e mensal
- Historico de servicos por periodo
- Interface responsiva para celular e desktop
- Instalavel como aplicativo nativo (PWA)

---

## Tecnologias Utilizadas

### Frontend

- **React** - Biblioteca JavaScript para construcao de interfaces
- **TypeScript** - Superset JavaScript com tipagem estatica
- **Vite** - Build tool moderna e rapida
- **Tailwind CSS** - Framework CSS utilitario
- **shadcn/ui** - Base de componentes reutilizaveis
- **React Router** - Gerenciamento de rotas
- **Radix UI** - Primitivos acessiveis para componentes
- **Lucide React** - Biblioteca de icones
- **date-fns** - Manipulacao e formatacao de datas
- **Zod** - Validacao de formularios e dados

### Backend

- **Firebase** - Backend as a Service
  - Authentication para autenticacao de usuarios
  - Cloud Firestore para banco de dados
  - Regras de seguranca para protecao dos dados

### Infraestrutura

- **Vite PWA** - Manifest, service worker e cache offline
- **Service Workers** - Cache e melhor experiencia em dispositivos moveis
- **Vercel** - Plataforma de deploy e hospedagem

---

## Estrutura do Projeto

```txt
patynails/
|-- public/              # Arquivos estaticos e icones PWA
|-- src/
|   |-- components/      # Componentes React da aplicacao
|   |-- components/ui/   # Componentes base de interface
|   |-- contexts/        # Providers de autenticacao e dados
|   |-- hooks/           # Hooks reutilizaveis
|   |-- integrations/    # Integracao com Firebase
|   |-- lib/             # Funcoes utilitarias
|   |-- pages/           # Paginas principais
|   `-- types/           # Tipos TypeScript
|-- .env.example         # Exemplo de variaveis de ambiente
|-- vercel.json          # Configuracao de rotas para deploy
`-- package.json
```

---

## Configuracao Local

Clone o repositorio e instale as dependencias:

```bash
npm install
```

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Preencha as variaveis com os dados do seu projeto Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Execute o projeto em desenvolvimento:

```bash
npm run dev
```

Gere a versao de producao:

```bash
npm run build
```

---

## Caracteristicas Tecnicas

- **Mobile-first**: interface pensada para uso diario no celular
- **PWA**: pode ser instalado como aplicativo e possui service worker
- **Autenticacao**: usuarios autenticados com Firebase Auth
- **Banco em nuvem**: dados salvos no Cloud Firestore
- **Rotas protegidas**: acesso ao app apenas para usuarios logados
- **Design Responsivo**: adaptado para mobile e desktop
- **Componentes Acessiveis**: baseados em Radix UI e shadcn/ui
- **Deploy SPA**: configurado para funcionar corretamente na Vercel

---

## Scripts Disponiveis

```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build     # Gera o build de producao
npm run preview   # Visualiza o build localmente
npm run lint      # Executa a verificacao de lint
```
