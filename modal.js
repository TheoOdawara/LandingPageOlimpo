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

  handleSubmit() {
    const form = document.getElementById(`${this.modalId}-form`);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Enviar evento de Lead para o Meta Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: 'Natal Pago pelo Sol',
        content_category: 'Energia Solar',
        value: 0.00,
        currency: 'BRL'
      });
    }

    // Callback personalizado se fornecido
    if (this.options.onSubmit) {
      this.options.onSubmit(data);
    } else {
      // Comportamento padrão: redirecionar para WhatsApp
      this.redirectToWhatsApp(data);
    }

    this.close();
    form.reset();
  }

  redirectToWhatsApp(data) {
    // 1. ENVIA PARA O GOOGLE FORMS (100% gratuito e sem limites)
    const googleFormId = '1FAIpQLSeLdJN2xJkjfb5n8b12wcU7ISE2bIGC6Um8QZaDUWNh6NCC1w';
    
    // Envia para Google Forms
    const formData = new FormData();
    formData.append('entry.155509499', data.nomeCompleto);  // Nome Completo
    formData.append('entry.151847681', data.whatsapp);      // WhatsApp
    formData.append('entry.1994109954', data.cidade);       // Cidade
    
    fetch(`https://docs.google.com/forms/d/e/${googleFormId}/formResponse`, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
    .then(() => {
      console.log('✅ Lead enviado para Google Sheets com sucesso!');
    })
    .catch(error => {
      console.log('⚠️ Erro ao enviar para form (mas pode ter sido enviado):', error);
    });
    
    // Backup local
    const leads = JSON.parse(localStorage.getItem('olimpo_leads') || '[]');
    leads.push({
      ...data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('olimpo_leads', JSON.stringify(leads));
    console.log('📊 Total de leads salvos localmente:', leads.length);
    
    // 2. REDIRECIONA PARA O WHATSAPP
    if (this.options.whatsappGroupURL) {
      window.open(this.options.whatsappGroupURL, '_blank');
    } else {
      console.error('Nenhum link de grupo WhatsApp configurado');
    }
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