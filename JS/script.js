document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 DOM carregado, inicializando funcionalidades...');

    const carousel = document.getElementById('carousel');
    if (carousel) {
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 5000,
            ride: 'carousel',
            pause: 'hover',
            wrap: true,
            touch: true
        });

        carousel.addEventListener('mouseenter', function () {
            carouselInstance.pause();
        });

        carousel.addEventListener('mouseleave', function () {
            carouselInstance.cycle();
        });
    }

    setTimeout(() => {
        configurarBotoesCarrinho();
        atualizarContadorCarrinho();
        configurarNavegacaoSuave();
        configurarAnimacoesEntrada();
        console.log('✅ Todas as funcionalidades inicializadas com sucesso');
    }, 100);
});

function limparNomeProduto(nome) {
    if (!nome) return '';
    return nome
        .replace(/<br\s*\/?>/gi, ' ') 
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function formatarPreco(preco) {
    const numeroPreco = parseFloat(preco);
    if (isNaN(numeroPreco)) return 'R$ 0,00';
    return `R$ ${numeroPreco.toFixed(2).replace('.', ',')}`;
}

window.criarNotificacao = function(mensagem, tipo = 'sucesso') {
    if (!document.getElementById('css-notificacoes-fix')) {
        const style = document.createElement('style');
        style.id = 'css-notificacoes-fix';
        style.textContent = `
            @keyframes progressFix { 
                from { transform: scaleX(1); } 
                to { transform: scaleX(0); } 
            }
            #notif-container { 
                position: fixed !important; 
                top: 100px !important; 
                right: 20px !important; 
                z-index: 999999 !important; 
                pointer-events: none !important; 
                width: 380px !important; 
                max-width: calc(100vw - 40px) !important; 
            }
            @media (max-width: 768px) { 
                #notif-container { 
                    top: 90px !important; 
                    right: 10px !important; 
                    left: 10px !important; 
                    width: auto !important; 
                } 
            }
        `;
        document.head.appendChild(style);
    }

    let container = document.getElementById('notif-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notif-container';
        document.body.appendChild(container);
    }

    const old = container.querySelectorAll('.notif');
    if (old.length >= 3) old[0].remove();

    const notif = document.createElement('div');
    notif.className = 'notif';
    notif.style.cssText = 'position:relative;width:100%;margin-bottom:16px;background:transparent;pointer-events:auto;transform:translateX(100%);transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);';

    const color = tipo === 'erro' ? '#ef4444' : tipo === 'info' ? '#3b82f6' : '#22c55e';
    const icon = tipo === 'erro' ? 'fas fa-exclamation-triangle' : tipo === 'info' ? 'fas fa-info-circle' : 'fas fa-check-circle';
    const title = tipo === 'erro' ? 'Erro!' : tipo === 'info' ? 'Informação' : 'Produto Adicionado!';

    notif.innerHTML = `
        <div style="background:rgba(255,255,255,0.98);backdrop-filter:blur(16px);border:1px solid ${color}30;border-radius:16px;box-shadow:0 12px 40px ${color}25;overflow:hidden;position:relative;">
            <div style="display:flex;align-items:center;padding:16px 20px;gap:12px;">
                <div style="color:${color};font-size:24px;flex-shrink:0;">
                    <i class="${icon}"></i>
                </div>
                <div style="flex:1;">
                    <strong style="display:block;font-size:16px;font-weight:600;margin-bottom:4px;color:#111827;font-family:Poppins,sans-serif;">${title}</strong>
                    <p style="font-size:14px;color:#64748b;margin:0;line-height:1.4;font-family:Poppins,sans-serif;">${mensagem}</p>
                </div>
                <button style="background:none;border:none;color:#64748b;cursor:pointer;padding:8px;border-radius:6px;transition:all 0.2s ease;flex-shrink:0;font-size:14px;" 
                        onmouseover="this.style.backgroundColor='rgba(0,0,0,0.05)';this.style.color='#111827';" 
                        onmouseout="this.style.backgroundColor='';this.style.color='#64748b';" 
                        onclick="this.closest('.notif').style.transform='translateX(100%)';this.closest('.notif').style.opacity='0';setTimeout(()=>this.closest('.notif').remove(),400);">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="position:absolute;bottom:0;left:0;height:3px;background:${color};width:100%;transform-origin:left;animation:progressFix 4s linear forwards;"></div>
        </div>
    `;

    container.appendChild(notif);
    notif.offsetHeight;
    setTimeout(() => notif.style.transform = 'translateX(0)', 10);
    setTimeout(() => { 
        notif.style.transform = 'translateX(100%)'; 
        notif.style.opacity = '0'; 
        setTimeout(() => notif.remove(), 400); 
    }, 4000);
};

    const conteudo = notificacao.querySelector('.notificacao-conteudo');
    Object.assign(conteudo.style, {
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        gap: '12px',
        position: 'relative'
    });

    const icone = notificacao.querySelector('.notificacao-icone');
    Object.assign(icone.style, {
        color: '#22c55e',
        fontSize: '24px',
        flexShrink: '0'
    });

    const texto = notificacao.querySelector('.notificacao-texto');
    Object.assign(texto.style, {
        flex: '1',
        color: '#111827'
    });

    const textoStrong = notificacao.querySelector('.notificacao-texto strong');
    Object.assign(textoStrong.style, {
        display: 'block',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '4px',
        color: '#1e293b'
    });

    const textoP = notificacao.querySelector('.notificacao-texto p');
    Object.assign(textoP.style, {
        fontSize: '14px',
        color: '#64748b',
        margin: '0',
        lineHeight: '1.4'
    });

    const botaoFechar = notificacao.querySelector('.notificacao-fechar');
    Object.assign(botaoFechar.style, {
        background: 'none',
        border: 'none',
        color: '#64748b',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        flexShrink: '0'
    });

    const barraTempo = notificacao.querySelector('.notificacao-barra-tempo');
    Object.assign(barraTempo.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        height: '3px',
        background: '#22c55e',
        width: '100%',
        transformOrigin: 'left',
        transition: 'transform 4s linear',
        transform: 'scaleX(1)'
    });

    botaoFechar.addEventListener('click', () => removerNotificacao(notificacao));

    function removerNotificacao(elemento) {
        elemento.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (elemento.parentNode) {
                elemento.remove();
            }
        }, 400);
    }

    setTimeout(() => {
        notificacao.style.transform = 'translateX(0)';
        setTimeout(() => {
            barraTempo.style.animation = 'barraProgresso 4s linear forwards';
        }, 100);
    }, 100);

    setTimeout(() => {
        removerNotificacao(notificacao);
    }, 4000);

function getCart() {
    try {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        console.log('📦 Carrinho carregado:', carrinho);
        return carrinho;
    } catch (error) {
        console.error('❌ Erro ao ler carrinho do localStorage:', error);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem('carrinho', JSON.stringify(cart));
        console.log('🛒 Carrinho salvo:', cart);
        atualizarContadorCarrinho();
    } catch (error) {
        console.error('❌ Erro ao salvar carrinho:', error);
    }
}

function adicionarAoCarrinho(produto) {
    console.log('🛒 Adicionando produto ao carrinho:', produto);

    if (!produto || !produto.nome || produto.preco === undefined || produto.preco === null) {
        console.error('❌ Produto inválido:', produto);
        criarNotificacao('Erro ao adicionar produto ao carrinho', 'erro');
        return;
    }

    let carrinho = getCart();

    const nomeLimpo = limparNomeProduto(produto.nome);
    const produtoExistente = carrinho.find(item => 
        limparNomeProduto(item.nome) === nomeLimpo
    );

    if (produtoExistente) {
        produtoExistente.quantidade += 1;
        console.log('📈 Quantidade aumentada para produto existente');
        criarNotificacao(`${nomeLimpo} - quantidade: ${produtoExistente.quantidade}`, 'sucesso');
    } else {
        const novoProduto = {
            nome: nomeLimpo,
            preco: parseFloat(produto.preco),
            imagem: produto.imagem || './img/placeholder.jpg',
            quantidade: 1
        };
        carrinho.push(novoProduto);
        console.log('➕ Novo produto adicionado');
        criarNotificacao(`${nomeLimpo} adicionado ao carrinho!`, 'sucesso');
    }

    saveCart(carrinho);
    console.log('✅ Produto adicionado com sucesso. Carrinho atual:', carrinho);
}

function extrairInfoProduto(botao) {
    console.log('🔍 Extraindo informações do produto...');

    const card = botao.closest('.menu-card');
    if (!card) {
        console.error('❌ Card não encontrado');
        return null;
    }

    const nomeElement = card.querySelector('h3');
    const precoElement = card.querySelector('.preco');
    const imagemElement = card.querySelector('img');

    if (!nomeElement || !precoElement) {
        console.error('❌ Elementos necessários não encontrados');
        return null;
    }

    const nome = nomeElement.textContent.trim();
    const precoTexto = precoElement.textContent;
    
    let preco = 0;
    
    const precoMatch = precoTexto.match(/R\$\s*(\d+(?:,\d{2})?)/);
    if (precoMatch) {
        preco = parseFloat(precoMatch[1].replace(',', '.'));
    } else {
        const dataPreco = botao.getAttribute('data-preco');
        if (dataPreco) {
            preco = parseFloat(dataPreco);
        } else {
            console.error('❌ Não foi possível extrair o preço de:', precoTexto);
            return null;
        }
    }

    const imagem = imagemElement ? imagemElement.src : './img/placeholder.jpg';

    const produto = {
        nome,
        preco,
        imagem
    };

    console.log('✅ Produto extraído:', produto);
    return produto;
}

function configurarBotoesCarrinho() {
    console.log('🔧 Configurando botões do carrinho...');

    const botoes = document.querySelectorAll('.btn-carrinho');
    console.log(`📋 Encontrados ${botoes.length} botões`);

    botoes.forEach((botao, index) => {
        const novoBotao = botao.cloneNode(true);
        botao.parentNode.replaceChild(novoBotao, botao);

        novoBotao.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`🖱️ Botão ${index + 1} clicado`);

            const produto = extrairInfoProduto(novoBotao);

            if (!produto) {
                console.error('❌ Falha ao extrair informações do produto');
                criarNotificacao('Erro ao adicionar produto ao carrinho', 'erro');
                return;
            }

            adicionarAoCarrinho(produto);

            const textoOriginal = novoBotao.innerHTML;
            novoBotao.innerHTML = '<i class="fas fa-check me-2"></i>Adicionado!';
            novoBotao.style.background = '#22c55e';
            novoBotao.style.color = 'white';
            novoBotao.disabled = true;

            setTimeout(() => {
                novoBotao.innerHTML = textoOriginal;
                novoBotao.style.background = '';
                novoBotao.style.color = '';
                novoBotao.disabled = false;
            }, 2000);
        });
    });

    console.log('✅ Todos os botões configurados com sucesso');
}

function atualizarContadorCarrinho() {
    const carrinho = getCart();
    const totalItens = carrinho.reduce((total, item) => total + parseInt(item.quantidade || 0), 0);

    const contadores = document.querySelectorAll('.carrinho-contador, .cart-counter, .navbar-cart-count');
    contadores.forEach(contador => {
        contador.textContent = totalItens;
        contador.style.display = totalItens > 0 ? 'block' : 'none';
    });

    console.log(`🔢 Contador do carrinho atualizado: ${totalItens} itens`);
    return totalItens;
}

function configurarNavegacaoSuave() {
    const menuLinks = document.querySelectorAll('a[href^="#"]');

    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(href);

            if (targetElement) {
                e.preventDefault();

                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function configurarAnimacoesEntrada() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

function verCarrinho() {
    const carrinho = getCart();
    console.log('🛒 Carrinho atual:', carrinho);
    console.log('📊 Total de itens:', carrinho.reduce((total, item) => total + parseInt(item.quantidade || 0), 0));
    const valorTotal = carrinho.reduce((total, item) => {
        const preco = parseFloat(item.preco || 0);
        const quantidade = parseInt(item.quantidade || 0);
        return total + (isNaN(preco) || isNaN(quantidade) ? 0 : preco * quantidade);
    }, 0);
    console.log('💰 Valor total:', formatarPreco(valorTotal));
    return carrinho;
}

function limparCarrinho() {
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
        localStorage.removeItem('carrinho');
        atualizarContadorCarrinho();
        console.log('🗑️ Carrinho limpo');
        criarNotificacao('Carrinho limpo com sucesso', 'info');
    }
}

function adicionarItemTeste() {
    console.log('🧪 Adicionando item de teste...');
    
    const itemTeste = {
        nome: 'King Smash Teste',
        preco: 39.90,
        imagem: './img/burguer1.png'
    };
    
    adicionarAoCarrinho(itemTeste);
    console.log('✅ Item de teste adicionado');
}

function adicionarEstilosNotificacao() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes barraProgresso {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

adicionarEstilosNotificacao();

window.verCarrinho = verCarrinho;
window.limparCarrinho = limparCarrinho;
window.atualizarContadorCarrinho = atualizarContadorCarrinho;
window.configurarBotoesCarrinho = configurarBotoesCarrinho;
window.getCart = getCart;
window.saveCart = saveCart;
window.adicionarItemTeste = adicionarItemTeste;

window.testarNotificacao = function (mensagem = 'Teste de notificação funcionando!') {
    criarNotificacao(mensagem, 'sucesso');
};

console.log('🛒 Script principal corrigido carregado e pronto!');