/* ================================================================
   js/whatsapp.js — WhatsApp Click-to-Chat integration
   ================================================================ */
(function (global) {
  'use strict';

  // ---- Business contact configuration ----
  const BUSINESS_CONFIG = {
    primaryPhone: '9421031314',
    secondaryPhone: '7058316937',
    countryCode: '91',
    businessName: 'मायेचं | Homespun Products'
  };

  function toIntlNumber(localNumber) {
    const digits = String(localNumber).replace(/\D/g, '');
    return digits.startsWith(BUSINESS_CONFIG.countryCode)
      ? digits
      : BUSINESS_CONFIG.countryCode + digits;
  }

  function formatCurrencyINR(value) {
    return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(value));
  }

  function formatQty(qty) {
    const n = Number(qty);
    if (!isFinite(n) || n <= 0) return '0';
    // Show up to 2 decimals, strip trailing zeros
    return parseFloat(n.toFixed(2)).toString();
  }

  /**
   * Build the enquiry message body (plain text).
   */
  function buildEnquiryMessage(product, qty, total) {
    const qtyStr = formatQty(qty);
    const priceStr = formatCurrencyINR(product.price_per_kg);
    const totalStr = formatCurrencyINR(total);

    return [
      'नमस्कार! मला मायेचं Homespun Products मधून खालील पदार्थ हवेत.',
      '',
      `Product: ${product.name_en}`,
      `Marathi Name: ${product.name_mr}`,
      `Price: ${priceStr} per Kg`,
      `Quantity: ${qtyStr} Kg`,
      `Estimated Total: ${totalStr}`,
      '',
      'कृपया ऑर्डरची माहिती द्या.',
      '',
      'Thank you!'
    ].join('\n');
  }

  /**
   * Build a general "chat" message body.
   */
  function buildChatMessage() {
    return [
      'नमस्कार! मला मायेचं Homespun Products बद्दल माहिती हवी आहे.',
      '',
      'कृपया संपर्क करा.',
      '',
      'Thank you!'
    ].join('\n');
  }

  function buildWaUrl(phone, message) {
    const intl = toIntlNumber(phone);
    return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Open WhatsApp with a product enquiry.
   */
  function openEnquiry(product, qty, total) {
    if (!product) return;
    const message = buildEnquiryMessage(product, qty, total);
    const url = buildWaUrl(BUSINESS_CONFIG.primaryPhone, message);
    global.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Open a general WhatsApp chat.
   */
  function openChat() {
    const message = buildChatMessage();
    const url = buildWaUrl(BUSINESS_CONFIG.primaryPhone, message);
    global.open(url, '_blank', 'noopener,noreferrer');
  }

  global.MayechWhatsApp = {
    BUSINESS_CONFIG,
    toIntlNumber,
    buildEnquiryMessage,
    buildChatMessage,
    buildWaUrl,
    openEnquiry,
    openChat,
    formatCurrencyINR,
    formatQty
  };
})(window);