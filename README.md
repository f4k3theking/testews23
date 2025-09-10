# Sistema de Consulta CPF

Sistema profissional para consulta de dados via CPF utilizando a API CPF.

## 🚀 Características

- ✅ **Validação completa de CPF** - Algoritmo de validação dos dígitos verificadores
- 🎨 **Interface moderna e responsiva** - Design profissional com animações suaves
- 🔒 **Tratamento de erros robusto** - Mensagens claras para diferentes tipos de erro
- 📱 **Mobile-first** - Otimizado para todos os dispositivos
- ⚡ **Performance otimizada** - Carregamento rápido e requisições eficientes
- 🧩 **Código modular** - Estrutura organizada para fácil manutenção

## 📁 Estrutura do Projeto

```
busca-cpf/
├── index.html              # Página principal
├── styles.css              # Estilos e design responsivo
├── js/
│   ├── cpfValidator.js     # Módulo de validação de CPF
│   ├── cpfAPI.js          # Módulo de integração com API
│   └── app.js             # Aplicação principal
└── README.md              # Documentação
```

## 🛠️ Funcionalidades

### Validação de CPF
- Validação em tempo real durante digitação
- Formatação automática (000.000.000-00)
- Verificação dos dígitos verificadores
- Feedback visual de erros

### Consulta de Dados
- Integração com API CPF profissional
- Exibição completa dos dados encontrados
- Loading states durante consultas
- Tratamento de diferentes tipos de erro

### Interface do Usuário
- Design moderno e intuitivo
- Animações suaves
- Responsivo para mobile e desktop
- Estados visuais claros (loading, sucesso, erro)

## 🔧 Configuração

### Chave da API
A chave da API já está configurada no arquivo `js/cpfAPI.js`:
```javascript
this.apiKey = 'b598a1a65ed18db507f77bfddc79420ece5d9291b2ecd0851a035b091d1a30b4';
```

### Como usar
1. Abra o arquivo `index.html` em um navegador
2. Digite um CPF válido no campo de busca
3. Clique em "Consultar" para buscar os dados
4. Os resultados serão exibidos na tela

## 📊 Dados Retornados

O sistema pode retornar as seguintes informações:
- **CPF** - Número do documento formatado
- **Nome** - Nome completo da pessoa
- **Situação** - Status do CPF (Regular/Irregular)
- **Data de Nascimento** - Se disponível
- **Nome da Mãe** - Se disponível
- **RG** - Se disponível
- **Endereço** - Logradouro, número, bairro, cidade, UF, CEP
- **Telefones** - Lista de telefones cadastrados
- **Emails** - Lista de emails cadastrados

## 🎨 Personalização

### Cores e Tema
As cores principais podem ser alteradas no arquivo `styles.css`:
```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Cor de destaque */
border-color: #667eea;
```

### Campos de Dados
Para adicionar novos campos, edite a função `buildResultHTML()` em `js/app.js`.

## 🔌 Integração em Landing Page

### Método 1: Inclusão Direta
```html
<!-- Inclua os arquivos CSS e JS -->
<link rel="stylesheet" href="path/to/styles.css">
<script src="path/to/js/cpfValidator.js"></script>
<script src="path/to/js/cpfAPI.js"></script>
<script src="path/to/js/app.js"></script>

<!-- Adicione o HTML do formulário onde desejar -->
<div class="search-section">
    <!-- Conteúdo do formulário aqui -->
</div>
```

### Método 2: Instanciação Programática
```javascript
// Criar instância da API
const api = new CPFAPI();

// Consultar CPF programaticamente
const resultado = await api.consultarCPF('12345678901');

if (resultado.success) {
    console.log('Dados encontrados:', resultado.data);
} else {
    console.error('Erro:', resultado.error);
}
```

### Método 3: Validação Independente
```javascript
// Usar apenas o validador
const cpfValido = CPFValidator.isValid('123.456.789-01');
const cpfFormatado = CPFValidator.format('12345678901');
```

## 🚨 Tratamento de Erros

O sistema trata os seguintes cenários:
- **401** - Chave de API inválida
- **403** - Acesso negado
- **404** - CPF não encontrado
- **429** - Limite de consultas excedido
- **500** - Erro interno do servidor
- **Rede** - Problemas de conectividade

## 📱 Responsividade

O sistema é totalmente responsivo:
- **Desktop** - Layout completo com sidebar
- **Tablet** - Layout adaptado
- **Mobile** - Layout otimizado para toque

## ⚡ Performance

- Validação local antes de fazer requisições
- Debounce em validações em tempo real
- Lazy loading de componentes
- Otimizações de CSS e JavaScript

## 🔒 Segurança

- Validação tanto no frontend quanto na API
- Sanitização de dados de entrada
- Tratamento seguro de erros
- Headers de segurança configurados

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se a chave da API está correta
2. Teste a conectividade no console do navegador
3. Verifique se o CPF está sendo formatado corretamente

## 📝 Licença

Este projeto é de uso livre para fins educacionais e comerciais.
