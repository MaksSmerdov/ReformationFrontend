import ProjectsTable from '@components/dashboard/ProjectsTable';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'pages.dashboard_page' });

	return (
		<div className="w-100 d-flex flex-column align-items-center text-nowrap">
			<h1 className="py-4">{t('title')}</h1>
			<ProjectsTable />
		</div>
	);
};

export default DashboardPage;
