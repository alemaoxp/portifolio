/**
 * DETECTOR AUTOMÁTICO DE TECNOLOGIAS
 * 
 * Analisa título, descrição e URL do GitHub para detectar
 * automaticamente as tecnologias utilizadas em um projeto.
 * 
 * Sempre que um projeto for criado ou atualizado, este módulo
 * irá preencher o campo technologies automaticamente.
 */

// Mapa de padrões para detecção de tecnologias
const TECH_PATTERNS = {
    // Linguagens principais
    'Java': {
        extensions: ['.java', '.kt', '.gradle', '.pom.xml'],
        keywords: ['java', 'spring', 'spring boot', 'maven', 'gradle', 'jpa', 'hibernate'], // Removido 'jakarta' pois é genérico
        repos: ['spring', 'java'] // Removido 'backend', 'api', 'rest' pois são genéricos
    },
    'JavaScript': {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        keywords: ['javascript', 'typescript', 'react', 'vue', 'angular', 'express', 'next'], // Removido 'node' pois é genérico
        repos: ['react', 'vue', 'angular', 'js', 'frontend'] // Removido 'node', 'app' pois são genéricos
    },
    'Python': {
        extensions: ['.py', '.ipynb'],
        keywords: ['python', 'django', 'flask', 'fastapi', 'pandas', 'numpy', 'tensorflow'],
        repos: ['python', 'django', 'flask', 'ml', 'ai'] // Removido 'data' pois é genérico
    },
    'HTML': {
        extensions: ['.html', '.htm'],
        keywords: ['html', 'html5', 'web', 'site', 'página', 'pagina', 'portfolio'],
        repos: ['html', 'site', 'web', 'landing', 'portfolio']
    },
    'CSS': {
        extensions: ['.css', '.scss', '.sass', '.less', '.tailwind'],
        keywords: ['css', 'sass', 'scss', 'tailwind', 'bootstrap', 'styled', 'material'],
        repos: ['css', 'styles', 'ui', 'design', 'theme']
    },
    'TypeScript': {
        extensions: ['.ts', '.tsx'],
        keywords: ['typescript', 'ts', 'angular', 'nestjs', 'next.js'],
        repos: ['ts', 'typescript', 'angular', 'nestjs']
    },
    'PHP': {
        extensions: ['.php', '.blade.php', '.laravel'],
        keywords: ['php', 'laravel', 'symfony', 'wordpress', 'composer'],
        repos: ['php', 'laravel', 'wordpress', 'cms']
    },
    'C#': {
        extensions: ['.cs', '.cshtml', '.csproj'],
        keywords: ['csharp', 'c#', '.net', 'asp.net', 'dotnet', 'unity'],
        repos: ['csharp', 'dotnet', 'asp', 'unity']
    },
    'Go': {
        extensions: ['.go'],
        keywords: ['golang'], // Removido 'go', 'gin', 'fiber' pois são genéricos
        repos: ['golang']
    },
    'Ruby': {
        extensions: ['.rb', '.erb', '.gemspec'],
        keywords: ['ruby', 'rails', 'sinatra'], // Removido 'gem' pois é genérico
        repos: ['ruby', 'rails']
    },
    'SQL': {
        extensions: ['.sql'],
        keywords: ['mysql', 'postgresql', 'sqlite', 'mongodb'], // Removido 'sql', 'database', 'banco de dados' pois são genéricos
        repos: [] // Removido 'sql', 'db', 'database', 'data' pois são genéricos
    },
    'Docker': {
        extensions: ['Dockerfile', 'docker-compose'],
        keywords: ['docker', 'container', 'kubernetes', 'k8s'],
        repos: ['docker', 'container', 'deploy']
    },
    'Git': {
        extensions: [],
        keywords: [], // Git não é detectado por keywords
        repos: []
    },
    'React': {
        extensions: ['.jsx', '.tsx'],
        keywords: ['react', 'react native', 'next.js', 'jsx', 'hooks', 'redux'],
        repos: ['react', 'next', 'frontend']
    },
    'Node.js': {
        extensions: ['.js', '.mjs'],
        keywords: ['node', 'nodejs', 'node.js', 'express', 'fastify', 'koa'], // Removido 'npm', 'yarn' pois são genéricos
        repos: ['node', 'api'] // Mantido apenas 'node' e 'api' específicos
    },
    'Spring Boot': {
        extensions: ['.java', '.gradle', '.pom.xml'],
        keywords: ['spring boot', 'springboot'], // Removido 'spring', 'jpa', 'hibernate' pois conflitam com Java
        repos: ['spring-boot', 'boot'] // Mais específico
    }
};

/**
 * Detecta tecnologias baseado no conteúdo do projeto
 * @param {Object} project - Dados do projeto (title, description, github_url)
 * @returns {string[]} - Array de tecnologias detectadas
 */
export function detectTechnologies(project) {
    const technologies = new Set();
    
    const title = (project.title || '').toLowerCase();
    const description = (project.description || '').toLowerCase();
    const githubUrl = (project.github_url || '').toLowerCase();
    const repoName = extractRepoName(githubUrl);
    
    // Combina todo o texto para análise
    const fullText = `${title} ${description} ${repoName}`;
    
    // Analisa cada tecnologia
    Object.entries(TECH_PATTERNS).forEach(([tech, patterns]) => {
        // Verifica keywords no título/descrição
        const hasKeyword = patterns.keywords.some(keyword => 
            fullText.includes(keyword.toLowerCase())
        );
        
        // Verifica repositório (se houver URL)
        const hasRepoMatch = githubUrl && patterns.repos.some(repo => 
            repoName.includes(repo.toLowerCase())
        );
        
        if (hasKeyword || hasRepoMatch) {
            technologies.add(tech);
        }
    });
    
    // Git sempre é detectado se houver URL do GitHub
    if (githubUrl && githubUrl.includes('github.com')) {
        technologies.add('Git');
    }
    
    // Se não detectou nada, coloca um fallback baseado no título
    if (technologies.size === 0) {
        technologies.add('Web');
    }
    
    return Array.from(technologies);
}

/**
 * Extrai nome do repositório da URL do GitHub
 * Ex: https://github.com/user/repo-name -> repo-name
 */
function extractRepoName(githubUrl) {
    if (!githubUrl) return '';
    
    try {
        const url = new URL(githubUrl);
        const parts = url.pathname.split('/').filter(p => p);
        return parts[1] || parts[0] || '';
    } catch {
        // Se não conseguir parsear, pega a última parte da URL
        const parts = githubUrl.split('/').filter(p => p);
        return parts[parts.length - 1] || '';
    }
}

/**
 * Enriquece projeto com tecnologias detectadas automaticamente
 * @param {Object} project - Projeto original
 * @returns {Object} - Projeto com tecnologias preenchidas
 */
export function enrichProjectWithTechnologies(project) {
    if (!project) return project;
    
    // Se já tem tecnologias definidas e não está vazio, mantém
    if (project.technologies && project.technologies.length > 0) {
        return project;
    }
    
    // Detecta automaticamente
    const detectedTechnologies = detectTechnologies(project);
    
    return {
        ...project,
        technologies: detectedTechnologies
    };
}

/**
 * Enriquece lista de projetos
 */
export function enrichProjectsWithTechnologies(projects) {
    if (!Array.isArray(projects)) return projects;
    
    return projects.map(project => enrichProjectWithTechnologies(project));
}
