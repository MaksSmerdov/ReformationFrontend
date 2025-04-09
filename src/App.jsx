import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import MainContainer from '@components/MainContainer';
import AdminPage from '@pages/AdminPage';
import SupervisorPage from '@pages/SupervisorPage';
import DashboardPage from '@pages/DashboardPage';
import ProjectPage from '@pages/ProjectPage';
import NotFoundPage from '@pages/NotFoundPage';
import AccountPage from '@pages/AccountPage';
import CommunicationPage from '@pages/CommunicationPage';
import TestPage from '@pages/TestPage';
import Test2Page from '@pages/Test2Page';
import FacadeViewPage from '@pages/FacadeViewPage';
import ViewApartmentPage from '@pages/ViewApartmentPage';
import ViewWallPage from '@pages/ViewWallPage';
import LurPage from '@pages/LurPage';

import { useSelector } from 'react-redux';
import { AbilityContext, useAbility } from '@services/ability';
import { NotificationProvider } from '@contexts/application/NotificationContext';
import { ConfirmationProvider } from '@contexts/application/ConfirmationContext';

function App() {
	const token = useSelector((state) => state.auth.token);
	const { ability, updateAbility } = useAbility();

	return (
		<AbilityContext.Provider value={{ ability, updateAbility }}>
			<NotificationProvider>
				<ConfirmationProvider>
					<Router>
						<Routes>
							<Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
							<Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
							<Route path="/" element={<MainContainer />}>
								<Route path="dashboard" element={<DashboardPage />} />
								<Route path="project/:projectId" element={<ProjectPage />} />
								<Route path="project/:projectId/facade/:facadeId" element={<FacadeViewPage />} />
								<Route path="project/:projectId/staircase/:staircaseId/apartment/:apartmentId" element={<ViewApartmentPage />} />
								<Route path="project/:projectId/staircase/:staircaseId/apartment/:apartmentId/room/:roomId/wall/:wallId" element={<ViewWallPage />} />
								<Route path="admin-panel" element={<AdminPage />} />
								<Route path="supervisor-panel" element={<SupervisorPage />} />
								<Route path="communication" element={<CommunicationPage />} />
								<Route path="profile" element={<AccountPage />} />
								<Route path="test" element={<TestPage />} />
								<Route path="test2" element={<Test2Page />} />
								<Route path="lur" element={<LurPage />} />
								<Route path="*" element={<NotFoundPage />} />
							</Route>
						</Routes>
					</Router>
				</ConfirmationProvider>
			</NotificationProvider>
		</AbilityContext.Provider>
	);
}

export default App;
