/**
 * UTILITÁRIOS DE VALIDAÇÃO E SANITIZAÇÃO
 *
 * Segurança: sempre sanitize inputs antes de enviar ao banco
 */

/**
 * Remove tags HTML e caracteres perigosos
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/&/g, '&amp;')
        .trim();
}

/**
 * Valida formato de email
 */
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Cria slug URL-friendly a partir de string
 */
export function createSlug(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Espaços -> hífens
        .replace(/[^\w\-]+/g, '')       // Remove caracteres especiais
        .replace(/\-\-+/g, '-');        // Múltiplos hífens -> um
}

/**
 * Valida URL
 */
export function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Limita tamanho de string
 */
export function truncate(str, length = 100) {
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
}