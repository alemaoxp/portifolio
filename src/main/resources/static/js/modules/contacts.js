/**
 * MÓDULO DE CONTATOS
 *
 * Responsável pelo formulário de contato público
 * e gestão de mensagens no admin
 */

import { supabase } from '../config/supabase.js';
import { sanitizeInput, validateEmail } from '../utils/validators.js';
import { showToast } from '../utils/ui.js';

export class ContactManager {
    /**
     * Envia mensagem de contato (público)
     */
    async sendMessage({ name, email, message }) {
        try {
            // Validação frontend
            if (!name?.trim() || !email?.trim() || !message?.trim()) {
                throw new Error('Todos os campos são obrigatórios');
            }

            if (!validateEmail(email)) {
                throw new Error('Email inválido');
            }

            if (message.length < 10) {
                throw new Error('Mensagem muito curta (mínimo 10 caracteres)');
            }

            // Sanitização
            const cleanData = {
                name: sanitizeInput(name),
                email: sanitizeInput(email),
                message: sanitizeInput(message),
                status: 'new'
            };

            const { data, error } = await supabase
                .from('contacts')
                .insert([cleanData])
                .select()
                .single();

            if (error) throw error;

            showToast('Mensagem enviada com sucesso! Retornarei em breve.', 'success');

            return { success: true, data };

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            showToast(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Lista mensagens (admin only - RLS protege)
     */
    async listMessages(status = null) {
        try {
            let query = supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) throw error;

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
            const { data, error } = await supabase
                .from('contacts')
                .update({ status })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };

        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            return { success: false, error: error.message };
        }
    }
}

export const contactManager = new ContactManager();