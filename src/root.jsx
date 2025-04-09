import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@assets/styles/AppStyle.scss';
import { I18nextProvider } from 'react-i18next';
import i18n from '@utils/i18n';
import { Provider } from 'react-redux';
import store from '@services/store';

const Root = () => {
	return (
		<I18nextProvider i18n={i18n}>
			<App />
		</I18nextProvider>
	);
};

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<Root />
		</Provider>
	</StrictMode>
);
