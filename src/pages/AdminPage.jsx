import { Tabs, Tab } from 'react-bootstrap';
import AdminRoute from '@routes/AdminRoute';
import ProjectTypesWithStatusesManager from '@components/admin/ProjectTypesWithStatusesManager';
import UsersTable from '@components/admin/Users/UsersTable';
import RolesTable from '@components/admin/Roles/RolesTable';
import PermissionsTable from '@components/admin/Permissions/PermissionsTable';
import SpecializationsTable from '@components/admin/Specializations/SpecializationsTable';
import { useTranslation } from 'react-i18next';

const AdminPage = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'pages.admin_page' });

	return (
		<AdminRoute>
			<Tabs defaultActiveKey="users" id="admin-tabs" className="px-4 justify-content-center">
				<Tab eventKey="users" title={t('tab_users')} className="px-4 overflow-auto">
					<UsersTable />
				</Tab>
				{/* <Tab eventKey="statuses" title={t('statuses')}>
                    <ProjectTypesWithStatusesManager />
                </Tab> */}
				<Tab eventKey="roles" title={t('roles')} className="px-4 overflow-auto">
					<RolesTable />
				</Tab>
				<Tab eventKey="permissions" title={t('permissions')} className="px-4 overflow-auto">
					<PermissionsTable />
				</Tab>
				<Tab eventKey="specializations" title={t('specializations')} className="px-4 overflow-auto">
					<SpecializationsTable />
				</Tab>
			</Tabs>
		</AdminRoute>
	);
};

export default AdminPage;
