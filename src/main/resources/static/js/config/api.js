/**
 * CONFIGURAÇÃO DA API
 *
 * URL base da API Spring Boot no Railway
 * Como o frontend e backend estão no mesmo domínio,
 * usamos caminhos relativos
 */

export const API_BASE_URL = "";

// Endpoints da API
export const API_ENDPOINTS = {
    projetos: `/api/projetos`,
    destaques: `/api/projetos/destaques`,
    busca: `/api/projetos/busca`,
    auth: `/api/auth/login`,
    contatos: `/api/contatos`
};
