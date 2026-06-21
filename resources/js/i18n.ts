import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar.json';
import en from './locales/en.json';

i18n.use(initReactI18next).init({
    resources: {
        ar: { translation: ar },
        en: { translation: en },
    },
    // اللغة الافتراضية من الـ HTML lang attribute الذي يضبطه Laravel
    lng: document.documentElement.lang || 'ar',
    fallbackLng: 'ar',
    interpolation: {
        escapeValue: false, // React يتولى الـ XSS
    },
});

export default i18n;
