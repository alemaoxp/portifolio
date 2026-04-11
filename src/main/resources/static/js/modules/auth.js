/**
 * MÓDULO DE AUTENTICACAO
 *
 * Autenticação via API Spring Boot com JWT
 */

import { API_ENDPOINTS } from '../config/api.js';
import { showToast } from '../utils/ui.js';

export class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        // Recupera token do localStorage
        this.token = localStorage.getItem('auth_token');

        if (this.token) {
            // Decodifica o JWT para obter informações do usuário
            try {
                const payload = JSON.parse(atob(this.token.split('.')[1]));
                this.currentUser = {
                    email: payload.sub,
                    role: payload.authorities?.[0] || 'ADMIN'
                };
            } catch (error) {
                console.error('Token inválido, removendo:', error);
                this.logout();
            }
        }

        this.initialized = true;
        return this.currentUser;
    }

    async login(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            const response = await fetch(API_ENDPOINTS.auth, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.trim(),
                    senha: password
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Credenciais inválidas' }));
                throw new Error(error.message || 'Email ou senha incorretos');
            }

            const data = await response.json();

            // Armazena token e informações do usuário
            this.token = data.token;
            this.currentUser = {
                email: data.email,
                role: data.role
            };

            localStorage.setItem('auth_token', data.token);

            showToast('Login realizado com sucesso!', 'success');

            // Redireciona se estiver na página de login
            if (window.location.pathname.includes('login')) {
                window.location.href = 'admin.html';
            }

            return { success: true, user: this.currentUser };

        } catch (error) {
            console.error('Erro no login:', error);
            showToast(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            this.token = null;
            this.currentUser = null;
            localStorage.removeItem('auth_token');

            showToast('Logout realizado', 'info');
            this.redirectToLogin();

        } catch (error) {
            console.error('Erro no logout:', error);
            showToast('Erro ao sair', 'error');
        }
    }

    isAdmin() {
        if (!this.currentUser) return false;
        return this.currentUser.role === 'ADMIN' || this.currentUser.role === 'ROLE_ADMIN';
    }

    async requireAuth() {
        if (!this.token) {
            showToast('Área restrita. Faça login.', 'warning');
            this.redirectToLogin();
            return false;
        }

        return true;
    }

    redirectToLogin() {
        if (!window.location.pathname.includes('login')) {
            window.location.href = 'login.html';
        }
    }

    async redirectIfAuthenticated() {
        if (this.token && window.location.pathname.includes('login')) {
            window.location.href = 'admin.html';
        }
    }

    // Retorna o token JWT para usar em outras requisições
    getToken() {
        return this.token;
    }
}

export const authManager = new AuthManager();
