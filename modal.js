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

  handleSubmit() {
    const form = document.getElementById(`${this.modalId}-form`);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // LOG DE DIAGNÓSTICO 1: Mostra exatamente o que foi capturado
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
    const entryMap = this.options.googleFormEntryMap;
    const baseURL = this.options.googleFormURL;

    console.log('🔍 DIAGNÓSTICO - redirectToWhatsApp (MÉTODO IFRAME POST)');
    console.log('📋 Dados recebidos:', data);
    console.log('🗺️ Entry Map:', entryMap);
    console.log('🌐 Base URL:', baseURL);

    // 1. Se o mapa de entrys e a URL existirem, envia para o Google Forms
    if (entryMap && baseURL) {
      // Cria um formulário dinâmico e invisível
      const dynamicForm = document.createElement('form');
      dynamicForm.action = baseURL; // A URL .../formResponse
      dynamicForm.method = 'POST';
      dynamicForm.target = 'googleFormsSubmitFrame'; // <--- A MÁGICA ACONTECE AQUI
      dynamicForm.style.display = 'none';

      // 2. Cria inputs ocultos para cada dado mapeado
      for (const key in entryMap) {
        if (data[key]) {
          const entryCode = entryMap[key];
          const value = data[key];

          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = entryCode; // Ex: 'entry.155509499'
          input.value = value;
          dynamicForm.appendChild(input);
          
          console.log(`✅ Mapeado para POST: ${input.name} = "${input.value}"`);
        } else {
          console.warn(`⚠️ Campo "${key}" não encontrado nos dados`);
        }
      }

      // 3. Adiciona o formulário à página, envia e remove
      document.body.appendChild(dynamicForm);
      dynamicForm.submit();
      document.body.removeChild(dynamicForm);
      
      console.log('🚀 Formulário POST enviado para o iframe oculto.');

    } else {
      console.error('❌ Configuração do Google Forms incompleta!');
    }
    
    // 4. ABRE O WHATSAPP EM NOVA ABA (COM ATRASO POR SEGURANÇA)
    if (this.options.whatsappGroupURL) {
      console.log(`⏳ Atrasando redirecionamento para o WhatsApp em 500ms...`);
      
      // O atraso garante que o 'form.submit()' teve tempo de disparar
      setTimeout(() => {
        const newTab = window.open(this.options.whatsappGroupURL, '_blank');
        if (newTab) {
          newTab.focus(); // Foca na nova aba
          console.log('✅ WhatsApp aberto em nova aba e focado');
        } else {
          console.warn('⚠️ O Pop-up do WhatsApp foi bloqueado pelo navegador.');
        }
      }, 500); // 500ms é mais que suficiente
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