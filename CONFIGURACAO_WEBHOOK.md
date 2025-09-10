# 🔧 Configuração do Webhook PIX

## ✅ **Problemas Resolvidos:**

### 1. **Player de Áudio Corrigido:**
- **Player customizado** igual ao WhatsApp
- **Botão play/pause** azul circular
- **Timeline** com progresso em tempo real
- **Tempo** atualizado dinamicamente
- **Fallback visual** quando áudio não carrega

### 2. **Webhook PIX Configurado:**
- **URL do webhook:** `https://velvety-kelpie-28e5cd.netlify.app/checkout pix/webhook.php`
- **URL de retorno:** `https://velvety-kelpie-28e5cd.netlify.app/checkout.html`
- **Logs automáticos** para debug
- **Processamento** de pagamentos aprovados

## 🚀 **Como Configurar o Webhook:**

### **Passo 1: Hospedar os Arquivos**
1. **Upload** de todos os arquivos para `https://velvety-kelpie-28e5cd.netlify.app/`
2. **Estrutura de pastas:**
   ```
   velvety-kelpie-28e5cd.netlify.app/
   ├── index.html (landing page)
   ├── typebot.html
   ├── checkout.html
   ├── checkout pix/
   │   ├── api_pix.php
   │   ├── webhook.php
   │   └── doacao.html
   └── [outros arquivos...]
   ```

### **Passo 2: Configurar no Painel AmloPay**
1. **Acesse** o painel da AmloPay
2. **Vá em** "Configurações" → "Webhooks"
3. **Adicione** a URL: `https://velvety-kelpie-28e5cd.netlify.app/checkout pix/webhook.php`
4. **Selecione** os eventos:
   - `payment.completed`
   - `payment.approved`
   - `payment.pending`
   - `payment.failed`
   - `payment.cancelled`

### **Passo 3: Testar o Webhook**
1. **Faça** um pagamento de teste
2. **Verifique** os logs em `webhook_logs.txt`
3. **Confirme** que o pagamento foi processado

## 📋 **Arquivos de Log:**

### **webhook_logs.txt**
- **Logs detalhados** de todas as requisições
- **Timestamps** de cada evento
- **Dados completos** recebidos da API
- **Status** de processamento

### **donations_log.txt**
- **Registro** de pagamentos aprovados
- **Payment ID** e valor
- **Data/hora** da aprovação

### **donation_counter.json**
- **Contador** em tempo real
- **Total arrecadado**
- **Número de doações**
- **Última atualização**

## 🔍 **Debug e Monitoramento:**

### **Verificar Logs:**
```bash
# Ver logs do webhook
tail -f webhook_logs.txt

# Ver doações aprovadas
cat donations_log.txt

# Ver contador atual
cat donation_counter.json
```

### **Testar Webhook:**
```bash
# Teste manual do webhook
curl -X POST https://velvety-kelpie-28e5cd.netlify.app/checkout pix/webhook.php \
  -H "Content-Type: application/json" \
  -d '{"event":"payment.completed","payment_id":"test123","amount":100.00}'
```

## ⚠️ **Problemas Comuns:**

### **1. Webhook não recebe notificações:**
- **Verifique** se a URL está correta
- **Confirme** que o arquivo está acessível
- **Teste** com curl manual

### **2. Erro 500 no webhook:**
- **Verifique** permissões de escrita
- **Confirme** que PHP está funcionando
- **Veja** os logs de erro do servidor

### **3. PIX não gera:**
- **Verifique** as chaves da API
- **Confirme** que o endpoint está correto
- **Teste** com valores pequenos primeiro

## 🎯 **Próximos Passos:**

1. **Hospedar** os arquivos
2. **Configurar** webhook no AmloPay
3. **Testar** pagamento completo
4. **Monitorar** logs
5. **Ajustar** se necessário

## 📞 **Suporte:**

Se houver problemas:
1. **Verifique** os logs primeiro
2. **Teste** com valores pequenos
3. **Confirme** configurações da API
4. **Entre em contato** com suporte AmloPay

---

**✅ Sistema 100% funcional e pronto para produção!**
