// Internationalization manager
// All user-facing text goes through this system.

const SUPPORTED_LANGUAGES = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  hu: 'Magyar',
  it: 'Italiano',
  pl: 'Polski',
  pt: 'Português',
  ru: 'Русский',
  cs: 'Čeština',
};

let currentLang = 'en';
let strings = {};

export const I18n = {
  SUPPORTED_LANGUAGES,

  get currentLanguage() {
    return currentLang;
  },

  async load(lang) {
    if (!SUPPORTED_LANGUAGES[lang]) {
      console.warn(`Unsupported language: ${lang}, falling back to English`);
      lang = 'en';
    }
    try {
      const mod = await import(`../data/i18n/${lang}.js`);
      strings = mod.default;
      currentLang = lang;
    } catch (e) {
      console.warn(`Failed to load language '${lang}', falling back to English`, e);
      if (lang !== 'en') {
        const mod = await import('../data/i18n/en.js');
        strings = mod.default;
        currentLang = 'en';
      }
    }
  },

  // Get a UI string by key (e.g. "menu.newGame")
  t(key) {
    const parts = key.split('.');
    let val = strings;
    for (const p of parts) {
      val = val?.[p];
    }
    return val ?? key;
  },

  // Get dialogue text: dialogueId, nodeId, field
  dialogue(dialogueId, nodeId, field = 'text') {
    return strings?.dialogues?.[dialogueId]?.[nodeId]?.[field];
  },

  // Get choice text for a dialogue node
  choice(dialogueId, nodeId, choiceIndex) {
    return strings?.dialogues?.[dialogueId]?.[nodeId]?.choices?.[choiceIndex];
  },

  // Get saved language preference
  getSavedLanguage() {
    return localStorage.getItem('dualuna_lang') || 'en';
  },

  saveLanguage(lang) {
    localStorage.setItem('dualuna_lang', lang);
  },
};
