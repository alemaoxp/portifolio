/**
 * MÓDULO DE BLOG
 *
 * Sistema completo de blog com:
 * - Listagem paginada
 * - Slug para URLs amigáveis
 * - Contador de views
 */

import { supabase } from '../config/supabase.js';
import { sanitizeInput, createSlug } from '../utils/validators.js';

export class BlogManager {
    /**
     * Lista posts publicados (público)
     */
    async listPosts(options = {}) {
        try {
            const { page = 1, perPage = 6, search = '' } = options;
            const start = (page - 1) * perPage;

            let query = supabase
                .from('posts')
                .select('*', { count: 'exact' })
                .eq('published', true)
                .order('created_at', { ascending: false })
                .range(start, start + perPage - 1);

            if (search) {
                query = query.ilike('title', `%${search}%`);
            }

            const { data, error, count } = await query;

            if (error) throw error;

            return {
                success: true,
                data,
                pagination: {
                    page,
                    perPage,
                    total: count,
                    totalPages: Math.ceil(count / perPage)
                }
            };

        } catch (error) {
            console.error('Erro ao listar posts:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Busca post por slug
     */
    async getBySlug(slug) {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .eq('published', true)
                .single();

            if (error) throw error;

            // Incrementa view count (não bloqueante)
            this.incrementViews(data.id);

            return { success: true, data };

        } catch (error) {
            console.error('Erro ao buscar post:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Incrementa contador de views
     */
    async incrementViews(postId) {
        try {
            await supabase.rpc('increment_post_views', { post_id: postId });
        } catch (error) {
            // Silencioso - não quebra a experiência do usuário
            console.log('Erro ao incrementar views:', error);
        }
    }

    /**
     * Cria post (admin)
     */
    async create(postData) {
        try {
            const slug = createSlug(postData.title);

            const cleanData = {
                title: sanitizeInput(postData.title),
                slug,
                excerpt: sanitizeInput(postData.excerpt),
                content: sanitizeInput(postData.content),
                cover_image: sanitizeInput(postData.cover_image),
                published: !!postData.published
            };

            const { data, error } = await supabase
                .from('posts')
                .insert([cleanData])
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };

        } catch (error) {
            console.error('Erro ao criar post:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Atualiza post (admin)
     */
    async update(id, postData) {
        try {
            const cleanData = {
                title: sanitizeInput(postData.title),
                excerpt: sanitizeInput(postData.excerpt),
                content: sanitizeInput(postData.content),
                cover_image: sanitizeInput(postData.cover_image),
                published: !!postData.published,
                updated_at: new Date().toISOString()
            };

            // Só atualiza slug se título mudou
            if (postData.title) {
                cleanData.slug = createSlug(postData.title);
            }

            const { data, error } = await supabase
                .from('posts')
                .update(cleanData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };

        } catch (error) {
            console.error('Erro ao atualizar post:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Deleta post (admin)
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return { success: true };

        } catch (error) {
            console.error('Erro ao deletar post:', error);
            return { success: false, error: error.message };
        }
    }
}

export const blogManager = new BlogManager();