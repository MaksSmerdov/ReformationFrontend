import { Tabs, Tab } from 'react-bootstrap';
import AdminRoute from '@routes/AdminRoute';
import ProjectsTable from '@components/supervisor/Projects/ProjectsTable';
import EquipmentTable from '@components/admin/Equipments/EquipmentTable';
import TeamsTable from '@components/admin/Teams/TeamsTable';
import { useTranslation } from 'react-i18next';

const SupervisorPage = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'pages.supervisor_page' });

	return (
		<AdminRoute>
			<Tabs defaultActiveKey="tab1" id="supervisor-tabs" className="px-4 justify-content-center">
				<Tab eventKey="tab1" title={t('tab_projects')} className="px-4">
					<ProjectsTable />
				</Tab>
				<Tab eventKey="tab2" title={t('tab_equipments')} className="px-4">
					<EquipmentTable />
				</Tab>
				<Tab eventKey="tab3" title={t('tab_teams')} className="px-4">
					<TeamsTable />
				</Tab>
			</Tabs>
		</AdminRoute>
	);
};

export default SupervisorPage;
