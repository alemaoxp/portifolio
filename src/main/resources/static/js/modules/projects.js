/**
 * MÓDULO DE PROJETOS
 *
 * Padrão Repository: abstrai operações de banco
 * Todas as operações retornam { data, error } padronizado
 */

import { supabase } from '../config/supabase.js';
import { sanitizeInput } from '../utils/validators.js';

export class ProjectRepository {
    /**
     * Lista todos os projetos (público)
     */
    async list(options = {}) {
        try {
            let query = supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            // Filtro: apenas destaques
            if (options.featuredOnly) {
                query = query.eq('featured', true);
            }

            // Limite para performance
            if (options.limit) {
                query = query.limit(options.limit);
            }

            const { data, error } = await query;

            if (error) throw error;

            return { success: true, data };

        } catch (error) {
            console.error('Erro ao listar projetos:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Busca projeto por ID
     */
    async getById(id) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return { success: true, data };

        } catch (error) {
            console.error('Erro ao buscar projeto:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Cria novo projeto (requer auth)
     */
    async create(projectData) {
        try {
            // Sanitização
            const cleanData = {
                title: sanitizeInput(projectData.title),
                description: sanitizeInput(projectData.description),
                github_url: sanitizeInput(projectData.github_url),
                image_url: sanitizeInput(projectData.image_url),
                technologies: projectData.technologies || [],
                featured: !!projectData.featured
            };

            // Validação
            if (!cleanData.title || !cleanData.description) {
                throw new Error('Título e descrição são obrigatórios');
            }

            const { data, error } = await supabase
                .from('projects')
                .insert([cleanData])
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };

        } catch (error) {
            console.error('Erro ao criar projeto:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Atualiza projeto (requer auth)
     */
    async update(id, projectData) {
        try {
            const cleanData = {
                title: sanitizeInput(projectData.title),
                description: sanitizeInput(projectData.description),
                github_url: sanitizeInput(projectData.github_url),
                image_url: sanitizeInput(projectData.image_url),
                technologies: projectData.technologies || [],
                featured: !!projectData.featured,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('projects')
                .update(cleanData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };

        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Deleta projeto (requer auth)
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return { success: true };

        } catch (error) {
            console.error('Erro ao deletar projeto:', error);
            return { success: false, error: error.message };
        }
    }
}

export const projectRepo = new ProjectRepository();