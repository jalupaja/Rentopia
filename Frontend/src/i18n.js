import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: true,
        supportedLngs: ["en", "de", "fr", "es"],
        detection: {
            order: ["localStorage"],
            caches: ["localStorage"],
        },
        detection: {
            order: ["localStorage", "querystring"],
            caches: ["localStorage"],
        },
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: true,
        },
        backend: {
            loadPath: "/locales/{{lng}}.json",
        },
    });

export default i18n;
