import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    supportedLngs: ['en', 'hi', 'es', 'gu'],
    
    interpolation: {
      escapeValue: false
    },

    backend: {
      loadPath: '/locales/{{lng}}/translation.json'
    },

    react: {
      useSuspense: false
    }
  });

i18n.dir = () => {
  const currentLang = i18n.language;
  return currentLang === 'ar' || currentLang === 'he' ? 'rtl' : 'ltr';
};

export default i18n;