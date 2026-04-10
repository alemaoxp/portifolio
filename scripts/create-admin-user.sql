-- Script para criar usuário admin inicial
-- Execute este SQL no painel do Railway PostgreSQL ou via psql

-- Criar tabela de usuários (será criada automaticamente pelo Hibernate, mas isso garante)
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Inserir usuário admin padrão
-- Senha: admin123 (criptografada com BCrypt)
INSERT INTO usuarios (email, senha, role)
VALUES (
    'admin@portfolio.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- A senha 'admin123' criptografada com BCrypt resulta em:
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Verificar se o usuário foi criado
SELECT id, email, role, criado_em FROM usuarios;
