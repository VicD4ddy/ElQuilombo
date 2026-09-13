/**
 * EL QUILOMBO - TICKETING & RESERVATION CALCULATOR
 */

window.QuilomboTicketing = (function() {
  const tiers = {
    general: {
      id: 'general',
      name: 'Pase General (Preventa 1)',
      priceUSD: 10,
      badge: 'Early Bird',
      description: 'Acceso general al evento + sticker pack exclusivo + trago de bienvenida'
    },
    vip: {
      id: 'vip',
      name: 'Pase VIP Quilombo',
      priceUSD: 20,
      badge: 'Más Popular',
      description: 'Acceso express sin cola + zona VIP preferencial + 2 tragos / copa temática + acceso al After'
    }
  };

  // State
  let currentTier = 'vip';
  let quantity = 1;
  const refExchangeRate = 42.5; // Tasa referencial estimada

  // DOM Elements
  let calcTierNameEl;
  let calcTierUnitEl;
  let calcQtyEl;
  let calcTotalUsdEl;
  let calcTotalRefEl;

  function init() {
    calcTierNameEl = document.getElementById('calc-tier-name');
    calcTierUnitEl = document.getElementById('calc-tier-unit');
    calcQtyEl = document.getElementById('calc-qty');
    calcTotalUsdEl = document.getElementById('calc-total-usd');
    calcTotalRefEl = document.getElementById('calc-total-ref');

    // Attach click listeners to cards
    document.querySelectorAll('[data-tier]').forEach(card => {
      card.addEventListener('click', (e) => {
        const tierId = card.getAttribute('data-tier');
        selectTier(tierId);
      });
    });

    // Quantity buttons
    const btnMinus = document.getElementById('btn-qty-minus');
    const btnPlus = document.getElementById('btn-qty-plus');

    if (btnMinus) {
      btnMinus.addEventListener('click', () => changeQuantity(-1));
    }
    if (btnPlus) {
      btnPlus.addEventListener('click', () => changeQuantity(1));
    }

    render();
  }

  function selectTier(tierId) {
    if (!tiers[tierId]) return;
    currentTier = tierId;
    render();
  }

  function changeQuantity(delta) {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= 15) {
      quantity = newQty;
      render();
    }
  }

  function render() {
    const tier = tiers[currentTier];
    const totalUSD = tier.priceUSD * quantity;
    const totalRefBs = (totalUSD * refExchangeRate).toLocaleString('es-VE', { maximumFractionDigits: 2 });

    // Update active class on cards
    document.querySelectorAll('[data-tier]').forEach(card => {
      const isSelected = card.getAttribute('data-tier') === currentTier;
      card.classList.toggle('selected', isSelected);
      const btn = card.querySelector('.btn-select-tier');
      if (btn) {
        btn.textContent = isSelected ? '✓ Seleccionado' : 'Seleccionar Pase';
      }
    });

    // Update calculator values
    if (calcTierNameEl) calcTierNameEl.textContent = tier.name;
    if (calcTierUnitEl) calcTierUnitEl.textContent = `$${tier.priceUSD} USD c/u`;
    if (calcQtyEl) calcQtyEl.textContent = quantity;
    if (calcTotalUsdEl) calcTotalUsdEl.textContent = `$${totalUSD} USD`;
    if (calcTotalRefEl) calcTotalRefEl.textContent = `Ref. aprox: Bs. ${totalRefBs}`;

    // Update hidden field if present
    const hiddenTierInput = document.getElementById('res-tier-input');
    if (hiddenTierInput) hiddenTierInput.value = tier.id;
  }

  function getCurrentOrder() {
    const tier = tiers[currentTier];
    const totalUSD = tier.priceUSD * quantity;
    const totalRefBs = (totalUSD * refExchangeRate).toLocaleString('es-VE', { maximumFractionDigits: 2 });
    return {
      tier,
      quantity,
      totalUSD,
      totalRefBs
    };
  }

  return {
    init,
    selectTier,
    changeQuantity,
    getCurrentOrder
  };
})();
