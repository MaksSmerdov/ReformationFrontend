import { useTranslation } from 'react-i18next';

const projectTypes = () => {
	// src/components/supervisor/Projects/ProjectsTable.jsx
	const { t } = useTranslation('translation', { keyPrefix: 'application.project.types' });

	return {
		1: t('project_type_1'),
		2: t('project_type_2')
	};
};

export default projectTypes;
