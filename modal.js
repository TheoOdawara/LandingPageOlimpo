class Modal {
  constructor(options = {}) {
    this.options = {
      title: options.title || 'Modal',
      description: options.description || '',
      fields: options.fields || [],
      submitText: options.submitText || 'Enviar',
      whatsappNumber: options.whatsappNumber || '5567999999999',
      onSubmit: options.onSubmit || null,
      customMessage: options.customMessage || null,
      ...options
    };
    
    this.modalId = options.id || 'modal-' + Date.now();
    this.init();
  }

  init() {
    this.createModal();
    this.setupEventListeners();
  }

  createModal() {
    const modalHTML = `
      <div id="${this.modalId}" class="modal">
        <div class="modal-content">
          <span class="close" onclick="window.modalInstances['${this.modalId}'].close()">&times;</span>
          <div class="modal-header">
            <h2 class="modal-title">${this.options.title}</h2>
          </div>
          <div class="modal-body">
            ${this.options.description ? `<p class="modal-description">${this.options.description}</p>` : ''}
            <form id="${this.modalId}-form">
              ${this.createFields()}
              <button type="submit" class="submit-btn">
                ${this.options.submitText}
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Cria o iframe oculto que será o alvo do envio do Google Forms
    // Isso garante que o envio não interrompa a página principal
    if (!document.getElementById('googleFormsSubmitFrame')) {
      const iframe = document.createElement('iframe');
      iframe.id = 'googleFormsSubmitFrame';
      iframe.name = 'googleFormsSubmitFrame'; // 'name' é crucial para o 'target' do form
      iframe.style.display = 'none';
      iframe.addEventListener('load', () => {
        console.log('✅ Iframe carregou (envio ao Google concluído)');
      });
      document.body.appendChild(iframe);
    }
    
    // Registra a instância globalmente para acesso pelos event handlers
    if (!window.modalInstances) {
      window.modalInstances = {};
    }
    window.modalInstances[this.modalId] = this;
  }

  createFields() {
    return this.options.fields.map(field => `
      <div class="form-group">
        <label class="form-label" for="${this.modalId}-${field.name}">${field.label}</label>
        <input 
          type="${field.type || 'text'}" 
          id="${this.modalId}-${field.name}" 
          name="${field.name}" 
          class="form-input" 
          placeholder="${field.placeholder || ''}"
          ${field.required ? 'required' : ''}
        >
      </div>
    `).join('');
  }

  setupEventListeners() {
    const modal = document.getElementById(this.modalId);
    const form = document.getElementById(`${this.modalId}-form`);

    // Fechar modal ao clicar fora dele
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        this.close();
      }
    });

    // Fechar modal com tecla ESC
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.style.display === 'block') {
        this.close();
      }
    });

    // Envio do formulário
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Aplicar máscaras nos campos
    this.applyMasks();
  }

  applyMasks() {
    // Máscara para WhatsApp
    const whatsappFields = document.querySelectorAll(`#${this.modalId} input[name*="whatsapp"], #${this.modalId} input[name*="telefone"]`);
    whatsappFields.forEach(field => {
      field.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        e.target.value = value;
      });
    });

    // Máscara para CPF (se necessário)
    const cpfFields = document.querySelectorAll(`#${this.modalId} input[name*="cpf"]`);
    cpfFields.forEach(field => {
      field.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
      });
    });
  }

  open() {
    const modal = document.getElementById(this.modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  close() {
    const modal = document.getElementById(this.modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  async handleSubmit() {
    const form = document.getElementById(`${this.modalId}-form`);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log('📋 Dados do formulário:', data);

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
      // Mesmo com erro, ainda tenta redirecionar para o WhatsApp
      if (this.options.whatsappGroupURL) {
        window.open(this.options.whatsappGroupURL, '_blank');
      }
    }

    this.close();
    form.reset();
  }

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

  destroy() {
    const modal = document.getElementById(this.modalId);
    if (modal) {
      modal.remove();
    }
    if (window.modalInstances) {
      delete window.modalInstances[this.modalId];
    }
  }
}

// Função helper para criar modais rapidamente
function createModal(options) {
  return new Modal(options);
}