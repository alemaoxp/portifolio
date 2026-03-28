/**
 * MÓDULO DE AUTENTICAÇÃO
 *
 * Responsabilidades:
 * - Login/logout
 * - Verificação de sessão
 * - Proteção de rotas
 * - Gerenciamento de roles
 */

import { supabase } from '../config/supabase.js';
import { showToast } from '../utils/ui.js';

export class AuthManager {
    constructor() {
        this.currentUser = null;
        this.initialized = false;
    }

    /**
     * Inicializa o auth e configura listeners
     */
    async init() {
        if (this.initialized) return;

        // Verifica sessão existente
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            this.currentUser = session.user;
            this.setupAuthListener();
        }

        this.initialized = true;
        return this.currentUser;
    }

    /**
     * Listener para mudanças de auth (login/logout em outra aba)
     */
    setupAuthListener() {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.currentUser = session.user;
                console.log('✅ Usuário logado:', this.currentUser.email);
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                console.log('👋 Usuário deslogado');
                this.redirectToLogin();
            }
        });
    }

    /**
     * Login com email/senha
     */
    async login(email, password) {
        try {
            // Validação básica
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password
            });

            if (error) throw error;

            this.currentUser = data.user;
            showToast('Login realizado com sucesso!', 'success');

            // Redireciona para admin se estiver na página de login
            if (window.location.pathname.includes('login')) {
                window.location.href = '/admin.html';
            }

            return { success: true, user: data.user };

        } catch (error) {
            console.error('Erro no login:', error);
            showToast(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Logout
     */
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            this.currentUser = null;
            showToast('Logout realizado', 'info');
            this.redirectToLogin();

        } catch (error) {
            console.error('Erro no logout:', error);
            showToast('Erro ao sair', 'error');
        }
    }

    /**
     * Verifica se é admin (usando app_metadata ou user_metadata)
     */
    isAdmin() {
        if (!this.currentUser) return false;
        // Verifica no JWT token (configurado no Supabase Auth)
        return this.currentUser.app_metadata?.role === 'admin' ||
               this.currentUser.user_metadata?.role === 'admin';
    }

    /**
     * Protege página: redireciona se não autenticado
     */
async requireAuth() {

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        showToast('Área restrita. Faça login.', 'warning');
        this.redirectToLogin();
        return false;
    }

    this.currentUser = session.user;

//    if (window.location.pathname.includes('admin') && !this.isAdmin()) {
//        showToast('Acesso negado. Permissão insuficiente.', 'error');
//        this.redirectToLogin();
//        return false;
//    }

    return true;
}

    /**
     * Redireciona para login
     */
    redirectToLogin() {
        if (!window.location.pathname.includes('login')) {
            window.location.href = '/login.html';
        }
    }

    /**
     * Redireciona para admin se já estiver logado
     */
async redirectIfAuthenticated() {

    const { data: { session } } = await supabase.auth.getSession();

    if (session && window.location.pathname.includes('login')) {
        window.location.href = '/admin.html';
    }
}

}

// Exporta instância única
export const authManager = new AuthManager();