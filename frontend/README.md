# TODO List App

Sistema de gerenciamento de tarefas

## Features

- Criação de Tarefas
- Categorização de Tarefas
- Definição de Prioridades
- Estabelecimento de Prazos
- Marcação de Conclusão
- Busca de Tarefas
- Notificações e Lembretes
- Compartilhamento de Tarefas
- Visualização em Calendário
- Sincronização Multiplataforma

## Tech Stack

- React 19.2.0
- TypeScript 5.6.3
- Vite 5.4.11
- TailwindCSS 3.4.14
- React Router 7.9.3
- TanStack Query 5.90.2
- Zustand 5.0.8
- React Hook Form 7.63.0
- Zod 4.1.11

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Start development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── app/                    # Application configuration
│   ├── App.tsx            # Root component
│   └── router.tsx         # Routing configuration
├── pages/                 # Page components
│   ├── layouts/          # Layout components
│   ├── Home/             # Home page
│   └── NotFound/         # 404 page
├── domain/               # Business domains
├── core/                 # Shared components and utilities
│   ├── components/       # Generic UI components
│   ├── lib/             # Library configurations
│   ├── utils/           # Utility functions
│   ├── types/           # Global types
│   └── constants/       # Global constants
└── assets/              # Static assets
    └── styles/          # Global styles
```

## API Configuration

The application uses two API clients:

- `publicClient`: For public endpoints (`/api/v1/external`)
- `authenticatedClient`: For authenticated endpoints (`/api/v1/internal`)

Configure the API URL in `.env`:

```
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## Development Guidelines

- Follow the established folder structure
- Use TypeScript for all files
- Follow naming conventions (PascalCase for components, camelCase for utilities)
- Use TailwindCSS for styling
- Implement proper error handling
- Write JSDoc comments for public APIs

## License

Private project