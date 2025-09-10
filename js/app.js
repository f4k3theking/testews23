/**
 * Aplicação Principal - Consulta CPF
 * Gerencia a interface e coordena as funcionalidades
 */

class CPFApp {
    constructor() {
        this.api = new CPFAPI();
        this.isConsulting = false; // Flag para evitar múltiplas consultas
        this.initializeElements();
        this.bindEvents();
        this.initializeValidation();
    }
    
    /**
     * Inicializa referências dos elementos DOM
     */
    initializeElements() {
        // Formulário e campos
        this.form = document.getElementById('cpfForm');
        this.cpfInput = document.getElementById('cpfInput');
        this.cpfError = document.getElementById('cpfError');
        this.searchBtn = document.getElementById('searchBtn');
        
        // Seções de resultado
        this.resultsSection = document.getElementById('resultsSection');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.resultCard = document.getElementById('resultCard');
        this.errorCard = document.getElementById('errorCard');
        this.resultContent = document.getElementById('resultContent');
        this.errorContent = document.getElementById('errorContent');
    }
    
    /**
     * Vincula eventos aos elementos
     */
    bindEvents() {
        // Evento de submit do formulário
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Validação em tempo real
        this.cpfInput.addEventListener('blur', () => {
            if (this.cpfInput.value.trim()) {
                CPFValidator.validateWithUI(this.cpfInput, this.cpfError);
            }
        });
        
        // Limpar erro ao começar a digitar
        this.cpfInput.addEventListener('input', () => {
            if (this.cpfError.classList.contains('show')) {
                CPFValidator.hideError(this.cpfInput, this.cpfError);
            }
        });
    }
    
    /**
     * Inicializa validação e máscara do CPF
     */
    initializeValidation() {
        CPFValidator.applyMask(this.cpfInput);
    }
    
    /**
     * Manipula o envio do formulário
     */
    async handleSubmit() {
        // Previne múltiplas consultas simultâneas
        if (this.isConsulting) {
            console.log('⚠️ Consulta já em andamento. Aguarde...');
            return;
        }

        // Valida o CPF
        if (!CPFValidator.validateWithUI(this.cpfInput, this.cpfError)) {
            return;
        }
        
        const cpf = this.cpfInput.value;
        console.log('🔍 Iniciando consulta para CPF:', cpf);
        
        // Marca como consultando
        this.isConsulting = true;
        
        // Mostra loading
        this.showLoading();
        
        try {
            // Faz a consulta (apenas UMA vez)
            const resultado = await this.api.consultarCPF(cpf);
            
            if (resultado.success) {
                this.showResult(resultado.data);
                console.log('✅ Consulta realizada com sucesso');
            } else {
                this.showError(resultado.error);
                console.log('❌ Erro na consulta:', resultado.error);
            }
        } catch (error) {
            console.error('Erro inesperado:', error);
            this.showError('Erro inesperado. Tente novamente mais tarde.');
        } finally {
            // Libera para nova consulta
            this.isConsulting = false;
        }
    }
    
    /**
     * Mostra o estado de loading
     */
    showLoading() {
        this.searchBtn.disabled = true;
        this.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Consultando...';
        
        this.resultsSection.classList.add('show');
        this.loadingSpinner.style.display = 'block';
        this.resultCard.classList.remove('show');
        this.errorCard.classList.remove('show');
        
        // Scroll suave para a seção de resultados
        this.resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    /**
     * Mostra o resultado da consulta
     * @param {Object} data - Dados do CPF
     */
    showResult(data) {
        this.hideLoading();
        
        // Monta o HTML do resultado
        const resultHTML = this.buildResultHTML(data);
        this.resultContent.innerHTML = resultHTML;
        
        // Mostra o card de resultado com animação
        this.resultCard.classList.add('show', 'fade-in');
        this.errorCard.classList.remove('show');
    }
    
    /**
     * Mostra erro da consulta
     * @param {string} errorMessage - Mensagem de erro
     */
    showError(errorMessage) {
        this.hideLoading();
        
        this.errorContent.innerHTML = `
            <p><strong>Erro:</strong> ${errorMessage}</p>
            <p>Verifique o CPF informado e tente novamente.</p>
        `;
        
        // Mostra o card de erro com animação
        this.errorCard.classList.add('show', 'fade-in');
        this.resultCard.classList.remove('show');
    }
    
    /**
     * Esconde o loading e restaura o botão
     */
    hideLoading() {
        this.searchBtn.disabled = false;
        this.searchBtn.innerHTML = '<i class="fas fa-search"></i> Consultar';
        this.loadingSpinner.style.display = 'none';
    }
    
    /**
     * Constrói o HTML do resultado
     * @param {Object} data - Dados do CPF
     * @returns {string} - HTML formatado
     */
    buildResultHTML(data) {
        const situacaoClass = this.getSituacaoClass(data.situacao);
        
        return `
            <div class="result-item">
                <strong>CPF:</strong>
                <span>${CPFValidator.format(data.cpf)}</span>
            </div>
            
            <div class="result-item">
                <strong>Nome:</strong>
                <span>${data.nome}</span>
            </div>
            
            <div class="result-item">
                <strong>Situação:</strong>
                <span class="${situacaoClass}">${data.situacao}</span>
            </div>
            
            <div class="alert-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>ATENÇÃO:</strong> Este CPF possui débitos pendentes na Receita Federal. 
                É recomendado regularizar a situação o mais rápido possível para evitar 
                bloqueios e multas adicionais.
            </div>
            
            ${data.dataNascimento !== 'Não informado' ? `
            <div class="result-item">
                <strong>Data de Nascimento:</strong>
                <span>${data.dataNascimento}</span>
            </div>
            ` : ''}
            
            ${data.mae !== 'Não informado' ? `
            <div class="result-item">
                <strong>Nome da Mãe:</strong>
                <span>${data.mae}</span>
            </div>
            ` : ''}
            
            ${data.rg !== 'Não informado' ? `
            <div class="result-item">
                <strong>RG:</strong>
                <span>${data.rg}</span>
            </div>
            ` : ''}
            
            ${this.buildEnderecoHTML(data.endereco)}
            
            ${data.telefones.length > 0 ? `
            <div class="result-item">
                <strong>Telefones:</strong>
                <span>${data.telefones.join(', ')}</span>
            </div>
            ` : ''}
            
            ${data.emails.length > 0 ? `
            <div class="result-item">
                <strong>Emails:</strong>
                <span>${data.emails.join(', ')}</span>
            </div>
            ` : ''}
            
        `;
    }
    
    /**
     * Constrói HTML do endereço se disponível
     * @param {Object} endereco - Dados do endereço
     * @returns {string} - HTML do endereço
     */
    buildEnderecoHTML(endereco) {
        if (!endereco || endereco.logradouro === 'Não informado') {
            return '';
        }
        
        const enderecoCompleto = [
            endereco.logradouro,
            endereco.numero !== 'Não informado' ? endereco.numero : '',
            endereco.complemento,
            endereco.bairro !== 'Não informado' ? endereco.bairro : '',
            endereco.cidade !== 'Não informado' ? endereco.cidade : '',
            endereco.uf !== 'Não informado' ? endereco.uf : '',
            endereco.cep !== 'Não informado' ? `CEP: ${endereco.cep}` : ''
        ].filter(item => item && item.trim()).join(', ');
        
        return enderecoCompleto ? `
            <div class="result-item">
                <strong>Endereço:</strong>
                <span>${enderecoCompleto}</span>
            </div>
        ` : '';
    }
    
    /**
     * Retorna a classe CSS baseada na situação do CPF
     * @param {string} situacao - Situação do CPF
     * @returns {string} - Classe CSS
     */
    getSituacaoClass(situacao) {
        const situacaoLower = situacao.toLowerCase();
        if (situacaoLower.includes('regular') || situacaoLower.includes('ativo')) {
            return 'status-valid';
        } else if (situacaoLower.includes('irregular') || situacaoLower.includes('suspenso')) {
            return 'status-invalid';
        }
        return '';
    }
    
    /**
     * Testa a API ao carregar a página (DESABILITADO)
     */
    async testAPI() {
        console.log('🔧 Teste automático de API desabilitado para economizar créditos');
        console.log('💡 A API será testada apenas quando você fizer uma consulta real');
        
        // Mostra estatísticas das chaves API
        const stats = this.api.getApiKeysStats();
        console.log('📊 Estatísticas das Chaves API:');
        console.log(`   • Total de chaves: ${stats.totalKeys}`);
        console.log(`   • Limite diário estimado: ${stats.estimatedDailyLimit} consultas`);
        console.log(`   • Próxima chave a ser usada: #${stats.nextKeyToUse}`);
        console.log('🔄 Sistema de rotação ativo - cada consulta usará uma chave diferente');
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const app = new CPFApp();
    
    // Testa a API (opcional, para debug)
    app.testAPI();
    
    // Torna a instância disponível globalmente para debug
    window.cpfApp = app;
});
