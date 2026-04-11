/**
 * MÓDULO DE PROJETOS
 *
 * Consome a API Spring Boot REST ao invés do Supabase
 */

import { API_ENDPOINTS } from '../config/api.js';
import { sanitizeInput } from '../utils/validators.js';
import { enrichProjectsWithTechnologies, enrichProjectWithTechnologies } from '../utils/tech-detector.js';

// Helper para fazer requisições à API
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

    // Se não tiver conteúdo (204), retorna null
    if (response.status === 204) return null;

    return response.json();
}

export class ProjectRepository {
    /**
     * Lista todos os projetos (público)
     */
    async list(options = {}) {
        try {
            let url = API_ENDPOINTS.projetos;

            if (options.featuredOnly) {
                url = API_ENDPOINTS.destaques;
            }

            const data = await apiFetch(url);

            // Aplica limite se especificado
            let filteredData = data || [];
            if (options.limit) {
                filteredData = filteredData.slice(0, options.limit);
            }

            // Enriquece projetos com tecnologias detectadas
            const enrichedData = enrichProjectsWithTechnologies(filteredData);

            return { success: true, data: enrichedData };

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
            const url = `${API_ENDPOINTS.projetos}/${id}`;
            const data = await apiFetch(url);

            // Enriquece com tecnologias detectadas
            const enrichedData = enrichProjectWithTechnologies(data);

            return { success: true, data: enrichedData };

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
            const detectedTechs = projectData.technologies && projectData.technologies.length > 0
                ? projectData.technologies
                : [];

            const cleanData = {
                nome: sanitizeInput(projectData.title),
                descricao: sanitizeInput(projectData.description),
                githubUrl: sanitizeInput(projectData.github_url),
                imageUrl: sanitizeInput(projectData.image_url),
                tecnologias: detectedTechs,
                destaque: !!projectData.featured
            };

            if (!cleanData.nome || !cleanData.descricao) {
                throw new Error('Título e descrição são obrigatórios');
            }

            const data = await apiFetch(API_ENDPOINTS.projetos, {
                method: 'POST',
                body: JSON.stringify(cleanData)
            });

            const enrichedData = enrichProjectWithTechnologies(data);

            return { success: true, data: enrichedData };

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
            const detectedTechs = projectData.technologies && projectData.technologies.length > 0
                ? projectData.technologies
                : [];

            const cleanData = {
                nome: sanitizeInput(projectData.title),
                descricao: sanitizeInput(projectData.description),
                githubUrl: sanitizeInput(projectData.github_url),
                imageUrl: sanitizeInput(projectData.image_url),
                tecnologias: detectedTechs,
                destaque: !!projectData.featured
            };

            const data = await apiFetch(`${API_ENDPOINTS.projetos}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(cleanData)
            });

            const enrichedData = enrichProjectWithTechnologies(data);

            return { success: true, data: enrichedData };

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
            await apiFetch(`${API_ENDPOINTS.projetos}/${id}`, {
                method: 'DELETE'
            });

            return { success: true };

        } catch (error) {
            console.error('Erro ao deletar projeto:', error);
            return { success: false, error: error.message };
        }
    }
}

export const projectRepo = new ProjectRepository();
