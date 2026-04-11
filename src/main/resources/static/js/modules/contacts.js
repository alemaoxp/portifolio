/**
 * MÓDULO DE CONTATOS
 *
 * Consome a API Spring Boot REST ao invés do Supabase
 */

import { API_ENDPOINTS } from '../config/api.js';
import { sanitizeInput, validateEmail } from '../utils/validators.js';
import { showToast } from '../utils/ui.js';

// Helper para requisições à API
async function apiFetch(url, options = {}) {
    const token = localStorage.getItem('auth_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro na requisição' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
}

export class ContactManager {
    /**
     * Envia mensagem de contato (público)
     */
    async sendMessage({ name, email, message }) {
        try {
            if (!name?.trim() || !email?.trim() || !message?.trim()) {
                throw new Error('Todos os campos são obrigatórios');
            }

            if (!validateEmail(email)) {
                throw new Error('Email inválido');
            }

            if (message.length < 10) {
                throw new Error('Mensagem muito curta (mínimo 10 caracteres)');
            }

            const cleanData = {
                nome: sanitizeInput(name),
                email: sanitizeInput(email),
                mensagem: sanitizeInput(message)
            };

            // Usa a API REST ao invés do Supabase
            await apiFetch(API_ENDPOINTS.contatos, {
                method: 'POST',
                body: JSON.stringify(cleanData)
            });

            showToast('Mensagem enviada com sucesso! Retornarei em breve.', 'success');

            return { success: true };

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            showToast(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Lista mensagens (admin only)
     */
    async listMessages(status = null) {
        try {
            let url = API_ENDPOINTS.contatos;
            if (status) {
                url += `?status=${status}`;
            }

            const data = await apiFetch(url);

            return { success: true, data };

        } catch (error) {
            console.error('Erro ao listar mensagens:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Atualiza status da mensagem
     */
    async updateStatus(id, status) {
        try {
            const data = await apiFetch(`${API_ENDPOINTS.contatos}/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });

            return { success: true, data };

        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            return { success: false, error: error.message };
        }
    }
}

export const contactManager = new ContactManager();
