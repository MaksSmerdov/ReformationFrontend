import { useTranslation } from 'react-i18next';

const directions = (text) => {
	// src/components/common/select/simple/SelectFacadeDirection.jsx
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select.facade_direction' });

	t('direction_north');
	t('direction_north_east');
	t('direction_east');
	t('direction_south_east');
	t('direction_south');
	t('direction_south_west');
	t('direction_west');
	t('direction_north_west');
};
