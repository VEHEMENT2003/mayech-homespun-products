/* ================================================================
   js/products.js — Fallback product dataset
   ---------------------------------------------------------------
   Used when Supabase is not configured or a network request fails.
   The `app.js` orchestrator decides when to fall back.
   ================================================================ */
(function (global) {
  'use strict';

  const FALLBACK_PRODUCTS = [
    {
      id: 'p1',
      name_mr: 'भाजणी चकली',
      name_en: 'Bhajni Chakali',
      price_per_kg: 680,
      image_url: 'assets/products/bhajni-chakali.webp',
      description_mr: 'पारंपरिक भाजणीपासून बनवलेली खमंग चकली.',
      description_en: 'Traditional crispy chakali made from home-ground bhajni flour.',
      display_order: 1
    },
    {
      id: 'p2',
      name_mr: 'पातळ पोहे चिवडा',
      name_en: 'Patal Pohe Chiwada',
      price_per_kg: 460,
      image_url: 'assets/products/patal-pohe-chiwada.webp',
      description_mr: 'पातळ पोहे व मसाल्यांचा हलका-खमंग चिवडा.',
      description_en: 'Light and crunchy chiwada made with thin poha and spices.',
      display_order: 2
    },
    {
      id: 'p3',
      name_mr: 'भाजके पोहे चिवडा',
      name_en: 'Bhajke Pohe Chiwada',
      price_per_kg: 500,
      image_url: 'assets/products/bhajke-pohe-chiwada.webp',
      description_mr: 'भाजके पोहे व शेंगदाण्यांचा चविष्ट चिवडा.',
      description_en: 'Flavourful chiwada made with roasted poha and peanuts.',
      display_order: 3
    },
    {
      id: 'p4',
      name_mr: 'मका चिवडा',
      name_en: 'Maka Chiwada',
      price_per_kg: 460,
      image_url: 'assets/products/maka-chiwada.webp',
      description_mr: 'मका व मसाल्यांचा खुसखुशीत चिवडा.',
      description_en: 'Crispy corn chiwada with a blend of traditional spices.',
      display_order: 4
    },
    {
      id: 'p5',
      name_mr: 'बेसन लाडू',
      name_en: 'Besan Ladu',
      price_per_kg: 700,
      image_url: 'assets/products/besan-ladu.webp',
      description_mr: 'शुद्ध तुपातील बेसनाचे गोड लाडू.',
      description_en: 'Sweet besan ladu made in pure ghee.',
      display_order: 5
    },
    {
      id: 'p6',
      name_mr: 'गोड शंकरपाळी',
      name_en: 'God Shankarpali',
      price_per_kg: 600,
      image_url: 'assets/products/god-shankarpali.webp',
      description_mr: 'तुपात तळलेली गोड शंकरपाळी.',
      description_en: 'Sweet shankarpali fried in ghee.',
      display_order: 6
    },
    {
      id: 'p7',
      name_mr: 'खारी शंकरपाळी',
      name_en: 'Khari Shankarpali',
      price_per_kg: 460,
      image_url: 'assets/products/khari-shankarpali.webp',
      description_mr: 'खमंग व खुसखुशीत खारी शंकरपाळी.',
      description_en: 'Crispy savoury shankarpali.',
      display_order: 7
    },
    {
      id: 'p8',
      name_mr: 'शेव',
      name_en: 'Shev',
      price_per_kg: 500,
      image_url: 'assets/products/shev.webp',
      description_mr: 'बारीक शेव, पारंपरिक पद्धतीने तयार.',
      description_en: 'Fine sev prepared in the traditional way.',
      display_order: 8
    },
    {
      id: 'p9',
      name_mr: 'अनारसे',
      name_en: 'Anarse',
      price_per_kg: 680,
      image_url: 'assets/products/anarse.webp',
      description_mr: 'तांदळाच्या पिठाचे पारंपरिक गोड अनारसे.',
      description_en: 'Traditional sweet anarse made from rice flour.',
      display_order: 9
    }
  ];

  global.MayechProducts = { FALLBACK_PRODUCTS };
})(window);