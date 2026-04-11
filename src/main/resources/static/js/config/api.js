/**
 * CONFIGURAÇÃO DA API
 *
 * URL base da API Spring Boot no Railway
 * Substitua pela sua URL real
 */

// ⚠️ ALTERE AQUI para sua URL do Railway!
export const API_BASE_URL = "https://SEU-APP.up.railway.app";

// Endpoints da API
export const API_ENDPOINTS = {
    projetos: `${API_BASE_URL}/api/projetos`,
    destaques: `${API_BASE_URL}/api/projetos/destaques`,
    busca: `${API_BASE_URL}/api/projetos/busca`,
    auth: `${API_BASE_URL}/api/auth/login`,
    contatos: `${API_BASE_URL}/api/contatos`
};
