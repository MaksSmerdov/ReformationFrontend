import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
	.use(HttpApi)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'fi',
		debug: false,
		supportedLngs: ['fi', 'ru'],
		interpolation: {
			escapeValue: false
		},
		detection: {
			order: ['localStorage', 'cookie', 'navigator', 'htmlTag', 'path', 'subdomain'],
			caches: ['localStorage']
		},
		backend: {
			loadPath: '/locales/{{lng}}.json'
		},
		saveMissingKey: true,
		parseMissingKeyHandler: (key) => {
			const segments = key.split('.');
			return segments[segments.length - 1];
		}
	});

export default i18n;
