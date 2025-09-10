exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Permitir requisições OPTIONS para CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Verificar se é POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Método não permitido' })
    };
  }

  try {
    // Configurações
    const SECRET_KEY = '5gu5mbg909m53xs9cph9kb08dftavp2zyuzq7j05cm1uf20cuykqrxeq00dpprce';

    // Log da requisição recebida
    console.log("=== WEBHOOK RECEBIDO ===");
    console.log("Método:", event.httpMethod);
    console.log("Headers:", JSON.stringify(event.headers));
    console.log("Body:", event.body);
    
    if (!event.body) {
      console.log("Body vazio");
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Body vazio' })
      };
    }
    
    // Decodificar JSON
    const data = JSON.parse(event.body);
    console.log("Dados decodificados:", JSON.stringify(data, null, 2));
    
    // Verificar assinatura se fornecida
    const signature = event.headers['x-signature'] || event.headers['X-Signature'];
    
    if (signature) {
      // Verificar assinatura da AmloPay
      const crypto = require('crypto');
      const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(event.body).digest('hex');
      if (expectedSignature !== signature) {
        console.log(`Assinatura inválida. Esperada: ${expectedSignature}, Recebida: ${signature}`);
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Assinatura inválida' })
        };
      }
      console.log("Assinatura válida");
    } else {
      console.log("Nenhuma assinatura encontrada nos headers");
    }
    
    // Processar evento
    const eventType = data.event || data.type || data.status || 'unknown';
    const paymentId = data.payment_id || data.id || data.transaction_id || null;
    const status = data.status || data.payment_status || null;
    const amount = data.amount || data.value || null;
    
    console.log(`Evento: ${eventType}, Payment ID: ${paymentId}, Status: ${status}, Valor: ${amount}`);
    
    // Processar diferentes tipos de eventos
    switch (eventType) {
      case 'payment.completed':
      case 'payment.approved':
      case 'approved':
      case 'paid':
        console.log(`PAGAMENTO APROVADO! ID: ${paymentId}`);
        await processApprovedPayment(paymentId, amount, data);
        break;
        
      case 'payment.pending':
      case 'pending':
        console.log(`Pagamento pendente: ${paymentId}`);
        break;
        
      case 'payment.failed':
      case 'payment.cancelled':
      case 'failed':
      case 'cancelled':
        console.log(`Pagamento falhou/cancelado: ${paymentId}`);
        break;
        
      default:
        console.log(`Evento desconhecido: ${eventType}`);
    }
    
    // Responder com sucesso
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'success',
        message: 'Webhook processado com sucesso',
        event_type: eventType,
        payment_id: paymentId
      })
    };
    
  } catch (error) {
    console.error("ERRO:", error.message);
    console.error("Stack trace:", error.stack);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Erro interno do servidor'
      })
    };
  }
};

// Função para processar pagamento aprovado
async function processApprovedPayment(paymentId, amount, fullData) {
  console.log("=== PROCESSANDO PAGAMENTO APROVADO ===");
  console.log(`Payment ID: ${paymentId}`);
  console.log(`Valor: ${amount}`);
  
  // No Netlify, não podemos escrever arquivos, então vamos usar:
  // 1. Console logs (visíveis no painel Netlify)
  // 2. Integração com serviços externos (email, banco de dados, etc.)
  
  console.log(`✅ QUITAÇÃO DE DÍVIDA CONFIRMADA: R$ ${amount} - ID: ${paymentId}`);
  
  // Log detalhado para nossa página Serasa
  console.log(`📋 DETALHES DO PAGAMENTO:`);
  console.log(`- Cliente: ${fullData.client?.name || 'N/A'}`);
  console.log(`- CPF: ${fullData.client?.document || 'N/A'}`);
  console.log(`- Valor: R$ ${amount}`);
  console.log(`- Status: APROVADO`);
  console.log(`- Data: ${new Date().toISOString()}`);
  
  // Aqui você pode integrar com:
  // - Airtable (como banco de dados)
  // - SendGrid (para emails)
  // - Zapier (para automações)
  // - Google Sheets (para planilhas)
  
  return true;
}
