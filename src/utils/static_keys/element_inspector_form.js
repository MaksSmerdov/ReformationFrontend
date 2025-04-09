import { useTranslation } from 'react-i18next';

const elementInspectorForm = (text) => {
	// src/components/project/facades/facade_view_page/components/object_inspector/element_panel/ElementChangePanel.jsx
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_view_page.element_inspector_form' });

	t('label_left');
	t('label_bottom');
	t('label_width');
	t('label_height');
	t('placeholder_left');
	t('placeholder_leftDelta');
	t('placeholder_bottom');
	t('placeholder_bottomDelta');
	t('placeholder_width');
	t('placeholder_widthDelta');
	t('placeholder_height');
	t('placeholder_heightDelta');
};
