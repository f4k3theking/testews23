/**
 * Módulo de Validação de CPF
 * Contém funções para validar e formatar CPF
 */

class CPFValidator {
    /**
     * Valida se um CPF é válido
     * @param {string} cpf - CPF para validar (com ou sem formatação)
     * @returns {boolean} - true se válido, false caso contrário
     */
    static isValid(cpf) {
        if (!cpf) return false;
        
        // Remove formatação
        cpf = cpf.replace(/[^\d]/g, '');
        
        // Verifica se tem 11 dígitos
        if (cpf.length !== 11) return false;
        
        // Verifica se não são todos dígitos iguais
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        // Validação do primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        // Validação do segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }
    
    /**
     * Formata um CPF adicionando pontos e hífen
     * @param {string} cpf - CPF sem formatação
     * @returns {string} - CPF formatado
     */
    static format(cpf) {
        if (!cpf) return '';
        
        // Remove formatação existente
        cpf = cpf.replace(/[^\d]/g, '');
        
        // Aplica formatação
        if (cpf.length <= 3) {
            return cpf;
        } else if (cpf.length <= 6) {
            return cpf.replace(/(\d{3})(\d+)/, '$1.$2');
        } else if (cpf.length <= 9) {
            return cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
        } else {
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
    }
    
    /**
     * Remove formatação do CPF
     * @param {string} cpf - CPF formatado
     * @returns {string} - CPF apenas com números
     */
    static clean(cpf) {
        if (!cpf) return '';
        return cpf.replace(/[^\d]/g, '');
    }
    
    /**
     * Aplica máscara de CPF em tempo real durante a digitação
     * @param {HTMLInputElement} input - Elemento input
     */
    static applyMask(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value;
            let formattedValue = CPFValidator.format(value);
            
            // Atualiza o valor apenas se mudou para evitar problemas de cursor
            if (formattedValue !== value) {
                e.target.value = formattedValue;
            }
        });
        
        // Permite apenas números, pontos e hífen
        input.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[\d.-]/.test(char) && e.which !== 8 && e.which !== 0) {
                e.preventDefault();
            }
        });
    }
    
    /**
     * Valida CPF e mostra erro visual no input
     * @param {HTMLInputElement} input - Elemento input
     * @param {HTMLElement} errorElement - Elemento para mostrar erro
     * @returns {boolean} - true se válido
     */
    static validateWithUI(input, errorElement) {
        const cpf = input.value;
        const isValid = this.isValid(cpf);
        
        if (!cpf.trim()) {
            this.showError(input, errorElement, 'CPF é obrigatório');
            return false;
        }
        
        if (!isValid) {
            this.showError(input, errorElement, 'CPF inválido');
            return false;
        }
        
        this.hideError(input, errorElement);
        return true;
    }
    
    /**
     * Mostra erro visual
     */
    static showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    /**
     * Remove erro visual
     */
    static hideError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

// Torna disponível globalmente
window.CPFValidator = CPFValidator;
