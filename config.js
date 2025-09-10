/**
 * Arquivo de Configuração
 * Centralize todas as configurações da aplicação aqui
 */

const CONFIG = {
    // Configurações da API
    API: {
        KEY: 'b598a1a65ed18db507f77bfddc79420ece5d9291b2ecd0851a035b091d1a30b4',
        BASE_URL: 'https://apicpf.com/api/consulta',
        TIMEOUT: 30000, // 30 segundos
        RETRY_ATTEMPTS: 3
    },
    
    // Configurações da interface
    UI: {
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 500,
        AUTO_HIDE_SUCCESS: 5000
    },
    
    // Mensagens personalizáveis
    MESSAGES: {
        ERRORS: {
            CPF_REQUIRED: 'CPF é obrigatório',
            CPF_INVALID: 'CPF inválido',
            API_INVALID_KEY: 'Chave de API inválida ou expirada',
            API_ACCESS_DENIED: 'Acesso negado. Verifique suas permissões',
            API_NOT_FOUND: 'CPF não encontrado na base de dados',
            API_RATE_LIMIT: 'Limite de consultas excedido. Tente novamente mais tarde',
            API_SERVER_ERROR: 'Erro interno do servidor. Tente novamente mais tarde',
            NETWORK_ERROR: 'Erro de rede. Verifique sua conexão',
            UNEXPECTED_ERROR: 'Erro inesperado. Tente novamente mais tarde'
        },
        SUCCESS: {
            CONSULTATION_SUCCESS: 'Consulta realizada com sucesso',
            DATA_FOUND: 'Dados encontrados'
        },
        LOADING: {
            SEARCHING: 'Consultando dados...',
            PLEASE_WAIT: 'Por favor, aguarde...'
        }
    },
    
    // Configurações de desenvolvimento
    DEBUG: {
        ENABLED: true,
        LOG_API_CALLS: true,
        SHOW_PERFORMANCE: false
    },
    
    // Configurações de integração
    INTEGRATION: {
        // Para uso em landing pages
        CONTAINER_ID: 'cpf-search-container',
        CSS_PREFIX: 'cpf-',
        
        // Callbacks personalizáveis
        ON_SUCCESS: null, // function(data) { ... }
        ON_ERROR: null,   // function(error) { ... }
        ON_LOADING: null  // function(isLoading) { ... }
    }
};

// Torna disponível globalmente
if (typeof window !== 'undefined') {
    window.CPF_CONFIG = CONFIG;
}

// Para uso em Node.js (se necessário no futuro)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
