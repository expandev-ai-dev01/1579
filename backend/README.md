# TODO List - Backend API

Sistema de gerenciamento de tarefas - API REST

## Tecnologias

- Node.js
- TypeScript
- Express.js
- MS SQL Server
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/              # Controladores de API
├── routes/           # Definições de rotas
├── middleware/       # Middlewares Express
├── services/         # Lógica de negócio
├── utils/            # Funções utilitárias
├── instances/        # Instâncias de serviços
├── constants/        # Constantes da aplicação
├── config/           # Configurações
└── server.ts         # Ponto de entrada
```

## Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Configurar variáveis de ambiente no arquivo .env
```

## Desenvolvimento

```bash
# Modo desenvolvimento com hot reload
npm run dev
```

## Build e Produção

```bash
# Build do projeto
npm run build

# Executar em produção
npm start
```

## Estrutura de API

### Endpoints Públicos
- `GET /health` - Health check
- `POST /api/v1/external/...` - Endpoints públicos

### Endpoints Autenticados
- `GET/POST/PUT/DELETE /api/v1/internal/...` - Endpoints autenticados

## Configuração do Banco de Dados

O projeto utiliza MS SQL Server. Configure as credenciais no arquivo `.env`:

```
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=todolist
DB_ENCRYPT=true
```

## Padrões de Código

- TypeScript strict mode habilitado
- Path aliases configurados (@/)
- Validação com Zod
- Tratamento de erros centralizado
- Documentação TSDoc

## Próximos Passos

Esta é a estrutura base do backend. Para adicionar funcionalidades:

1. Criar schemas de banco de dados em `database/`
2. Implementar serviços em `src/services/`
3. Criar controladores em `src/api/v1/internal/`
4. Configurar rotas em `src/routes/v1/`
5. Adicionar testes colocados junto aos arquivos fonte

## Suporte

Para dúvidas ou problemas, consulte a documentação técnica no diretório `docs/`.