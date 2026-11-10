/* ================================================================
   js/app.js — Application orchestrator
   ================================================================ */
(function () {
  'use strict';

  // ---------- State ----------
  const state = {
    products: [],
    selectedProduct: null,
    qty: 1.0,
    modalOpen: false,
    drawerOpen: false
  };

  const MIN_QTY = 0.5;
  const MAX_QTY = 100;
  const QTY_STEP = 0.5;

  // ---------- DOM Cache ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const dom = {
    // Grid
    productGrid: $('#productGrid'),
    productsError: $('#productsError'),
    // Modal
    modal: $('#enquiryModal'),
    modalImg: $('#modalImg'),
    modalNameMr: $('#modalNameMr'),
    modalNameEn: $('#modalNameEn'),
    modalPrice: $('#modalPrice'),
    modalTotal: $('#modalTotal'),
    modalCalc: $('#modalCalc'),
    qtyInput: $('#qtyInput'),
    qtyMinus: $('#qtyMinus'),
    qtyPlus: $('#qtyPlus'),
    sendBtn: $('#sendEnquiry'),
    modalClose: $('#modalClose'),
    // Drawer
    menuBtn: $('#menuBtn'),
    menuClose: $('#menuClose'),
    mobileMenu: $('#mobileMenu'),
    // Nav
    header: $('#siteHeader'),
    bottomNav: $('#bottomNav'),
    navLinks: $$('.nav-link'),
    bottomNavItems: $$('.bottom-nav-item'),
    // WhatsApp entry points
    headerWhatsapp: $('#headerWhatsapp'),
    heroWhatsapp: $('#heroWhatsapp'),
    drawerWhatsapp: $('#drawerWhatsapp'),
    contactWhatsapp: $('#contactWhatsapp'),
    fabWhatsapp: $('#fabWhatsapp'),
    // Footer
    year: $('#year')
  };

  // ---------- Utilities ----------
  function formatCurrency(n) {
    return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
      .format(Math.round(Number(n) || 0));
  }

  function formatQty(n) {
    const v = Number(n);
    if (!isFinite(v) || v <= 0) return '0';
    return parseFloat(v.toFixed(2)).toString();
  }

  function clampQty(n) {
    let v = Number(n);
    if (!isFinite(v)) v = MIN_QTY;
    v = Math.round(v * 100) / 100; // round to 2 decimals
    if (v < MIN_QTY) v = MIN_QTY;
    if (v > MAX_QTY) v = MAX_QTY;
    return v;
  }

  function safeIconRefresh() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // ---------- Product loading ----------
  async function loadProducts() {
    // Try Supabase first
    try {
      if (window.MayechSupabase && window.MayechSupabase.isConfigured()) {
        const remote = await window.MayechSupabase.fetchActiveProducts();
        if (Array.isArray(remote) && remote.length > 0) {
          return remote;
        }
      }
    } catch (err) {
      console.warn('[app] Supabase fetch failed, using fallback:', err);
    }

    // Fallback
    if (window.MayechProducts && Array.isArray(window.MayechProducts.FALLBACK_PRODUCTS)) {
      return window.MayechProducts.FALLBACK_PRODUCTS;
    }
    return [];
  }

  // ---------- Product card rendering ----------
  function productCardTemplate(p) {
    const priceStr = formatCurrency(p.price_per_kg);
    return `
      <article class="product-card" data-product-id="${p.id}" aria-label="${p.name_en}">
        <div class="product-card__img-wrap">
          <img src="${p.image_url}"
               data-fallback-label="${p.name_mr}"
               alt="${p.name_en} – ${p.name_mr}"
               loading="lazy" decoding="async"
               class="product-card__img" />
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name-mr">${p.name_mr}</h3>
          <p class="product-card__name-en">${p.name_en}</p>
          <p class="product-card__price">
            ${priceStr}<small>/ Kg</small>
          </p>
          <button type="button"
                  class="product-card__cta"
                  data-order-id="${p.id}"
                  aria-label="${p.name_en} ऑर्डर करा">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            ऑर्डर करा
          </button>
        </div>
      </article>
    `;
  }

  function renderProducts(products) {
    if (!dom.productGrid) return;
    if (!products || products.length === 0) {
      dom.productGrid.innerHTML = '';
      dom.productsError?.classList.remove('hidden');
      return;
    }
    dom.productsError?.classList.add('hidden');
    dom.productGrid.innerHTML = products.map(productCardTemplate).join('');

    // Attach order button listeners (event delegation alternative)
    dom.productGrid.querySelectorAll('[data-order-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-order-id');
        const product = state.products.find((p) => String(p.id) === String(id));
        if (product) openModal(product);
      });
    });

    // Attach image error fallbacks
    attachImageFallbacks(dom.productGrid);
    safeIconRefresh();
  }

  function attachImageFallbacks(root) {
    if (!root) return;
    root.querySelectorAll('img[data-fallback-label]').forEach((img) => {
      img.addEventListener('error', () => {
        const label = img.getAttribute('data-fallback-label') || 'म';
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" preserveAspectRatio="xMidYMid slice">
            <rect width="200" height="160" fill="#F9E8D2"/>
            <text x="50%" y="52%" font-family="'Baloo 2', Mukta, sans-serif"
                  font-size="34" font-weight="700" fill="#79513A"
                  text-anchor="middle" dominant-baseline="middle">${label}</text>
          </svg>`;
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        img.classList.add('is-fallback');
      }, { once: true });
    });
  }

  // ---------- Modal: open / close ----------
  function openModal(product) {
    if (!product || !dom.modal) return;

    state.selectedProduct = product;
    state.qty = 1.0;

    // Populate summary
    dom.modalImg.src = product.image_url;
    dom.modalImg.alt = `${product.name_en} – ${product.name_mr}`;
    dom.modalImg.setAttribute('data-fallback-label', product.name_mr);
    attachImageFallbacks(dom.modal);

    dom.modalNameMr.textContent = product.name_mr;
    dom.modalNameEn.textContent = product.name_en;
    dom.modalPrice.textContent = formatCurrency(product.price_per_kg);

    dom.qtyInput.value = '1.0';
    updateTotal();

    // Show modal
    dom.modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    state.modalOpen = true;

    // Trigger transition on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dom.modal.classList.add('is-open');
      });
    });

    // Focus trap: focus the quantity input
    setTimeout(() => dom.qtyInput?.focus(), 260);

    safeIconRefresh();
  }

  function closeModal() {
    if (!dom.modal || !state.modalOpen) return;
    dom.modal.classList.remove('is-open');
    state.modalOpen = false;
    document.body.classList.remove('modal-open');

    setTimeout(() => {
      dom.modal.classList.add('hidden');
      state.selectedProduct = null;
    }, 300);
  }

  // ---------- Quantity / Total ----------
  function updateTotal() {
    const product = state.selectedProduct;
    if (!product) return;

    const qty = clampQty(state.qty);
    const total = Number(product.price_per_kg) * qty;

    dom.qtyInput.value = formatQty(qty);
    dom.modalTotal.textContent = formatCurrency(total);
    dom.modalCalc.textContent = `${formatCurrency(product.price_per_kg)} × ${formatQty(qty)} Kg`;

    // Disable minus button at min
    if (dom.qtyMinus) dom.qtyMinus.disabled = qty <= MIN_QTY;
    if (dom.qtyPlus) dom.qtyPlus.disabled = qty >= MAX_QTY;
  }

  function setQtyFromInput(rawValue) {
    const parsed = parseFloat(String(rawValue).replace(/[^\d.]/g, ''));
    if (!isFinite(parsed)) {
      // Reset on invalid
      state.qty = MIN_QTY;
    } else {
      state.qty = clampQty(parsed);
    }
    updateTotal();
  }

  // ---------- WhatsApp send ----------
  function sendEnquiry() {
    const product = state.selectedProduct;
    if (!product) return;
    const qty = clampQty(state.qty);
    const total = Number(product.price_per_kg) * qty;

    if (window.MayechWhatsApp && typeof window.MayechWhatsApp.openEnquiry === 'function') {
      window.MayechWhatsApp.openEnquiry(product, qty, total);
      closeModal();
    } else {
      console.error('[app] WhatsApp module not available');
    }
  }

  // ---------- Drawer ----------
  function openDrawer() {
    if (!dom.mobileMenu) return;
    dom.mobileMenu.classList.remove('hidden');
    dom.menuBtn?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('modal-open');
    state.drawerOpen = true;
    safeIconRefresh();
  }

  function closeDrawer() {
    if (!dom.mobileMenu) return;
    dom.mobileMenu.classList.add('hidden');
    dom.menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('modal-open');
    state.drawerOpen = false;
  }

  // ---------- Nav scroll spy + header shadow ----------
  function setupScrollSpy() {
    const sections = ['home', 'products', 'about', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    function onScroll() {
      const y = window.scrollY + 90;
      let current = 'home';
      for (const sec of sections) {
        if (sec.offsetTop <= y) current = sec.id;
      }

      dom.navLinks.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('data-nav') === current);
      });
      dom.bottomNavItems.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('data-bottom-nav') === current);
      });

      // Header shadow
      if (dom.header) {
        if (window.scrollY > 4) {
          dom.header.classList.add('shadow-md');
        } else {
          dom.header.classList.remove('shadow-md');
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Event wiring ----------
  function setupEvents() {
    // Modal close
    dom.modalClose?.addEventListener('click', closeModal);
    dom.modal?.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', closeModal);
    });

    // Quantity
    dom.qtyMinus?.addEventListener('click', () => {
      state.qty = clampQty(state.qty - QTY_STEP);
      updateTotal();
    });
    dom.qtyPlus?.addEventListener('click', () => {
      state.qty = clampQty(state.qty + QTY_STEP);
      updateTotal();
    });
    dom.qtyInput?.addEventListener('input', (e) => setQtyFromInput(e.target.value));
    dom.qtyInput?.addEventListener('blur', (e) => setQtyFromInput(e.target.value));
    dom.qtyInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendEnquiry();
      }
    });

    // Send enquiry
    dom.sendBtn?.addEventListener('click', sendEnquiry);

    // Drawer open/close
    dom.menuBtn?.addEventListener('click', openDrawer);
    dom.menuClose?.addEventListener('click', closeDrawer);
    dom.mobileMenu?.querySelectorAll('[data-menu-close]').forEach((el) => {
      el.addEventListener('click', closeDrawer);
    });

    // Esc key closes modal / drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (state.modalOpen) closeModal();
        if (state.drawerOpen) closeDrawer();
      }
    });

    // WhatsApp entry points (general chat)
    const openGeneralChat = (e) => {
      e.preventDefault();
      if (window.MayechWhatsApp) window.MayechWhatsApp.openChat();
    };
    dom.headerWhatsapp?.addEventListener('click', openGeneralChat);
    dom.heroWhatsapp?.addEventListener('click', openGeneralChat);
    dom.drawerWhatsapp?.addEventListener('click', openGeneralChat);
    dom.contactWhatsapp?.addEventListener('click', openGeneralChat);
    dom.fabWhatsapp?.addEventListener('click', openGeneralChat);

    // Footer year
    if (dom.year) dom.year.textContent = new Date().getFullYear();
  }

  // ---------- Boot ----------
  async function init() {
    setupEvents();
    setupScrollSpy();

    // Set initial WhatsApp hrefs to real URLs so right-click-copy works
    // (also acts as a graceful fallback if JS click handler fails)
    if (window.MayechWhatsApp) {
      const wa = window.MayechWhatsApp;
      const url = wa.buildWaUrl(wa.BUSINESS_CONFIG.primaryPhone, wa.buildChatMessage());
      ['headerWhatsapp', 'heroWhatsapp', 'drawerWhatsapp', 'contactWhatsapp', 'fabWhatsapp']
        .forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.href = url;
        });
    }

    // Load products
    try {
      const products = await loadProducts();
      state.products = products;
      renderProducts(products);
    } catch (err) {
      console.error('[app] Failed to load products:', err);
      dom.productsError?.classList.remove('hidden');
    }

    safeIconRefresh();
  }

  // Run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();