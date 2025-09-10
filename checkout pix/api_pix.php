<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Permitir requisições OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configurações da API AmloPay
$AMPLO_PAY_CONFIG = [
    'public_key' => 'murillot2004_f443f52tx77685f5',
    'secret_key' => '5gu5mbg909m53xs9cph9kb08dftavp2zyuzq7j05cm1uf20cuykqrxeq00dpprce',
    'base_url' => 'https://app.amplopay.com/api/v1'
];

try {
    // Verificar se é POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método não permitido', 405);
    }

    // Ler dados JSON da requisição
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception('Dados inválidos', 400);
    }

    // Validar valor
    $amount = floatval($data['amount'] ?? 0);
    if ($amount <= 0) {
        throw new Exception('Valor inválido', 400);
    }

    // Extrair dados do cliente (se fornecidos)
    $customerName = $data['customer_name'] ?? 'Cliente';
    $customerCpf = $data['customer_cpf'] ?? '00000000000';
    $description = $data['description'] ?? "Quitação de dívidas - R$ " . number_format($amount, 2, ',', '.');
    
    // Preparar dados para a API AmloPay conforme documentação
    $payload = [
        'amount' => $amount, // Valor em reais
        'currency' => 'BRL',
        'payment_method' => 'pix',
        'description' => $description,
        'customer' => [
            'name' => $customerName,
            'email' => 'cliente@serasa.com',
            'document' => $customerCpf
        ],
        'notification_url' => 'https://velvety-kelpie-28e5cd.netlify.app/checkout pix/webhook.php',
        'return_url' => 'https://velvety-kelpie-28e5cd.netlify.app/checkout.html'
    ];

    // Configurar cURL para chamada à API
    $ch = curl_init();
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $AMPLO_PAY_CONFIG['base_url'] . '/payments',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Bearer ' . $AMPLO_PAY_CONFIG['secret_key'],
            'X-Public-Key: ' . $AMPLO_PAY_CONFIG['public_key']
        ],
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_USERAGENT => 'VakinhaAfrica/1.0'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    curl_close($ch);

    // Log da resposta para debug
    error_log("AmloPay Response: " . $response);
    error_log("HTTP Code: " . $httpCode);
    
    // Verificar se houve erro na requisição
    if ($error) {
        throw new Exception('Erro na conexão: ' . $error, 500);
    }

    // Decodificar resposta
    $result = json_decode($response, true);
    
    // Se não conseguiu decodificar JSON, significa que retornou HTML/texto
    if (!$result) {
        // Log da resposta HTML para debug
        error_log("Resposta não-JSON: " . substr($response, 0, 500));
        throw new Exception('API retornou resposta inválida (não-JSON). Verifique as credenciais e endpoint.', 500);
    }

    if ($httpCode !== 200 && $httpCode !== 201) {
        $errorMessage = $result['message'] ?? $result['error'] ?? $result['errors'] ?? 'Erro desconhecido na API';
        throw new Exception('Erro da API AmloPay (HTTP ' . $httpCode . '): ' . json_encode($errorMessage), $httpCode);
    }

    // Verificar se a resposta contém os dados necessários conforme estrutura AmloPay
    if (!$result || (!isset($result['id']) && !isset($result['payment_id']) && !isset($result['data']))) {
        throw new Exception('Resposta da API não contém dados da transação: ' . json_encode($result), 500);
    }

    // Extrair dados do PIX - adaptar conforme estrutura real da AmloPay
    $paymentData = $result['data'] ?? $result;
    $pixQrCode = $paymentData['qr_code'] ?? $paymentData['qr_code_url'] ?? $paymentData['pix']['qr_code'] ?? null;
    $pixCode = $paymentData['pix_code'] ?? $paymentData['copy_paste'] ?? $paymentData['pix']['copy_paste'] ?? null;
    $paymentId = $paymentData['id'] ?? $paymentData['payment_id'] ?? $result['id'];
    $status = $paymentData['status'] ?? 'pending';

    // Retornar resposta de sucesso
    echo json_encode([
        'success' => true,
        'payment_id' => $paymentId,
        'amount' => $amount,
        'pix_qr_code' => $pixQrCode,
        'pix_code' => $pixCode,
        'status' => $status,
        'expires_at' => $result['expires_at'] ?? null,
        'message' => 'PIX gerado com sucesso!',
        'debug' => [
            'http_code' => $httpCode,
            'raw_response' => $result // Para debug
        ]
    ]);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'code' => $e->getCode()
    ]);
}
?>
