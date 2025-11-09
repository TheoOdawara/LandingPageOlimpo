# **Descrição**
    Precisa ser resolvido de uma vez por todas, pesquisa na internet se for naecessário, mas é obrigatório que eu não peça  mais para você fazer isso. REsolve agora, definitivamente

# **O que usar**

## Muito importante seguir o copilot instructions, ele é imprescindível. 

## **Webhook**
    https://hook.us2.make.com/qou9qw1wx7ajg8hpobin1kshbk614f8j

## **Instruções do gemini**
        Sim, e peço desculpas por isso. O método do Google Forms é uma "gambiarra" que depende de tempo (`setTimeout`) e às vezes falha por causa do redirecionamento do WhatsApp (a "condição de corrida").

        Vamos abandonar esse método do Google Forms. A solução 100% gratuita e **confiável** é usar um **Webhook**, algo que você já tem experiência, pois vi no seu histórico que você usa o **Make.com**.

        ### 💡 A Solução Correta: Make.com (Webhook + Google Sheets)

        Este método é o padrão da indústria e é 100% confiável, pois vamos usar `async/await` no JavaScript. O navegador será **forçado** a esperar o envio dos dados antes de tentar abrir o WhatsApp.

        **O Fluxo será:**

        1.  **Make.com:** Você cria um "Webhook" que gera uma URL única.
        2.  **Make.com:** Esse webhook envia os dados para sua planilha Google Sheets.
        3.  **JavaScript:** O formulário no seu site envia os dados para a URL do webhook usando `fetch`.
        4.  **JavaScript:** O script *espera* (`await`) a resposta do Make.com.
        5.  **JavaScript:** **Somente após** confirmar o envio, ele abre o WhatsApp.

        -----

        ### ✅ Passo 1: Configurar o Cenário no Make.com

        Você já deve conhecer este processo:

        1.  Vá ao **Make.com** e crie um **Novo Cenário**.
        2.  Adicione um módulo **"Webhooks"** (o roxo) e escolha **"Custom webhook"**.
        3.  Clique em "Add", dê um nome (ex: "Leads Landing Page") e salve.
        4.  **Copie a URL do webhook** que ele gerou. (Guarde-a, você vai usar no Passo 3).
        5.  Clique em **"Run once"** (Executar uma vez) para que o webhook fique "escutando".

        *Não feche esta janela\!*

        -----

        ### ✅ Passo 2: "Ensinar" o Webhook (Envio de Teste)

        Agora, precisamos enviar dados de teste para o Make.com saber o que esperar.

        1.  Abra seu `index.html` (ou onde você chama `createModal`).
        2.  **Temporariamente**, cole a URL do Make.com no lugar da URL do Google Forms:
            ```javascript
            // ...
            // Configuração do Google Forms
            googleFormURL: 'COLE_A_URL_DO_MAKE_WEBHOOK_AQUI', // <--- TROQUE AQUI
            // ...
            ```
        3.  **Abra o seu site** (ex: `localhost` ou `vercel.app`) e **envie o formulário** uma vez com dados de teste.
        4.  Volte para a janela do Make.com. Você verá um "OK" (uma bolha verde) no módulo Webhook, indicando que ele recebeu os dados.

        -----

        ### ✅ Passo 3: Concluir o Cenário no Make.com

        1.  Agora que o Make.com sabe quais dados esperar (`nomeCompleto`, `whatsapp`, `cidade`), adicione um segundo módulo:
        2.  Clique no "+" e adicione **"Google Sheets"**.
        3.  Escolha a ação **"Add a Row"**.
        4.  Conecte sua conta do Google, selecione a Planilha ("LeadsCampanhaNatal") e a Página ("Leads").
        5.  Mapeie os campos:
            * **Coluna Nome Completo:** `1. nomeCompleto` (do webhook)
            * **Coluna WhatsApp:** `1. whatsapp` (do webhook)
            * **Coluna Cidade:** `1. cidade` (do webhook)
        6.  Dê "OK", salve o cenário e **ative-o** (no botão "Scheduling" ou "Ativar" no canto).

        O backend está pronto. Agora, a mudança final no front-end.

        -----

        ### ✅ Passo 4: Mudar o `modal.js` para usar `Fetch` (A Solução Definitiva)

        Este é o passo mais importante. Vamos mudar seu `modal.js` para que ele envie os dados via `fetch` (o método moderno) e não mais por gambiarras.

        1.  Abra seu `modal.js`.
        2.  **Substitua** a função `handleSubmit` inteira pela versão `async` abaixo.
        3.  **Substitua** a função `redirectToWhatsApp` inteira pela versão `async` abaixo.

        <!-- end list -->

        ```javascript
        // EM MODAL.JS

        // SUBSTITUA SEU HANDLE SUBMIT POR ESTE:
        async handleSubmit() {
            const form = document.getElementById(`${this.modalId}-form`);
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            console.log('Dados do formulário:', data);

            // Enviar evento de Lead para o Meta Pixel
            if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Natal Pago pelo Sol',
                content_category: 'Energia Solar',
                value: 0.00,
                currency: 'BRL'
            });
            }

            try {
            // Tenta enviar os dados e ESPERA (await) a conclusão
            await this.sendDataToWebhook(data);
            console.log('✅ Sucesso: Dados enviados ao webhook ANTES do redirecionamento.');

            // Só executa se o "await" acima funcionar
            if (this.options.whatsappGroupURL) {
                console.log('🚀 Abrindo WhatsApp em nova aba...');
                const newTab = window.open(this.options.whatsappGroupURL, '_blank');
                if (newTab) {
                newTab.focus();
                } else {
                console.warn('⚠️ O Pop-up do WhatsApp foi bloqueado pelo navegador.');
                }
            }

            } catch (error) {
            console.error('❌ ERRO CRÍTICO no envio do webhook:', error);
            // Opcional: mostrar um erro para o usuário
            // Mesmo com erro, ainda tenta redirecionar para o WhatsApp
            if (this.options.whatsappGroupURL) {
                window.open(this.options.whatsappGroupURL, '_blank');
            }
            }

            this.close();
            form.reset();
        }

        // ADICIONE ESTA NOVA FUNÇÃO (sendDataToWebhook)
        // (Pode substituir a antiga 'redirectToWhatsApp' por ela)
        async sendDataToWebhook(data) {
            // A URL do webhook agora é a única que importa
            const webhookURL = this.options.googleFormURL; // Sim, vamos manter o nome da opção

            if (!webhookURL) {
            console.error('❌ URL do Webhook (googleFormURL) não definida!');
            throw new Error('Webhook URL not set');
            }

            console.log(`🚀 Enviando dados para: ${webhookURL}`);

            // Isso é o que envia os dados.
            // O 'await' faz o JS parar e esperar a resposta.
            const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            });

            // Se o Make.com der erro (fora do ar, etc.), isso vai falhar
            if (!response.ok) {
            console.error('Falha no envio do webhook', await response.text());
            throw new Error('Webhook send failed');
            }

            // Se chegou aqui, o Make.com recebeu os dados (HTTP 200 OK)
            return response;
        }
        ```

        -----

        ### ✅ Passo 5: Atualizar a Chamada no `index.html`

        No seu `index.html`, você não precisa mais do `googleFormEntryMap`. Você só precisa da URL do webhook (que você já colou lá).

        ```javascript
        // EM INDEX.HTML

            const natalModal = createModal({
            id: 'natalModal',
            title: '🎄 Garanta seu Natal Pago pelo Sol',
            // ...
            
            // AQUI VAI A URL DO WEBHOOK DO MAKE.COM
            googleFormURL: 'https://hook.us1.make.com/SUA_URL_UNICA_AQUI',
            
            // NÃO PRECISA MAIS DISSO:
            // googleFormEntryMap: { ... }, 
            
            fields: [
                // ... seus campos (nomeCompleto, whatsapp, cidade)
            ],
            submitText: '👍 Entrar no grupo e garantir minha condição',
            whatsappGroupURL: 'https://chat.whatsapp.com/LJB6bLEHDSlF2GOdnjPjga'
            });
        ```

        Pronto. Esta é a solução definitiva, profissional e gratuita que resolve a condição de corrida e usa uma ferramenta que você já conhece (Make.com).