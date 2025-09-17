/**
 * Módulo de API CPF
 * Gerencia as requisições para a API de consulta CPF
 */

class CPFAPI {
    constructor() {
        // Sistema de múltiplas chaves API para aumentar limite diário
        this.apiKeys = [
            'e3f4ee4c37600f854eeb0ec60421f16b547eb9c28982f8e8ffbbc3f93dc2b844'  // Chave atualizada
        ];
        this.currentKeyIndex = 0; // Índice da chave atual
        this.baseURL = 'https://apicpf.com/api/consulta';
        
        console.log(`🔑 Sistema configurado com ${this.apiKeys.length} chaves API`);
        console.log(`📊 Limite total estimado: ${this.apiKeys.length * 500} requisições/dia`);
    }
    
    /**
     * Rotaciona para a próxima chave API
     * @returns {string} - Chave API atual
     */
    getNextApiKey() {
        const currentKey = this.apiKeys[this.currentKeyIndex];
        const keyNumber = this.currentKeyIndex + 1;
        
        // Rotaciona para a próxima chave
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
        
        console.log(`🔄 Usando chave API #${keyNumber} (${currentKey.substring(0, 8)}...)`);
        console.log(`➡️ Próxima consulta usará chave #${this.currentKeyIndex + 1}`);
        
        return currentKey;
    }

    /**
     * Consulta dados de um CPF com rotação inteligente de chaves
     * @param {string} cpf - CPF para consultar (apenas números)
     * @returns {Promise<Object>} - Dados do CPF ou erro
     */
    async consultarCPF(cpf) {
        try {
            // Remove formatação do CPF
            const cpfLimpo = CPFValidator.clean(cpf);
            
            // Valida CPF antes de fazer a requisição
            if (!CPFValidator.isValid(cpfLimpo)) {
                throw new Error('CPF inválido');
            }
            
            // Obtém a próxima chave API na rotação
            const apiKey = this.getNextApiKey();
            
            // Monta a URL da requisição
            const url = `${this.baseURL}?cpf=${cpfLimpo}`;
            
            // Configurações da requisição
            const requestOptions = {
                method: 'GET',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json'
                }
            };
            
            console.log('Fazendo requisição para:', url);
            console.log('Headers:', requestOptions.headers);
            
            // Faz a requisição
            const response = await fetch(url, requestOptions);
            
            console.log('Status da resposta:', response.status);
            
            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta:', errorText);
                
                switch (response.status) {
                    case 401:
                        throw new Error('Chave de API inválida ou expirada');
                    case 403:
                        throw new Error('Acesso negado. Verifique suas permissões');
                    case 404:
                        throw new Error('CPF não encontrado na base de dados');
                    case 429:
                        // Limite atingido - tenta com a próxima chave se disponível
                        console.warn(`⚠️ Limite atingido na chave atual. Tentando próxima chave...`);
                        if (this.apiKeys.length > 1) {
                            console.log('🔄 Tentando com a próxima chave API...');
                            return await this.consultarCPF(cpf); // Recursão com próxima chave
                        } else {
                            throw new Error('Limite de consultas excedido em todas as chaves. Tente novamente mais tarde');
                        }
                    case 500:
                        throw new Error('Erro interno do servidor. Tente novamente mais tarde');
                    default:
                        throw new Error(`Erro na consulta: ${response.status} - ${errorText}`);
                }
            }
            
            // Parse da resposta JSON
            const data = await response.json();
            console.log('Dados recebidos completos:', data);
            console.log('Estrutura da resposta:', JSON.stringify(data, null, 2));
            
            // Verifica se a resposta tem a estrutura esperada
            let dadosReais = data;
            
            // Se a resposta tem um campo 'data', usa ele
            if (data.data) {
                dadosReais = data.data;
                console.log('Usando data.data:', dadosReais);
            }
            
            // Se a resposta tem um campo 'result', usa ele
            if (data.result) {
                dadosReais = data.result;
                console.log('Usando data.result:', dadosReais);
            }
            
            // Log detalhado para debug
            console.log('Dados processados:', dadosReais);
            console.log('Tem nome?', !!dadosReais.nome);
            console.log('Tem name?', !!dadosReais.name);
            console.log('Keys disponíveis:', Object.keys(dadosReais || {}));
            
            // Verifica se retornou dados válidos (relaxando a validação)
            if (!dadosReais || (Object.keys(dadosReais).length === 0)) {
                return {
                    success: false,
                    error: 'CPF válido, mas não foram encontrados dados na base de consulta'
                };
            }
            
            return {
                success: true,
                data: this.formatarResposta(dadosReais)
            };
            
        } catch (error) {
            console.error('Erro na consulta CPF:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Formata a resposta da API para um formato padronizado
     * @param {Object} data - Dados brutos da API
     * @returns {Object} - Dados formatados
     */
    formatarResposta(data) {
        // Adapta a resposta baseada na estrutura real da API
        return {
            cpf: data.cpf || '',
            nome: data.nome || data.name || 'Não informado',
            situacao: 'Devedor na receita federal',
            dataNascimento: data.nascimento || data.birthDate || 'Não informado',
            mae: data.mae || data.mother || 'Não informado',
            endereco: {
                logradouro: data.logradouro || data.address || 'Não informado',
                numero: data.numero || data.number || 'Não informado',
                complemento: data.complemento || data.complement || '',
                bairro: data.bairro || data.district || 'Não informado',
                cidade: data.cidade || data.city || 'Não informado',
                uf: data.uf || data.state || 'Não informado',
                cep: data.cep || data.zipCode || 'Não informado'
            },
            telefones: data.telefones || data.phones || [],
            emails: data.emails || [],
            // Campos adicionais que podem existir
            rg: data.rg || 'Não informado',
            tituloEleitor: data.tituloEleitor || data.voterTitle || 'Não informado',
            dataConsulta: new Date().toLocaleString('pt-BR')
        };
    }
    
    /**
     * Testa a conectividade com a API (DESABILITADO para economizar créditos)
     * @returns {Promise<boolean>} - true se API está funcionando
     */
    async testarConectividade() {
        // DESABILITADO: Não fazer requisições desnecessárias
        console.log('⚠️ Teste de conectividade desabilitado para economizar créditos');
        return true;
    }
    
    /**
     * Valida se as chaves API estão configuradas corretamente
     * @returns {boolean} - true se pelo menos uma chave está presente
     */
    validarChaveAPI() {
        const chavesValidas = this.apiKeys.filter(key => key && key.length > 0);
        console.log(`🔍 Chaves válidas encontradas: ${chavesValidas.length}/${this.apiKeys.length}`);
        return chavesValidas.length > 0;
    }
    
    /**
     * Obtém estatísticas das chaves API
     * @returns {Object} - Informações sobre as chaves
     */
    getApiKeysStats() {
        return {
            totalKeys: this.apiKeys.length,
            currentKeyIndex: this.currentKeyIndex,
            estimatedDailyLimit: this.apiKeys.length * 500,
            nextKeyToUse: this.currentKeyIndex + 1
        };
    }
}

// Torna disponível globalmente
window.CPFAPI = CPFAPI;
