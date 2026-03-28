// Estrutura de permissões granular
const PERMISSIONS = {
    projects: ['create', 'read', 'update', 'delete'],
    posts: ['create', 'read', 'update', 'delete', 'publish'],
    settings: ['read', 'update']
};

const ROLES = {
    admin: ['*'],  // Todas as permissões
    editor: ['posts.*', 'projects.read'],
    viewer: ['projects.read', 'posts.read']
};