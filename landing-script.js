/**
 * Script da Landing Page
 * Gerencia modais e interações
 */

class LandingPage {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupModalHandlers();
    }

    initializeElements() {
        // Botões principais
        this.consultarBtn = document.getElementById('consultarBtn');
        this.saibaMaisBtn = document.getElementById('saibaMaisBtn');
        this.privacidadeBtn = document.getElementById('privacidadeBtn');
        this.termosBtn = document.getElementById('termosBtn');

        // Modais
        this.saibaMaisModal = document.getElementById('saibaMaisModal');
        this.privacidadeModal = document.getElementById('privacidadeModal');
        this.termosModal = document.getElementById('termosModal');

        // Botões de fechar
        this.closeSaibaMais = document.getElementById('closeSaibaMais');
        this.closePrivacidade = document.getElementById('closePrivacidade');
        this.closeTermos = document.getElementById('closeTermos');

        // Botões de fechar do footer dos modais
        this.closeButtons = document.querySelectorAll('.btn-close');
    }

    bindEvents() {
        // Botão Consultar Agora - redireciona para página de verificação
        this.consultarBtn.addEventListener('click', () => {
            console.log('Redirecionando para página de verificação...');
            window.location.href = 'redirect.html';
        });

        // Botão Saiba Mais
        this.saibaMaisBtn.addEventListener('click', () => {
            this.openModal(this.saibaMaisModal);
        });

        // Link Política de Privacidade
        this.privacidadeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal(this.privacidadeModal);
        });

        // Link Termos de Uso
        this.termosBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal(this.termosModal);
        });

        // Botões de fechar (X)
        this.closeSaibaMais.addEventListener('click', () => {
            this.closeModal(this.saibaMaisModal);
        });

        this.closePrivacidade.addEventListener('click', () => {
            this.closeModal(this.privacidadeModal);
        });

        this.closeTermos.addEventListener('click', () => {
            this.closeModal(this.termosModal);
        });

        // Botões de fechar do footer
        this.closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });
    }

    setupModalHandlers() {
        // Fechar modal clicando no fundo
        [this.saibaMaisModal, this.privacidadeModal, this.termosModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    openModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Previne scroll da página
        
        // Animação suave
        setTimeout(() => {
            modal.style.display = 'flex';
        }, 10);

        console.log('Modal aberto:', modal.id);
    }

    closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restaura scroll da página
        
        // Delay para a animação
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);

        console.log('Modal fechado:', modal.id);
    }

    closeAllModals() {
        [this.saibaMaisModal, this.privacidadeModal, this.termosModal].forEach(modal => {
            this.closeModal(modal);
        });
    }

    // Método para configurar redirecionamento do botão Consultar Agora
    setConsultarCallback(callback) {
        this.consultarBtn.removeEventListener('click', this.defaultConsultarHandler);
        this.consultarBtn.addEventListener('click', callback);
    }

    defaultConsultarHandler() {
        console.log('Botão Consultar Agora clicado - redirecionamento será implementado');
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const landingPage = new LandingPage();
    
    // Torna disponível globalmente para debug
    window.landingPage = landingPage;
    
    console.log('🚀 Landing Page inicializada com sucesso!');
});

// Efeitos visuais simples
document.addEventListener('DOMContentLoaded', () => {
    // Animação de entrada suave
    const mainSection = document.querySelector('.main-section');
    if (mainSection) {
        mainSection.style.opacity = '0';
        mainSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            mainSection.style.transition = 'all 0.5s ease';
            mainSection.style.opacity = '1';
            mainSection.style.transform = 'translateY(0)';
        }, 100);
    }
});
