# Gabriel Santana - Portfólio Full-Stack

> **Desenvolvedor Backend | Java | Spring Boot | SQL**  
> 📍 Itariri, São Paulo, Brasil  
> 🔗 [GitHub](https://github.com/alemaoxp) | 📱 WhatsApp: (13) 99714-9654

---

## 👨‍💻 Sobre Mim

Sou um desenvolvedor Backend apaixonado por criar soluções robustas, escaláveis e bem arquitetadas. Este portfólio é uma demonstração prática dos meus conhecimentos em desenvolvimento full-stack, combinando um backend Java sólido com uma interface moderna e responsiva.

---

## 🛠️ Stack Tecnológica

### Backend
- **Java 17** - Linguagem principal
- **Spring Boot 3.2.5** - Framework para aplicações web
- **Spring Data JPA** - ORM e persistência de dados
- **Spring Boot Actuator** - Monitoramento e health checks
- **PostgreSQL** - Banco de dados relacional
- **AWS SQS SDK** - Integração com filas (planejado)
- **Maven** - Gerenciamento de dependências e build

### Frontend
- **JavaScript ES6+** - Módulos ES, async/await
- **HTML5 Semântico** - Estrutura moderna e acessível
- **CSS3 Avançado** - Glassmorphism, CSS Variables, Grid/Flexbox
- **Chart.js** - Visualização de dados e analytics
- **Font Awesome 6** - Iconografia profissional
- **Google Fonts** - Tipografia (Inter + Fira Code)

### Database & Infraestrutura
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, Realtime)
- **Railway** - Plataforma de deploy e hosting
- **Git & GitHub** - Controle de versão e CI/CD

---

## 📊 Competências Técnicas

| Competência | Nível | Experiência |
|-------------|-------|-------------|
| **Java** | ⭐⭐⭐⭐⭐ 75% | Desenvolvimento backend, APIs, OOP |
| **Spring Boot** | ⭐⭐⭐⭐⭐ 70% | REST APIs, JPA, Actuator |
| **SQL** | ⭐⭐⭐⭐ 65% | PostgreSQL, queries complexas, modelagem |
| **Git** | ⭐⭐⭐⭐ 60% | Versionamento, branching, colaboração |
| **Docker** | ⭐⭐⭐ 50% | Containerização básica |
| **HTML & CSS** | ⭐⭐⭐⭐⭐ 80% | Responsivo, glassmorphism, animações |

---

## ✨ Funcionalidades do Portfólio

### 🌐 Site Público
- **Hero Section** - Apresentação animada com code window visual
- **Projetos** - Cards dinâmicos carregados do Supabase com filtros por tecnologia
- **Skills** - Barras de progresso animadas demonstrando competências
- **Formulário de Contato** - Validação frontend, sanitização de dados e integração com Supabase
- **Design Responsivo** - Layout adaptável para desktop, tablet e mobile
- **Tema Dark Moderno** - Glassmorphism, gradientes e efeitos de glow

### 🔐 Painel Admin
- **Autenticação Segura** - Login via Supabase Auth com persistência de sessão
- **Dashboard Analytics** - Estatísticas de visitas com gráficos Chart.js
- **Gestão de Projetos** - CRUD completo para adicionar/editar projetos
- **Gestão de Contatos** - Visualização e atualização de status de mensagens
- **Detecção Automática de Tecnologias** - Algoritmo que identifica 18+ tecnologias em projetos

### 📈 Analytics
- **Tracking de Visitas** - Contagem de page views com session tracking
- **Detecção de Dispositivos** - Mobile, tablet, desktop
- **Análise de Navegadores** - Chrome, Firefox, Safari, Edge
- **Detecção de Sistemas Operacionais** - Windows, macOS, Linux, Android, iOS
- **Métricas em Tempo Real** - Visitas totais, sessões únicas, páginas populares

---

## 🏗️ Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────┐
│                 FRONTEND (Browser)                  │
│  HTML + CSS + JavaScript (ES Modules)               │
│  ├── index.html (Portfolio público)                 │
│  ├── projetos.html (Listagem com filtros)           │
│  ├── login.html (Autenticação admin)                │
│  └── admin.html (Dashboard gerencial)               │
└──────────────────────┬──────────────────────────────┘
                       │
              Supabase JS SDK
                       │
┌──────────────────────▼──────────────────────────────┐
│              SUPABASE (Backend-as-a-Service)        │
│  ├── PostgreSQL (Projects, Contacts, Visits)        │
│  ├── Authentication (Admin login)                   │
│  └── Row Level Security (Políticas de acesso)       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│        SPRING BOOT (Railway - Static Server)        │
│  ├── Serve arquivos estáticos                       │
│  ├── Health checks (/actuator/health)               │
│  └── Configurado para futuras APIs REST             │
└─────────────────────────────────────────────────────┘
```

### Padrões de Design
- **Repository Pattern** - Abstração de acesso a dados
- **Module Pattern** - Organização de código JavaScript em módulos
- **Service Layer** - Preparado para expansão futura do backend
- **Singleton Pattern** - Instâncias únicas para managers e repositórios

---

## 📁 Estrutura do Projeto

```
projeto-backend/
├── src/main/java/com/projeto/
│   ├── ProjetoBackendApplication.java    # Entry point Spring Boot
│   └── config/
│       └── DatabaseConfig.java           # Configuração PostgreSQL/Railway
│
├── src/main/resources/
│   ├── application.properties            # Configurações da aplicação
│   └── static/                           # Frontend estático
│       ├── index.html                    # Portfólio principal
│       ├── projetos.html                 # Página de projetos
│       ├── login.html                    # Login admin
│       ├── admin.html                    # Dashboard admin
│       ├── css/
│       │   ├── base.css                  # Variáveis CSS, tema dark
│       │   ├── components.css            # Componentes reutilizáveis
│       │   └── pages.css                 # Estilos específicos por página
│       └── js/
│           ├── app.js                    # Inicialização principal
│           ├── config/
│           │   └── supabase.js           # Configuração cliente Supabase
│           ├── modules/
│           │   ├── auth.js               # Gerenciamento de autenticação
│           │   ├── contacts.js           # CRUD de contatos
│           │   ├── projects.js           # CRUD de projetos
│           │   ├── analytics.js          # Tracking e dashboard
│           │   └── blog.js               # Módulo blog (preparado)
│           └── utils/
│               ├── ui.js                 # Toast, loading, formatação
│               ├── validators.js         # Sanitização e validações
│               └── tech-detector.js      # Detecção automática de techs
│
├── pom.xml                               # Maven configuration
├── Procfile                              # Railway deployment
└── README.md                             # Este arquivo
```

---

## 🗄️ Banco de Dados

### Schema Supabase

#### Tabela: `projects`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `title` | VARCHAR | Título do projeto |
| `description` | TEXT | Descrição detalhada |
| `github_url` | VARCHAR | Link do repositório |
| `image_url` | VARCHAR | URL da imagem |
| `technologies` | ARRAY | Tecnologias utilizadas |
| `featured` | BOOLEAN | Destaque na homepage |
| `created_at` | TIMESTAMP | Data de criação |

#### Tabela: `contacts`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `name` | VARCHAR | Nome do contato |
| `email` | VARCHAR | Email |
| `message` | TEXT | Mensagem |
| `status` | VARCHAR | Status (new, read, replied) |
| `created_at` | TIMESTAMP | Data de envio |

#### Tabela: `visits`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `page` | VARCHAR | Página visitada |
| `device_type` | VARCHAR | Mobile/Tablet/Desktop |
| `browser` | VARCHAR | Navegador |
| `os` | VARCHAR | Sistema operacional |
| `session_id` | UUID | Identificador de sessão |
| `created_at` | TIMESTAMP | Data da visita |

---

## 🚀 Deploy

### Backend (Railway)
- Deploy contínuo via GitHub
- PostgreSQL gerenciado pelo Railway
- Health check automático em `/actuator/health`
- Variáveis de ambiente configuráveis

### Frontend (Vercel)
- Deploy estático otimizado
- CDN global para performance
- HTTPS automático

### Database (Supabase)
- PostgreSQL gerenciado
- Row Level Security para proteção
- Auth integrado para admin
- Dashboard web para gestão

---

## 🔒 Segurança

- **Sanitização de Input** - Prevenção contra XSS via HTML entity encoding
- **Validação Frontend** - Validação de email, campos obrigatórios, tamanho mínimo
- **Row Level Security** - Políticas de acesso no Supabase
- **Autenticação Admin** - Supabase Auth com sessão segura
- **Prepared Statements** - Proteção contra SQL injection via ORM

---

## 🎨 Design

### Paleta de Cores
- **Background:** `#020617` (slate-950)
- **Primária:** `#3b82f6` (blue-500)
- **Secundária:** `#1e40af` (blue-800)
- **Texto:** `#f8fafc` (slate-50)
- **Cards:** Glassmorphism com backdrop-blur

### Efeitos Visuais
- **Glassmorphism** - Cards com efeito de vidro fosco
- **Gradient Text** - Títulos com gradientes
- **Glow Effects** - Sombras luminosas em botões
- **Animações** - Transições suaves e hover effects
- **Responsivo** - Breakpoints para mobile (768px) e tablet (1024px)

---

## 📈 Próximas Melhoras

- [ ] **Blog Module** - Implementar UI completa para posts
- [ ] **API REST Backend** - Migrar operações para Spring Boot
- [ ] **Upload de Imagens** - Supabase Storage para projetos
- [ ] **CI/CD Pipeline** - GitHub Actions para testes automatizados
- [ ] **Testes Unitários** - JUnit para lógica de backend
- [ ] **SEO Otimização** - Meta tags e Open Graph
- [ ] **Internacionalização** - Suporte EN/PT-BR

---

## 🎯 Como Executar Localmente

### Pré-requisitos
- Java 17+
- Maven 3.8+
- Node.js (para frontend opcional)

### Backend
```bash
mvn clean install
mvn spring-boot:run
```
Acesso: `http://localhost:8080`

### Configuração Supabase
1. Crie projeto em [supabase.com](https://supabase.com)
2. Execute as migrations para criar as tabelas
3. Configure `js/config/supabase.js` com suas credenciais

---

## 📫 Contato

Tem um projeto em mente ou quer trocar uma ideia?

- **Email:** Entre em contato pelo formulário no site
- **GitHub:** [@alemaoxp](https://github.com/alemaoxp)
- **WhatsApp:** [(13) 99714-9654](https://wa.me/5513997149654)
- **Localização:** Itariri, São Paulo, Brasil

---

## 📄 Licença

Este projeto é open-source e está disponível para fins educacionais e de portfólio.

---

<p style="text-align: center;">
<b>Feito com ☕ Java e muito ❤️ por Gabriel Santana</b>
</p>
