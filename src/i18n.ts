import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './assets/en.json';
import zh from './assets/zh.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            zh: { translation: zh },
        },
        lng: 'zh', // 默认中文
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n; 