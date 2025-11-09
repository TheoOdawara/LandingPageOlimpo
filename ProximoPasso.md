# **Descrição**
    Vamos implementar agora o pixel da meta e os eventos.

# **O que usar**

## Muito importante seguir o copilot instructions, ele é imprescindível. 

## **Pixel da meta**
        <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '417219127737945');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=417219127737945&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->

## **Chave API da meta**
    EAAHHUJmp9dYBPZCerrU5O5ouVkOCcWHXk6EXhpSzbxmo6E1CnWA7A6IlofvvcwWrH7t9GXVcRf9jZBdjI4s78By18YrFEdnzCNFZBWrXJq5TfeXU31Eshb77mUZBWDYul54YfCZAwQI26GaexI5dMlZAXWmfAxk0rQ4jzo7c2Q5Xtp24V0dkCm2h0A8HHZBeGL41QZDZD (Por questão de segurança você tem que manter seguro essa chave e não deixar aparecer de forma alguma)

##  **evento de lead**
    Enviar o evento de lead toda vez que a pessoa clicar no botão do formulário.

## **Códigos**
    Tudo que for usada chamada de api do facebook e tal tem que ser os originais que funcionarão com 100% de certeza
