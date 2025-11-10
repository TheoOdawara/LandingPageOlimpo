# **Descrição**
   Estamos com um problema grande de desempenho no mobile, precisamos resolver isso. 

# **O que usar**

## Muito importante seguir o copilot instructions, ele é imprescindível. 

## Instruções do gemini

   Você está **100% correto** e peço desculpas por isso. Foi um erro na minha instrução anterior.

Você tem toda a razão: o VSL principal (linha 47) é o item mais importante da sua página (o `Largest Contentful Paint` ou LCP) e ele **não** deve ter `loading="lazy"`.

O objetivo não é *atrasar* o seu VSL, é fazer com que ele carregue *mais rápido*. O seu LCP de 28.1 segundos acontece porque o VSL está "brigando" por recursos com todos os outros elementos da página (outros 3 vídeos, 15+ imagens e scripts).

O plano de ação que dei (limpar o `<head>`, mover o Pixel) serve exatamente para *liberar* os recursos do navegador para que ele possa focar **apenas** no seu VSL.

Aqui está o plano de ação **corrigido** para os vídeos, que é o que você precisa.

-----

### ✅ Plano de Ação Corrigido (Foco no VSL)

#### 1\. Vídeo Principal (VSL - Linha 47): Prioridade Máxima

Mantenha exatamente como está no seu `index.html` original. O `fetchpriority="high"` está **correto** para o seu elemento LCP.

  * **Arquivo:** `index.html`
  * **Linha:** 47
  * **Ação:** **NÃO ALTERE ESTA LINHA.** Mantenha o `fetchpriority="high"` e **NÃO** adicione `loading="lazy"`.
    ```html
    <div class="video-wrapper"><iframe id="panda-99a724cb..." src="..." ... fetchpriority="high"></iframe></div>
    ```

#### 2\. Vídeos Secundários (Depoimentos): Atrasar Carregamento

Estes são os vídeos que estão "abaixo da dobra" (fora da tela inicial) e que *estão* roubando os recursos do seu VSL principal. É aqui que o `loading="lazy"` entra.

  * **Arquivo:** `index.html`

  * **Linha 352 (Depoimento 1):**

      * **Mude de:** `<iframe id="panda-427034d3..." ... fetchpriority="high"></iframe>`
      * **Para:** `<iframe loading="lazy" id="panda-427034d3..." ...></iframe>` (Adicione `loading="lazy"` e **remova** `fetchpriority="high"`)

  * **Linha 361 (Depoimento 2):**

      * **Mude de:** `<iframe id="panda-349689d4..." ... fetchpriority="high"></iframe>`
      * **Para:** `<iframe loading="lazy" id="panda-349689d4..." ...></iframe>` (Adicione `loading="lazy"` e **remova** `fetchpriority="high"`)

  * **Linha 370 (Depoimento 3):**

      * **Mude de:** `<iframe id="panda-718ddd12..." ... fetchpriority="high"></iframe>`
      * **Para:** `<iframe loading="lazy" id="panda-718ddd12..." ...></iframe>` (Adicione `loading="lazy"` e **remova** `fetchpriority="high"`)

-----

### Resumo do Plano (Agora 100% Correto)

Ao fazer isso, você está dizendo ao navegador:

1.  **Prioridade Total:** Carregue o VSL principal (linha 47) AGORA.
2.  **Ignorar por Enquanto:** Ignore os 3 vídeos de depoimento, o Pixel do Meta e todas as imagens com `loading="lazy"`.

Para que isso funcione, os outros passos do plano de ação ainda são **essenciais**:

1.  **Adicionar `loading="lazy"` a TODAS as imagens "abaixo da dobra"** (Contas de Luz, Imagem "Pode Confiar", ícones, etc.). Elas também estão competindo por recursos.
2.  **Comprimir e Converter** essas imagens para `.webp` para reduzir o tamanho delas, como o PageSpeed pediu.

Seu VSL só vai carregar rápido se ele não tiver que competir com 3 vídeos e 15 imagens desnecessárias no carregamento inicial.