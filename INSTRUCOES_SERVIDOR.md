# 🚀 Instruções para Executar o Typebot

## ⚠️ Problema dos Áudios

Os erros de CORS que você está vendo são **normais** quando o arquivo HTML é aberto diretamente no navegador (protocolo `file://`). O navegador bloqueia o acesso aos arquivos de áudio por questões de segurança.

## ✅ Soluções

### **Opção 1: Servidor Local (Recomendado)**

1. **Abra o terminal/prompt** na pasta do projeto
2. **Execute um dos comandos abaixo:**

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (se tiver instalado)
npx http-server

# PHP (se tiver instalado)
php -S localhost:8000
```

3. **Acesse no navegador:**
   - `http://localhost:8000/typebot.html`

### **Opção 2: Extensão do Chrome**

1. **Instale a extensão "Live Server"** no Chrome
2. **Clique com botão direito** no arquivo `typebot.html`
3. **Selecione "Open with Live Server"**

### **Opção 3: VS Code**

1. **Instale a extensão "Live Server"** no VS Code
2. **Clique com botão direito** no arquivo `typebot.html`
3. **Selecione "Open with Live Server"**

## 🎵 Sobre os Áudios

- **Com servidor local:** Os áudios funcionam perfeitamente
- **Sem servidor:** Aparece um placeholder visual (🎵 Áudio: nome.mp3)
- **O fluxo continua funcionando** em ambos os casos

## 📁 Estrutura de Arquivos

```
busca cpf/
├── typebot.html
├── typebot-script.js
├── typebot-styles.css
├── typebot audios/
│   ├── analise primeiro audio.mp3
│   └── segundo audio.mp3
└── typebot images/
    ├── ultimo dia.png
    └── score.png
```

## 🔧 Correções Implementadas

- ✅ **Removido `crossOrigin`** que causava erros de CORS
- ✅ **Mudado `preload`** para `metadata` (mais seguro)
- ✅ **Fallback visual** quando áudio não carrega
- ✅ **Logs informativos** no console
- ✅ **Tratamento de erros** melhorado

## 🎯 Resultado

- **Sem erros no console** quando usando servidor local
- **Fluxo completo funcionando** em ambos os casos
- **Experiência visual consistente** mesmo sem áudio
