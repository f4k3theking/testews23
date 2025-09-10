exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'text/html'
  };

  try {
    // Configurações AmloPay
    const publicKey = 'murillot2004_f443f52tx77685f5';
    const secretKey = '5gu5mbg909m53xs9cph9kb08dftavp2zyuzq7j05cm1uf20cuykqrxeq00dpprce';

    // URLs para testar
    const urlsToTest = [
      'https://app.amplopay.com/api/v1/payments',
      'https://app.amplopay.com/api/v1/charges',
      'https://app.amplopay.com/api/v1/pix'
    ];

    const testPayload = {
      amount: 10.00,
      currency: 'BRL',
      payment_method: 'pix',
      description: 'Teste PIX - Doação Moçambique',
      customer: {
        name: 'Teste',
        email: 'teste@teste.com',
        document: '00000000000'
      },
      notification_url: 'https://vakinhadaafrica.site/webhook',
      return_url: 'https://vakinhadaafrica.site'
    };

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Teste da API AmloPay</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { background: white; padding: 20px; border-radius: 8px; }
            pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }
            .success { color: #28a745; }
            .error { color: #dc3545; }
            .info { color: #007bff; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🧪 Teste da API AmloPay</h1>
            <p><strong>Testando conectividade com:</strong></p>
            <ul>
                <li>Public Key: ${publicKey}</li>
                <li>Secret Key: ${secretKey.substring(0, 20)}...</li>
            </ul>
    `;

    for (const url of urlsToTest) {
      html += `
        <hr>
        <h3 class="info">📡 Testando: ${url}</h3>
      `;

      try {
        // Teste 1: Bearer Token
        const response1 = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${secretKey}`,
            'X-Public-Key': publicKey
          },
          body: JSON.stringify(testPayload)
        });

        const result1 = await response1.text();
        
        html += `
          <h4>🔑 Teste com Bearer Token:</h4>
          <p><strong>Status:</strong> ${response1.status}</p>
          <pre>${result1.substring(0, 500)}${result1.length > 500 ? '...' : ''}</pre>
        `;

        if (response1.ok) {
          html += `<p class="success">✅ Conexão bem-sucedida!</p>`;
        } else {
          html += `<p class="error">❌ Erro na conexão</p>`;
        }

      } catch (error) {
        html += `
          <h4>🔑 Teste com Bearer Token:</h4>
          <p class="error">❌ Erro: ${error.message}</p>
        `;
      }

      try {
        // Teste 2: Basic Auth
        const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
        const response2 = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Basic ${auth}`
          },
          body: JSON.stringify(testPayload)
        });

        const result2 = await response2.text();
        
        html += `
          <h4>🔐 Teste com Basic Auth:</h4>
          <p><strong>Status:</strong> ${response2.status}</p>
          <pre>${result2.substring(0, 500)}${result2.length > 500 ? '...' : ''}</pre>
        `;

        if (response2.ok) {
          html += `<p class="success">✅ Conexão bem-sucedida!</p>`;
        } else {
          html += `<p class="error">❌ Erro na conexão</p>`;
        }

      } catch (error) {
        html += `
          <h4>🔐 Teste com Basic Auth:</h4>
          <p class="error">❌ Erro: ${error.message}</p>
        `;
      }
    }

    html += `
        <hr>
        <h3>📋 Próximos Passos:</h3>
        <ol>
          <li>Se algum teste retornou status 200-201: ✅ API funcionando</li>
          <li>Se todos falharam: ❌ Verificar credenciais na AmloPay</li>
          <li>Testar geração de PIX real em: <a href="/test_integration.html">test_integration.html</a></li>
        </ol>
        </div>
    </body>
    </html>
    `;

    return {
      statusCode: 200,
      headers,
      body: html
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: `<h1>Erro</h1><p>${error.message}</p>`
    };
  }
};
