# **Descrição**
   Estamos com um problema grande de desempenho no mobile, precisamos resolver isso. 

# **O que usar**

## Muito importante seguir o copilot instructions, ele é imprescindível. 

## Instruções do gemini
   Ótimo, adicionar uma API Key para o seu webhook do Make.com é a decisão correta para a segurança.

Para implementar isso, você precisa fazer duas pequenas alterações:

1.  **Em `modal.js`:** Ensinar a função `sendDataToWebhook` a *enviar* a chave no cabeçalho (header) da requisição.
2.  **Em `index.html`:** Adicionar a sua nova API Key às opções do modal para que o script possa usá-la.

(Ignorei o arquivo `ProximoPasso.md` como solicitado).

-----

### ✅ Passo 1: Atualize o `LandingPageOlimpo/modal.js`

Abra o seu `modal.js` e modifique a função `sendDataToWebhook` (por volta da linha 201) para incluir a API Key no `headers` do `fetch`.

**Substitua esta função:**

```javascript
  async sendDataToWebhook(data) {
    // A URL do webhook do Make.com
    const webhookURL = this.options.webhookURL;

    if (!webhookURL) {
      console.error('❌ URL do Webhook não definida!');
      throw new Error('Webhook URL not set');
    }

    console.log(`🚀 Enviando dados para: ${webhookURL}`);

    // Envia os dados e aguarda a resposta
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Se o Make.com der erro, isso vai falhar
    if (!response.ok) {
      console.error('❌ Falha no envio do webhook', await response.text());
      throw new Error('Webhook send failed');
    }

    console.log('✅ Webhook retornou sucesso (HTTP 200)');
    return response;
  }
```

**Por esta nova versão:**

```javascript
  async sendDataToWebhook(data) {
    const webhookURL = this.options.webhookURL;
    const apiKey = this.options.webhookApiKey; // <-- 1. PEGA A NOVA CHAVE

    if (!webhookURL) {
      console.error('❌ URL do Webhook não definida!');
      throw new Error('Webhook URL not set');
    }

    // 2. CRIA O OBJETO DE HEADERS
    const headers = {
      'Content-Type': 'application/json',
    };

    // 3. ADICIONA A CHAVE DE AUTORIZAÇÃO (SE ELA EXISTIR)
    if (apiKey) {
      // O nome do header mais comum é 'Authorization'. 
      // Se o seu webhook espera um nome diferente (ex: 'X-API-Key' ou 'Token'), 
      // apenas troque 'Authorization' abaixo.
      headers['Authorization'] = apiKey;
    }

    console.log(`🚀 Enviando dados para: ${webhookURL}`);

    // 4. ENVIA A REQUISIÇÃO COM OS NOVOS HEADERS
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: headers, // <-- USA O OBJETO ATUALIZADO
      body: JSON.stringify(data),
    });

    // Se o Make.com der erro, isso vai falhar
    if (!response.ok) {
      console.error('❌ Falha no envio do webhook', await response.text());
      throw new Error('Webhook send failed');
    }

    console.log('✅ Webhook retornou sucesso (HTTP 200)');
    return response;
  }
```

-----

### ✅ Passo 2: Adicione a Chave no `LandingPageOlimpo/index.html`

Agora, vá até onde você chama `createModal` (por volta da linha 591) e adicione a nova opção `webhookApiKey` com a sua chave.

```javascript
  <script>
    const natalModal = createModal({
      id: 'natalModal',
      title: '🎄 Garanta seu Natal Pago pelo Sol',
      description: 'Preencha seus dados e receba sua simulação gratuita. Após o envio, você será redirecionado para o grupo exclusivo no WhatsApp, onde revelaremos a condição especial da Olimpo Energia.',
      
      // URL do Webhook do Make.com
      webhookURL: 'https://hook.us2.make.com/qou9qw1wx7ajg8hpobin1kshbk614f8j',
      
      // --- ADICIONE SUA CHAVE AQUI ---
      webhookApiKey: 'COLE_A_SUA_CHAVE_API_AQUI',
      // ---------------------------------
      
      fields: [
        {
          name: 'nomeCompleto',
          label: 'Nome completo',
// ... resto do seu código ...
```

-----

### ⚠️ Observações Importantes (Erros que Encontrei)

Enquanto analisava seus arquivos, notei dois problemas que você precisa corrigir:

1.  **(Erro de Performance)** No seu `index.html`, você adicionou `loading="lazy"` ao seu **LOGO principal** no header. Você **NÃO** deve fazer isso. O logo é a primeira coisa que o usuário vê e precisa carregar imediatamente. Remova o `loading="lazy"` apenas desta imagem:

    ```html
    <img src="images/LOGO.svg" alt="Logo Olimpo">
    ```

    
## **Api key**
   ZFc6xlT^^x1Mq#Z£@eX'OJIy|60{>"H*@-0s-c<;&}z2=zM:'H