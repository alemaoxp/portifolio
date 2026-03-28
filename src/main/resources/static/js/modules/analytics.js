/**
 * MÓDULO DE ANALYTICS
 *
 * Coleta métricas de visitação e gera relatórios
 * Privacidade-first: não armazena IP real, apenas hash
 */

import { supabase } from '../config/supabase.js';

export class AnalyticsManager {
    constructor() {
        this.sessionId = this.generateSessionId();
    }

    /**
     * Gera ID único de sessão
     */
    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    /**
     * Detecta tipo de dispositivo
     */
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    /**
     * Detecta navegador
     */
    getBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
    }

    /**
     * Detecta SO
     */
    getOS() {
        const ua = navigator.userAgent;
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'MacOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Other';
    }

    /**
     * Hash simples do IP (simulado - em produção use backend)
     * NOTA: Em produção real, o IP deve ser detectado no servidor
     */
    async getIpHash() {
        try {
            // Simulação - em produção use uma função Edge do Supabase
            return 'hash_' + Math.random().toString(36).substr(2, 15);
        } catch (error) {
            return 'unknown';
        }
    }

    /**
     * Registra visita na página atual
     */
    async trackPageView(page = null) {
        try {
            const pageName = page || window.location.pathname;

            const visitData = {
                page: pageName,
                referrer: document.referrer || null,
                device_type: this.getDeviceType(),
                browser: this.getBrowser(),
                os: this.getOS(),
                screen_size: `${window.screen.width}x${window.screen.height}`,
                session_id: this.sessionId,
                ip_hash: await this.getIpHash()
            };

            // Fire and forget - não bloqueia a UI
            supabase.from('visits').insert([visitData]).then(({ error }) => {
                if (error) console.log('Analytics error:', error);
            });

        } catch (error) {
            console.log('Erro ao registrar visita:', error);
        }
    }

    /**
     * Dashboard: estatísticas gerais (admin)
     */
    async getDashboardStats(period = '7d') {
        try {
            // Total de visitas no período
            const { data: visits, error: visitsError } = await supabase
                .from('visits')
                .select('*')
                .gte('created_at', this.getPeriodStart(period));

            if (visitsError) throw visitsError;

            // Páginas mais acessadas
            const pageViews = visits.reduce((acc, visit) => {
                acc[visit.page] = (acc[visit.page] || 0) + 1;
                return acc;
            }, {});

            const topPages = Object.entries(pageViews)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            // Dispositivos
            const devices = visits.reduce((acc, visit) => {
                acc[visit.device_type] = (acc[visit.device_type] || 0) + 1;
                return acc;
            }, {});

            // Visitas por dia (para gráfico)
            const dailyVisits = this.groupByDay(visits);

            return {
                success: true,
                data: {
                    totalVisits: visits.length,
                    uniqueSessions: new Set(visits.map(v => v.session_id)).size,
                    topPages,
                    devices,
                    dailyVisits,
                    recentVisits: visits.slice(0, 10)
                }
            };

        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Helper: data de início do período
     */
    getPeriodStart(period) {
        const now = new Date();
        switch (period) {
            case '24h': return new Date(now - 24 * 60 * 60 * 1000).toISOString();
            case '7d': return new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
            case '30d': return new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
            default: return new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
        }
    }

    /**
     * Helper: agrupa visitas por dia
     */
    groupByDay(visits) {
        const grouped = {};

        visits.forEach(visit => {
            const day = visit.created_at.split('T')[0];
            grouped[day] = (grouped[day] || 0) + 1;
        });

        return Object.entries(grouped)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, count]) => ({ date, count }));
    }
}

export const analytics = new AnalyticsManager();