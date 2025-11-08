# 🎄 Landing Page Olimpo - Copilot Instructions

## 📋 Visão Geral do Projeto

Landing page de Natal para captação de leads da Olimpo Energia Solar. Foco em conversão através de VSL (Video Sales Letter), timer de urgência, e formulário modal integrado ao WhatsApp.

---

## 🛠️ Stack Tecnológica

### Front-End
- **HTML5** - Estrutura semântica com data-layers do Figma preservados
- **CSS3 Puro** - **SEMPRE usar arquivo externo `main.css`**
- **JavaScript Vanilla** - Sistema de modal customizado (`modal.js`)
- **Google Fonts** - Poppins (weights: 400, 600, 700, 800)
- **PandaVideo** - Player VSL embed responsivo

### Arquivos do Projeto
```
LandingPageOlimpo/
├── index.html          # HTML limpo, SEM estilos inline
├── main.css           # TODOS os estilos (layout, componentes, responsividade)
├── modal.css          # Estilos do sistema de modal
├── modal.js           # Lógica do modal e integração WhatsApp
└── images/
    ├── LOGO.svg
    └── IconesCasoReal/
        ├── Calendario.svg
        ├── SetaPraBaixo.svg
        └── Pessoas.svg
```

---

## 🎨 Padrões de Desenvolvimento

### 🚨 REGRAS CRÍTICAS - NUNCA VIOLAR

1. **ZERO ESTILOS INLINE**
   - ❌ ERRADO: `<div style="color: red;">`
   - ✅ CORRETO: Criar classe no `main.css` e aplicar no HTML

2. **ZERO TAG `<style>` NO HTML**
   - Todo CSS deve estar no arquivo `main.css`
   - Exceção: Modal tem seu próprio `modal.css`

3. **CLASSES SEMÂNTICAS**
   - Use nomes descritivos (`.caso-real-title`, `.benefit-item`)
   - Evite classes genéricas (`.box1`, `.container2`)

4. **MOBILE-FIRST**
   - Estilos base para mobile (320px+)
   - Media queries para desktop: `@media (min-width: 481px)`

5. **LAYOUT VERTICAL CONTÍNUO**
   - Uma única página que desce (scroll natural)
   - Sem divisões/camadas separadas que quebrem o fluxo



---

## 📐 Estrutura de Seções

### Ordem do Layout (top → bottom)

```html
<body>
  <div class="Background">  <!-- Fundo azul #032137 -->
    
    <!-- 1. Menu -->
    <section class="lp-section lp-menu">
      <!-- Logo + CTA button -->
    </section>

    <!-- 2. Headline -->
    <section class="lp-section lp-headline">
      <!-- Título principal com emoji 🎄 -->
    </section>

    <!-- 3. Vídeo VSL -->
    <section class="lp-section lp-video">
      <!-- PandaVideo iframe 16:9 -->
    </section>

    <!-- 4. Texto Promocional + CTA + Timer -->
    <section class="lp-section lp-promo">
      <!-- Textos, botão dourado, countdown -->
    </section>

    <!-- 5. Árvores Decorativas -->
    <section class="lp-section lp-footer">
      <!-- 5 árvores SVG + fundo neve -->
    </section>

    <!-- 6. Caso Real (fundo branco/amarelo) -->
    <section class="lp-section lp-caso-real">
      <!-- Box com borda dourada, pricing, benefícios -->
    </section>

  </div>
</body>
```

---

## 🎨 Design System

### Paleta de Cores
```css
:root {
  --brand-blue: #032137;    /* Fundo principal */
  --gold: #FFD700;          /* CTAs, bordas, destaques */
  --red: #D70C0C;           /* Preço antigo */
  --green: #00810F;         /* Preço novo */
  --white: #FFFFFF;
}
```

### Tipografia
```css
font-family: 'Poppins', system-ui, -apple-system, sans-serif;

/* Pesos usados */
font-weight: 400;  /* Normal */
font-weight: 600;  /* Semibold */
font-weight: 700;  /* Bold */
font-weight: 800;  /* Extrabold - CTAs */
```

### Breakpoints
```css
/* Mobile: 320px - 480px (base) */
/* Desktop: 481px+ */
@media (min-width: 481px) {
  /* Estilos desktop */
}
```

### Larguras e Containers (ATUALIZADO)
```css
/* Mobile e Desktop (375px referência): */
/* - Containers internos: max-width: 375px */
/* - Padding interno: 20px cada lado */
/* - box-sizing: border-box SEMPRE */
/* - Design consistente mobile → desktop */
```

---

## 🧩 Componentes Principais

### 1. Header (ATUALIZADO)
```css
.lp-header {
  /* Mobile: fixed no topo, z-index 900 */
  /* Desktop (481px+): static no fluxo */
  /* Altura: 70px mobile, 80px desktop */
  /* Background: var(--brand-blue) sólido */
  /* Items alinhados: flex-end (mobile), center (desktop) */
}

.Rectangle10 {
  /* Mobile: width 100%, padding 0 16px 12px */
  /* Desktop: max-width 400px, padding 0 25px, centralizado */
  /* Logo e CTA no bottom (evita notch do iPhone) */
}
```

### 2. Botão CTA Dourado
```css
.cta-gold {
  /* Mobile: width 100%, dentro do container 335px */
  /* Desktop: max-width 340px, centralizado */
  /* Gradiente dourado + sombras fortes */
  /* Estados: hover, focus, active */
}
```

### 3. Timer de Countdown
```css
.Timer {
  /* Mobile: max-width 335px + padding 20px */
  /* Desktop: max-width 360px */
  /* Container: fundo amarelo claro, borda dourada */
  /* 4 células: dias, horas, minutos, segundos */
  /* Labels posicionados absolutamente */
}
```

### 4. Box Caso Real
```css
.caso-real-background {
  /* Fundo branco, borda dourada 2.22px */
  /* Shadow: 0px 10px 44.835px rgba(255, 215, 0, 0.35) */
  /* Border-radius: 24px */
}
```
```css
.benefit-icon-circle {
  /* Círculo branco 40x40px */
  /* Shadow suave: 0px 2px 8px rgba(0,0,0,0.15) */
  /* SVG centralizado 20x20px */
}
```

---

## 🔧 Organização do CSS

### Estrutura do `main.css`
```css
/* ======================================== 
   1. VARIÁVEIS E RESET GLOBAL
======================================== */

/* ======================================== 
   2. LAYOUT PRINCIPAL
======================================== */

/* ======================================== 
   3. MENU SECTION
======================================== */

/* ======================================== 
   4. HEADLINE SECTION
======================================== */

/* ======================================== 
   5. VIDEO SECTION
======================================== */

/* ======================================== 
   6. PROMO TEXT SECTION
======================================== */

/* ======================================== 
   7. CTA GOLD BUTTON
======================================== */

/* ======================================== 
   8. TIMER SECTION
======================================== */

/* ======================================== 
   9. FOOTER DECORATIONS (TREES)
======================================== */

/* ======================================== 
   10. CASO REAL SECTION
======================================== */

/* ======================================== 
   11. RESPONSIVIDADE
======================================== */
```

---

## 📝 Nomenclatura de Classes

### Padrões
- **Containers:** `.lp-section`, `.caso-real-container`, `.benefits-list`
- **Elementos:** `.benefit-item`, `.timer-cell`, `.pricing-normal`
- **Estados:** `.cta-gold:hover`, `.cta-gold:active`
- **Utilidades:** `.headline-bold`, `.promo-text-normal`

### Evitar
- Classes únicas do Figma sem significado (`.Rectangle10` → aceitar apenas por compatibilidade)
- Classes genéricas (`.box`, `.item`, `.text`)
- IDs para estilização (usar apenas para JS se necessário)

---

## 🚀 Workflow de Desenvolvimento

### Ao adicionar novo componente:

1. **Criar estrutura HTML** no `index.html`
   - Usar tags semânticas (`<section>`, `<article>`, `<div>`)
   - Aplicar classes descritivas
   - **NUNCA** adicionar `style=""`

2. **Escrever CSS** no `main.css`
   - Adicionar na seção apropriada (ou criar nova)
   - Mobile-first: estilos base primeiro
   - Desktop: media query `@media (min-width: 481px)`

3. **Testar responsividade**
   - Mobile: 375px (iPhone padrão)
   - Desktop: 1200px+

4. **Validar**
   - HTML sem estilos inline ✓
   - Sem tag `<style>` ✓
   - Classes semânticas ✓
   - Funciona em mobile e desktop ✓

---

## 🎯 Modal de Captura

### Configuração
```javascript
const natalModal = createModal({
  id: 'natalModal',
  title: '🎄 Garanta seu Natal Pago pelo Sol',
  fields: [
    { name: 'nomeCompleto', label: 'Nome completo', type: 'text', required: true },
    { name: 'whatsapp', label: 'WhatsApp (com DDD)', type: 'tel', required: true },
    { name: 'cidade', label: 'Cidade', type: 'text', required: true }
  ],
  submitText: '👍 Entrar no grupo e garantir minha condição',
  whatsappNumber: '5567999999999',
  customMessage: (data) => `Olá! Meu nome é ${data.nomeCompleto}...`
});
```

### Triggers
- Clique no botão do menu: `onclick="natalModal.open()"`
- Clique no CTA dourado: `onclick="natalModal.open()"`

---

## ✅ Checklist de Qualidade

Antes de considerar tarefa concluída:

- [ ] Zero estilos inline no HTML
- [ ] Zero tag `<style>` no HTML
- [ ] Todo CSS está no `main.css` (organizado por seções)
- [ ] Classes semânticas e descritivas
- [ ] Mobile-first implementado
- [ ] Testado em mobile (375px) e desktop (1200px+)
- [ ] Layout vertical contínuo (sem quebras de fluxo)
- [ ] Emojis preservados (🎄, ☀️, 🎁, 👍)
- [ ] Sem erros no console
- [ ] Performance: CSS cacheável, imagens otimizadas

---

## 🗣️ Estilo de Comunicação

### Ao responder ao desenvolvedor:

1. **Seja direto e objetivo**
   - Evite explicações longas desnecessárias
   - Vá direto ao ponto técnico

2. **Mostre código quando relevante**
   - Exemplos práticos > teoria abstrata

3. **Confirme entendimento antes de executar**
   - Para mudanças estruturais, resuma o que vai fazer
   - Aguarde aprovação antes de modificar

4. **Reporte o que foi feito**
   - Lista de mudanças objetiva
   - Sem emojis excessivos (máximo 2-3 por resposta)

### Exemplo de resposta ideal:
```
Vou centralizar o título "Caso Real". Isso envolve:
1. Adicionar margin: 0 auto no .caso-real-title-container
2. Manter width: 75% atual

Posso prosseguir?
```

---

## 🔒 Não Fazer (Anti-patterns)

❌ **Adicionar estilos inline** ("só dessa vez", "é rápido")
❌ **Criar tag `<style>` no HTML** (mesmo "temporariamente")
❌ **Usar IDs para CSS** (`.class` > `#id`)
❌ **CSS inline no JavaScript** (`element.style.color = 'red'`)
❌ **Frameworks CSS** (Bootstrap, Tailwind) - vanilla CSS only
❌ **Quebrar fluxo vertical** (layers fixas, scrolls separados)
❌ **Classes não-descritivas** (`.x1`, `.temp`, `.new`)

---

## 📌 Referências Rápidas

### Max-widths padrão (ATUALIZADO)
- Containers: `375px` (mobile e desktop - mesmo tamanho)
- Padding interno: `20px` cada lado
- Botões CTA: `100%` (mobile) → `340px` (desktop)
- Background principal: `width: 100%`
- **Sempre usar `box-sizing: border-box`**

### Espaçamentos comuns
- Padding seções: `20px` (mobile) → `40px` (desktop)
- Margin entre elementos: `20px`, `30px`
- Gap flexbox: `12px`, `16px`

### Border-radius padrão
- Cards: `24px`
- Botões: `12px`
- Inputs: `8px`
- Badges: `10px`

---

**Última atualização:** Novembro 2025
**Versão:** 1.0