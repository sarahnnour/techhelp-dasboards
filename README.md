# TechHelp Dashboard

Um dashboard moderno e interativo para gerenciamento de suporte técnico, construído com React, TypeScript e Vite.

## 🚀 Tecnologias

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Express, tRPC
- **UI:** Tailwind CSS, Radix UI
- **Database:** Drizzle ORM, MySQL
- **Charts:** Recharts
- **Animations:** Framer Motion

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou pnpm
- MySQL (opcional, para funcionalidade de banco de dados)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio-url>
cd techhelp-dashboard
```

2. Instale as dependências:
```bash
npm install --legacy-peer-deps
```

ou se estiver usando pnpm:
```bash
pnpm install
```

## 🎮 Como Usar

### Modo Desenvolvimento

Para iniciar o servidor de desenvolvimento:

**Windows (PowerShell):**
```powershell
$env:NODE_ENV="development"; npx tsx watch server/_core/index.ts
```

**Linux/Mac:**
```bash
npm run dev
```

O aplicativo estará disponível em: **http://localhost:3000**

### Build para Produção

```bash
npm run build
```

### Iniciar em Produção

```bash
npm start
```

## 📁 Estrutura do Projeto

```
techhelp-dashboard/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilitários
│   └── public/          # Arquivos estáticos
├── server/              # Backend Express/tRPC
│   ├── _core/          # Lógica do servidor
│   └── routers.ts      # Rotas tRPC
├── shared/             # Código compartilhado
├── drizzle/            # Schema e migrações do banco
└── patches/            # Patches de dependências
```

## ⚙️ Configuração

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` na raiz do projeto:

```env
# OAuth (opcional)
OAUTH_SERVER_URL=your_oauth_server_url

# Vite (opcional)
VITE_APP_TITLE=TechHelp Dashboard
VITE_APP_LOGO=/logo.png
VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# Database (opcional)
DATABASE_URL=mysql://user:password@localhost:3306/database
```

## 🎨 Funcionalidades

- ✅ Dashboard interativo com métricas em tempo real
- ✅ Visualização de dados com gráficos
- ✅ Interface responsiva e moderna
- ✅ Tema claro/escuro
- ✅ Componentes UI reutilizáveis
- ✅ Integração com backend tRPC

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📝 Licença

Este projeto está sob a licença MIT.

## 👥 Autor

Desenvolvido com ❤️ para gerenciamento eficiente de suporte técnico.
