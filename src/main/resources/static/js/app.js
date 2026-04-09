/**
 * APLICAÇÃO PRINCIPAL
 *
 * Inicializa todos os módulos e configura eventos globais
 */

import { authManager } from './modules/auth.js';
import { projectRepo } from './modules/projects.js';
import { contactManager } from './modules/contacts.js';
import { analytics } from './modules/analytics.js';
import { showToast, formatDate } from './utils/ui.js';

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', async () => {

    // Inicializa auth
    await authManager.init();

    // Registra visita (analytics)
    analytics.trackPageView();

    // Inicializa componentes da página atual
    initNavigation();
    initContactForm();
    await loadProjects();

    console.log('✅ App inicializado com sucesso');
});

// ============================================
// NAVEGAÇÃO
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');

    // Efeito de scroll na navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// FORMULÁRIO DE CONTATO
// ============================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Loading state
        btn.classList.add('loading');
        btn.innerHTML = '<span class="loading-spinner"></span> Enviando...';

        const formData = new FormData(form);

        const result = await contactManager.sendMessage({
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        });

        // Reset loading
        btn.classList.remove('loading');
        btn.innerHTML = originalText;

        if (result.success) {
            form.reset();
        }
    });
}

// ============================================
// CARREGAMENTO DE PROJETOS
// ============================================
async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    // Carrega todos os projetos (sem filtro de featured)
    const result = await projectRepo.list({ limit: 6 });
    
    console.log('📦 Projetos carregados:', result);

    if (result.success && result.data.length > 0) {
        container.innerHTML = result.data.map(project => `
            <article class="project-card">
                <div class="project-image">
                    <i class="fas fa-code"></i>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${(project.technologies || []).map(tech =>
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                    </div>
                    <a href="${project.github_url}" target="_blank" class="btn btn-small">
                        <i class="fab fa-github"></i> Ver Código
                    </a>
                </div>
            </article>
        `).join('');
    } else {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Nenhum projeto destacado ainda.</p>';
    }
}