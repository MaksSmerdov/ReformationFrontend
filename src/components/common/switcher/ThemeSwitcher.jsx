import React, { useCallback } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@slices/local/themeSlice';
import { useTranslation } from 'react-i18next';

/**
 * Компонент переключателя темы.
 * Позволяет пользователю переключаться между светлой и темной темами.
 */
const ThemeSwitcher = () => {
	// Получение текущей темы из Redux
	const theme = useSelector((state) => state.theme.theme);

	// Диспетчер для отправки действий в Redux
	const dispatch = useDispatch();

	// Локализация
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.switcher.theme' });

	// Обработчик переключения темы
	const handleToggleTheme = useCallback(() => {
		dispatch(toggleTheme());
	}, [dispatch]);

	return (
		<Form className="d-flex gap-2 align-items-center">
			<Form.Check type="switch" id="theme-switch" checked={theme === 'dark'} onChange={handleToggleTheme} className="m-0" label={theme === 'light' ? t('lightMode') : t('darkMode')} />
		</Form>
	);
};

export default ThemeSwitcher;
