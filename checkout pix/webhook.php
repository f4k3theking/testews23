<?php
// Webhook para receber notificações da AmloPay sobre status dos pagamentos
header('Content-Type: application/json');

// Configurações
$SECRET_KEY = '5gu5mbg909m53xs9cph9kb08dftavp2zyuzq7j05cm1uf20cuykqrxeq00dpprce';
$LOG_FILE = 'webhook_logs.txt';

// Função para log
function logWebhook($message) {
    global $LOG_FILE;
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[{$timestamp}] {$message}" . PHP_EOL;
    file_put_contents($LOG_FILE, $logMessage, FILE_APPEND | LOCK_EX);
}

try {
    // Log da requisição recebida
    logWebhook("=== WEBHOOK RECEBIDO ===");
    logWebhook("Método: " . $_SERVER['REQUEST_METHOD']);
    logWebhook("Headers: " . json_encode(getallheaders()));
    
    // Verificar se é POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        logWebhook("Método inválido: " . $_SERVER['REQUEST_METHOD']);
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
        exit();
    }
    
    // Ler dados da requisição
    $input = file_get_contents('php://input');
    logWebhook("Body recebido: " . $input);
    
    if (empty($input)) {
        logWebhook("Body vazio");
        http_response_code(400);
        echo json_encode(['error' => 'Body vazio']);
        exit();
    }
    
    // Decodificar JSON
    $data = json_decode($input, true);
    
    if (!$data) {
        logWebhook("JSON inválido: " . json_last_error_msg());
        http_response_code(400);
        echo json_encode(['error' => 'JSON inválido']);
        exit();
    }
    
    logWebhook("Dados decodificados: " . json_encode($data, JSON_PRETTY_PRINT));
    
    // Verificar assinatura/autenticação (se a AmloPay fornecer)
    $headers = getallheaders();
    $signature = $headers['X-Signature'] ?? $headers['x-signature'] ?? null;
    
    if ($signature) {
        // Verificar assinatura da AmloPay
        $expectedSignature = hash_hmac('sha256', $input, $SECRET_KEY);
        if (!hash_equals($expectedSignature, $signature)) {
            logWebhook("Assinatura inválida. Esperada: {$expectedSignature}, Recebida: {$signature}");
            http_response_code(401);
            echo json_encode(['error' => 'Assinatura inválida']);
            exit();
        }
        logWebhook("Assinatura válida");
    } else {
        logWebhook("Nenhuma assinatura encontrada nos headers");
    }
    
    // Processar evento baseado no tipo
    $eventType = $data['event'] ?? $data['type'] ?? $data['status'] ?? 'unknown';
    $paymentId = $data['payment_id'] ?? $data['id'] ?? $data['transaction_id'] ?? null;
    $status = $data['status'] ?? $data['payment_status'] ?? null;
    $amount = $data['amount'] ?? $data['value'] ?? null;
    
    logWebhook("Evento: {$eventType}, Payment ID: {$paymentId}, Status: {$status}, Valor: {$amount}");
    
    // Processar diferentes tipos de eventos
    switch ($eventType) {
        case 'payment.completed':
        case 'payment.approved':
        case 'approved':
        case 'paid':
            logWebhook("PAGAMENTO APROVADO! ID: {$paymentId}");
            // Aqui você pode:
            // - Atualizar banco de dados
            // - Enviar email de confirmação
            // - Atualizar contador de doações
            // - Notificar sistemas externos
            processApprovedPayment($paymentId, $amount, $data);
            break;
            
        case 'payment.pending':
        case 'pending':
            logWebhook("Pagamento pendente: {$paymentId}");
            break;
            
        case 'payment.failed':
        case 'payment.cancelled':
        case 'failed':
        case 'cancelled':
            logWebhook("Pagamento falhou/cancelado: {$paymentId}");
            break;
            
        default:
            logWebhook("Evento desconhecido: {$eventType}");
    }
    
    // Responder com sucesso
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Webhook processado com sucesso',
        'event_type' => $eventType,
        'payment_id' => $paymentId
    ]);
    
} catch (Exception $e) {
    logWebhook("ERRO: " . $e->getMessage());
    logWebhook("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro interno do servidor'
    ]);
}

// Função para processar pagamento aprovado
function processApprovedPayment($paymentId, $amount, $fullData) {
    logWebhook("=== PROCESSANDO PAGAMENTO APROVADO ===");
    logWebhook("Payment ID: {$paymentId}");
    logWebhook("Valor: {$amount}");
    
    // Aqui você pode implementar:
    
    // 1. Salvar no banco de dados
    // $pdo = new PDO('mysql:host=localhost;dbname=doacoes', $username, $password);
    // $stmt = $pdo->prepare("INSERT INTO donations (payment_id, amount, status, created_at) VALUES (?, ?, 'approved', NOW())");
    // $stmt->execute([$paymentId, $amount]);
    
    // 2. Atualizar arquivo de controle (exemplo simples)
    $donationsFile = 'donations_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "{$timestamp} | Payment ID: {$paymentId} | Valor: R$ {$amount} | Status: APROVADO" . PHP_EOL;
    file_put_contents($donationsFile, $logEntry, FILE_APPEND | LOCK_EX);
    
    // 3. Enviar notificação por email (opcional)
    // mail('admin@vakinhadaafrica.site', 'Nova Doação Recebida', "Pagamento de R$ {$amount} foi aprovado. ID: {$paymentId}");
    
    // 4. Atualizar contador em tempo real (se tiver)
    updateDonationCounter($amount);
    
    logWebhook("Pagamento processado com sucesso");
}

// Função para atualizar contador de doações
function updateDonationCounter($amount) {
    $counterFile = 'donation_counter.json';
    
    // Ler contador atual
    $currentData = ['total' => 0, 'count' => 0];
    if (file_exists($counterFile)) {
        $currentData = json_decode(file_get_contents($counterFile), true) ?: $currentData;
    }
    
    // Atualizar
    $currentData['total'] += floatval($amount);
    $currentData['count'] += 1;
    $currentData['last_update'] = date('Y-m-d H:i:s');
    
    // Salvar
    file_put_contents($counterFile, json_encode($currentData, JSON_PRETTY_PRINT));
    
    logWebhook("Contador atualizado: Total R$ {$currentData['total']}, Doações: {$currentData['count']}");
}

?>
