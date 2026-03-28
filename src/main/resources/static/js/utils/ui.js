/**
 * UTILITÁRIOS DE INTERFACE
 *
 * Helpers para manipulação do DOM e feedback visual
 */

/**
 * Mostra notificação toast
 */
export function showToast(message, type = 'info', duration = 3000) {
    // Cria elemento toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${getIconForType(type)}"></i>
        <span>${message}</span>
    `;

    // Adiciona ao DOM
    document.body.appendChild(toast);

    // Anima entrada
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove após delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function getIconForType(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

/**
 * Mostra/esconde loading spinner
 */
export function toggleLoading(element, show) {
    if (show) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

/**
 * Formata data para exibição
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

/**
 * Debounce para eventos frequentes
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}