# Deploy no Railway

Este projeto é uma aplicação Spring Boot configurada para deploy no Railway.

## Pré-requisitos

- Java 17+
- Maven 3.8+
- Conta no [Railway](https://railway.app/)
- Conta no GitHub

## Configuração Local

### 1. Instalar dependências

```bash
mvn clean install
```

### 2. Executar localmente

```bash
mvn spring-boot:run
```

A aplicação estará disponível em `http://localhost:8080`

## Deploy no Railway

### Opção 1: Via GitHub (Recomendado)

1. **Faça push do código para o GitHub**
   ```bash
   git add .
   git commit -m "Configure para deploy no Railway"
   git push origin main
   ```

2. **Acesse o Railway**
   - Vá para [railway.app](https://railway.app/)
   - Faça login com GitHub
   - Clique em "New Project"

3. **Conecte ao repositório**
   - Clique em "Deploy from GitHub repo"
   - Selecione este repositório
   - O Railway detectará automaticamente que é um projeto Java/Maven

4. **Configure o PostgreSQL (se necessário)**
   - No painel do projeto, clique em "+ New"
   - Selecione "Database" > "PostgreSQL"
   - O Railway criará automaticamente a variável `DATABASE_URL`

5. **Configure as variáveis de ambiente**
   - Vá para "Variables" tab
   - Adicione as variáveis necessárias:
     ```
     PORT=8080
     SPRING_DATASOURCE_URL=jdbc:postgresql://...
     SPRING_DATASOURCE_USERNAME=postgres
     SPRING_DATASOURCE_PASSWORD=your_password
     ```
   - Ou use apenas `DATABASE_URL` se adicionou um PostgreSQL do Railway

6. **Deploy automático**
   - O Railway fará deploy automaticamente a cada push no GitHub

### Opção 2: Via Railway CLI

1. **Instale o Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Faça login**
   ```bash
   railway login
   ```

3. **Inicialize o projeto**
   ```bash
   railway init
   ```

4. **Deploy**
   ```bash
   railway up
   ```

## Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `PORT` | Porta da aplicação | Não (default: 8080) |
| `DATABASE_URL` | URL completa do PostgreSQL | Não |
| `SPRING_DATASOURCE_URL` | URL JDBC do banco | Não |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco | Não |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco | Não |

## Endpoints

- **Health Check**: `/actuator/health`
- **Info**: `/actuator/info`
- **Aplicação**: `http://localhost:8080`

## Estrutura do Projeto

```
projeto-backend/
├── src/main/java/com/projeto/
│   ├── ProjetoBackendApplication.java
│   └── config/
│       └── DatabaseConfig.java
├── src/main/resources/
│   └── application.properties
├── pom.xml
├── Procfile
└── README.md
```

## Troubleshooting

### Erro de conexão com banco

Verifique se as variáveis de ambiente estão configuradas corretamente no Railway.

### Build falha

Execute `mvn clean install` localmente para verificar erros de compilação.

### Porta não disponível

O Railway define automaticamente a variável `PORT`. Certifique-se de que `server.port=${PORT:8080}` está configurado.

## Links Úteis

- [Documentação Railway](https://docs.railway.app/)
- [Documentação Spring Boot](https://spring.io/projects/spring-boot)
- [Suporte Railway](https://railway.app/support)
