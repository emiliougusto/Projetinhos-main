console.log('🛒 Carrinho.js iniciando...');

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

function showNotification(message, type = 'success') {
    console.log('📢 Exibindo notificação:', message, 'Tipo:', type);

    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        left: 'auto',
        padding: '16px 24px',
        borderRadius: '12px',
        color: 'white',
        zIndex: '99999',
        fontWeight: '600',
        maxWidth: '350px',
        minWidth: '250px',
        wordWrap: 'break-word',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(12px)',
        transform: 'translateY(-20px)',
        opacity: '0',
        transition: 'transform 0.4s ease, opacity 0.4s ease'
    });

    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });

    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    }

    document.body.appendChild(notification);

    notification.offsetHeight;

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutFixed 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

function getCart() {
    try {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        console.log('📦 Carrinho carregado do localStorage:', carrinho);
        return carrinho;
    } catch (error) {
        console.error('❌ Erro ao ler carrinho do localStorage:', error);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem('carrinho', JSON.stringify(cart));
        console.log('💾 Carrinho salvo no localStorage:', cart);
        updateCartCounter();
    } catch (error) {
        console.error('❌ Erro ao salvar carrinho:', error);
        showNotification('Erro ao salvar carrinho', 'error');
    }
}

function loadCartItems() {
    console.log('🔄 Carregando itens do carrinho...');

    const cart = getCart();
    const cartContainer = document.getElementById('cart-items');

    if (!cartContainer) {
        console.error('❌ Container do carrinho não encontrado');
        return;
    }

    console.log('📋 Itens no carrinho:', cart);
    console.log('📊 Total de itens:', cart.length);

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        console.log('🛒 Carrinho vazio, exibindo mensagem padrão');
        cartContainer.innerHTML = `
            <div id="empty-cart" class="carrinho-vazio">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
                <a href="index.html" class="btn-voltar">Continuar Comprando</a>
            </div>
        `;
        updateTotal(0);
        updateConfirmButton(false);
        return;
    }

    let html = '';
    let total = 0;

    const validItems = cart.filter(item => {
        if (!item) return false;
        if (!item.nome) return false;
        if (item.preco === undefined || item.preco === null) return false;
        if (!item.quantidade || item.quantidade <= 0) return false;
        return true;
    });

    console.log('✅ Itens válidos encontrados:', validItems.length);

    validItems.forEach((item, index) => {
        console.log(`🔍 Processando item ${index}:`, item);

        const preco = parseFloat(item.preco);
        const quantidade = parseInt(item.quantidade);
        const itemTotal = preco * quantidade;
        total += itemTotal;

        const nomeExibicao = limparNomeProduto(item.nome);
        const imagemSrc = item.imagem || './img/placeholder.jpg';

        console.log(`✅ Item válido processado - ${nomeExibicao}: ${quantidade}x ${formatarPreco(preco)} = ${formatarPreco(itemTotal)}`);

        const originalIndex = cart.findIndex(cartItem =>
            cartItem.nome === item.nome &&
            cartItem.preco === item.preco
        );

        html += `
            <div class="cart-item" data-index="${originalIndex}" data-nome="${item.nome}">
                <div class="item-info">
                    <img src="${imagemSrc}" alt="${nomeExibicao}" class="item-image" 
                         onerror="this.src='./img/placeholder.jpg'">
                    <div class="item-details">
                        <h4>${nomeExibicao}</h4>
                        <p class="item-price">${formatarPreco(preco)}</p>
                    </div>
                </div>
                <div class="item-controls">
                    <div class="quantity-control">
                        <button class="qty-btn decrease" data-index="${originalIndex}" type="button">-</button>
                        <span class="qty-display">${quantidade}</span>
                        <button class="qty-btn increase" data-index="${originalIndex}" type="button">+</button>
                    </div>
                    <div class="item-total">${formatarPreco(itemTotal)}</div>
                    <button class="remove-btn" data-index="${originalIndex}" type="button">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    if (html) {
        cartContainer.innerHTML = html;
        console.log('✅ HTML dos itens inserido no container');
    } else {
        console.warn('⚠️ Nenhum HTML gerado para os itens');
        cartContainer.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fas fa-shopping-cart"></i>
                <p>Erro ao carregar itens do carrinho</p>
                <a href="index.html" class="btn-voltar">Continuar Comprando</a>
            </div>
        `;
    }

    updateTotal(total);
    setupCartEventListeners();

    console.log(`✅ ${validItems.length} itens válidos carregados. Total: ${formatarPreco(total)}`);
}

function setupCartEventListeners() {
    console.log('🔧 Configurando event listeners do carrinho...');

    setTimeout(() => {
        const cartContainer = document.getElementById('cart-items');

        if (!cartContainer) {
            console.error('❌ Container do carrinho não encontrado para event listeners');
            return;
        }

        cartContainer.removeEventListener('click', handleCartClick);
        cartContainer.addEventListener('click', handleCartClick);

        console.log('✅ Event listeners configurados com event delegation');
    }, 100);
}

function handleCartClick(event) {
    const target = event.target.closest('button');
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();

    const index = parseInt(target.dataset.index);

    if (isNaN(index)) {
        console.error('❌ Índice inválido:', target.dataset.index);
        return;
    }

    if (target.classList.contains('decrease')) {
        console.log('➖ Diminuindo quantidade do item:', index);
        updateQuantity(index, -1);
    } else if (target.classList.contains('increase')) {
        console.log('➕ Aumentando quantidade do item:', index);
        updateQuantity(index, 1);
    } else if (target.classList.contains('remove-btn')) {
        console.log('🗑️ Removendo item:', index);
        removeItem(index);
    }
}

function updateQuantity(index, change) {
    const cart = getCart();

    console.log('🔄 Atualizando quantidade:', { index, change, cartLength: cart.length });

    if (index < 0 || index >= cart.length) {
        console.error('❌ Índice inválido:', index);
        return;
    }

    const item = cart[index];
    if (!item) {
        console.error('❌ Item não encontrado no índice:', index);
        return;
    }

    const oldQuantity = parseInt(item.quantidade);
    const newQuantity = oldQuantity + change;

    console.log(`📊 Alterando quantidade: ${oldQuantity} → ${newQuantity}`);

    if (newQuantity < 1) {
        const itemName = limparNomeProduto(item.nome);
        cart.splice(index, 1);
        saveCart(cart);
        showNotification(`${itemName} removido do carrinho`, 'info');
        console.log('🗑️ Item removido por quantidade zero');
    } else {
        cart[index] = {
            ...item,
            quantidade: newQuantity
        };
        saveCart(cart);
        const itemName = limparNomeProduto(item.nome);
        showNotification(`Quantidade atualizada: ${itemName} (${newQuantity})`, 'info');
        console.log('✅ Quantidade atualizada');
    }

    loadCartItems();
}

function removeItem(index) {
    const cart = getCart();

    console.log('🗑️ Removendo item no índice:', index);

    if (index < 0 || index >= cart.length) {
        console.error('❌ Índice inválido para remoção:', index);
        return;
    }

    const item = cart[index];
    if (!item) {
        console.error('❌ Item não encontrado para remoção:', index);
        return;
    }

    const itemName = limparNomeProduto(item.nome);

    if (confirm(`Tem certeza que deseja remover "${itemName}" do carrinho?`)) {
        cart.splice(index, 1);
        saveCart(cart);
        showNotification(`${itemName} removido do carrinho`, 'info');
        console.log(`✅ Item removido: ${itemName}`);
        loadCartItems();
    }
}

function updateTotal(total) {
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = formatarPreco(total);
        console.log('💰 Total atualizado:', formatarPreco(total));
    }

    const paymentSelected = document.querySelector('input[name="pagamento"]:checked');
    updateConfirmButton(total > 0 && paymentSelected);
}

function updateConfirmButton(enabled) {
    const confirmButton = document.getElementById('btn-confirmar');
    if (confirmButton) {
        confirmButton.disabled = !enabled;
        console.log('🔘 Botão confirmar:', enabled ? 'habilitado' : 'desabilitado');
    }
}

function updateCartCounter() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + parseInt(item.quantidade || 0), 0);

    const counters = document.querySelectorAll('.carrinho-contador, .cart-counter, .navbar-cart-count');
    counters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'block' : 'none';
    });

    console.log('📢 Contador do carrinho atualizado:', totalItems);
}

function setupPaymentOptions() {
    console.log('💳 Configurando opções de pagamento...');

    const paymentOptions = document.querySelectorAll('input[name="pagamento"]');

    paymentOptions.forEach(option => {
        option.addEventListener('change', function () {
            console.log('💳 Forma de pagamento selecionada:', this.value);

            document.querySelectorAll('.forma').forEach(forma => {
                forma.classList.remove('selected');
            });

            this.closest('.forma').classList.add('selected');

            const cart = getCart();
            const total = cart.reduce((sum, item) => {
                const preco = parseFloat(item.preco);
                const quantidade = parseInt(item.quantidade);
                return sum + (isNaN(preco) || isNaN(quantidade) ? 0 : preco * quantidade);
            }, 0);
            updateConfirmButton(total > 0);
        });
    });

    console.log('✅ Opções de pagamento configuradas');
}

function setupOrderConfirmation() {
    console.log('📋 Configurando confirmação do pedido...');

    const confirmButton = document.getElementById('btn-confirmar');

    if (confirmButton) {
        confirmButton.addEventListener('click', function () {
            console.log('🛒 Botão confirmar clicado');

            const paymentMethod = document.querySelector('input[name="pagamento"]:checked');
            const cart = getCart();

            if (!paymentMethod) {
                alert('Por favor, selecione uma forma de pagamento.');
                return;
            }

            if (cart.length === 0) {
                alert('Seu carrinho está vazio.');
                return;
            }

            const total = cart.reduce((sum, item) => {
                const preco = parseFloat(item.preco);
                const quantidade = parseInt(item.quantidade);
                return sum + (isNaN(preco) || isNaN(quantidade) ? 0 : preco * quantidade);
            }, 0);

            const paymentTexts = {
                'cartao': 'Cartão',
                'pix': 'Pix',
                'dinheiro': 'Dinheiro'
            };

            const paymentText = paymentTexts[paymentMethod.value] || 'Forma selecionada';

            const confirmMessage = `Confirmar compra de ${formatarPreco(total)} via ${paymentText}?`;

            if (confirm(confirmMessage)) {
                console.log('✅ Compra confirmada!');

                localStorage.removeItem('carrinho');

                showNotification('Compra finalizada com sucesso! Obrigado por comprar na King\'s Burger!', 'success');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }

    console.log('✅ Confirmação do pedido configurada');
}

function adicionarEstilosNotificacao() {
    if (!document.getElementById('notification-styles-fixed')) {
        const style = document.createElement('style');
        style.id = 'notification-styles-fixed';
        style.textContent = `
            @keyframes slideInFixed {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutFixed {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            /* CORREÇÃO: Estilos específicos para mobile */
            @media (max-width: 768px) {
                .notification {
                    top: 100px !important;
                    right: 10px !important;
                    left: 10px !important;
                    max-width: none !important;
                    transform: translateY(-100%) !important;
                }
                
                .notification {
                    animation: slideInMobile 0.4s ease forwards !important;
                }
                
                @keyframes slideInMobile {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            }
        `;
        document.head.appendChild(style);
    }
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
        loadCartItems();
        updateCartCounter();
        showNotification('Carrinho limpo com sucesso', 'info');
        console.log('🗑️ Carrinho limpo');
    }
}

function recarregarCarrinho() {
    console.log('🔄 Recarregando carrinho...');
    loadCartItems();
}

function adicionarItemTeste() {
    console.log('🧪 Adicionando item de teste...');

    const itemTeste = {
        nome: 'King Smash Teste',
        preco: 39.90,
        imagem: './img/burguer1.png',
        quantidade: 1
    };

    const cart = getCart();
    cart.push(itemTeste);
    saveCart(cart);
    loadCartItems();

    showNotification('Item de teste adicionado!', 'success');
    console.log('✅ Item de teste adicionado com sucesso');
}

function inicializarCarrinho() {
    console.log('🚀 Inicializando sistema do carrinho...');

    adicionarEstilosNotificacao();

    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');

    if (!cartContainer) {
        console.error('❌ ERRO CRÍTICO: Container cart-items não encontrado!');
        return;
    }

    if (!totalElement) {
        console.warn('⚠️ Elemento cart-total não encontrado');
    }

    console.log('✅ Elementos DOM verificados, prosseguindo...');

    loadCartItems();

    setupPaymentOptions();

    setupOrderConfirmation();

    updateCartCounter();

    console.log('✅ Sistema do carrinho inicializado com sucesso!');
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('📄 DOM carregado, iniciando carrinho...');

    setTimeout(() => {
        inicializarCarrinho();
    }, 200);
});

window.addEventListener('load', function () {
    console.log('📄 Window load event - verificando se carrinho foi inicializado...');

    setTimeout(() => {
        const cartContainer = document.getElementById('cart-items');
        if (cartContainer && !cartContainer.hasAttribute('data-initialized')) {
            console.log('🔧 Carrinho não inicializado, tentando novamente...');
            inicializarCarrinho();
            cartContainer.setAttribute('data-initialized', 'true');
        }
    }, 100);
});

window.verCarrinho = verCarrinho;
window.limparCarrinho = limparCarrinho;
window.recarregarCarrinho = recarregarCarrinho;
window.showNotification = showNotification;
window.loadCartItems = loadCartItems;
window.getCart = getCart;
window.saveCart = saveCart;
window.adicionarItemTeste = adicionarItemTeste;
window.updateCartCounter = updateCartCounter;

console.log('🛒 Script do carrinho corrigido carregado e pronto!');

if (document.readyState === 'loading') {
    console.log('⏳ DOM ainda carregando, aguardando...');
} else {
    console.log('⚡ DOM já carregado, inicializando imediatamente...');
    setTimeout(inicializarCarrinho, 50);
}