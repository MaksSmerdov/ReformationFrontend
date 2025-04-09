import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AbilityContext } from '@services/ability';
import Clock from '@components/interface/Clock';
import UserDropdown from '@components/interface/UserDropdown';

const Header = () => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.auth.user);
	const location = useLocation();
	const { ability } = useContext(AbilityContext);
	const { t } = useTranslation('translation', { keyPrefix: 'components.interface.header' });

	return (
		<Navbar expand="sm" className="bg-body-tertiary">
			<Container>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
					<Nav className="">
						<Nav.Item className="py-2">
							<Nav.Link href="/dashboard" className={`py-0 ${location.pathname === '/dashboard' ? 'active' : ''}`}>
								{t('dashboard')}
							</Nav.Link>
						</Nav.Item>
						{ability.can('manage', 'all') && (
							<>
								<Nav.Item className="py-2">
									<Nav.Link href="/admin-panel" className={`py-0 ${location.pathname === '/admin-panel' ? 'active' : ''}`}>
										{t('admin-panel')}
									</Nav.Link>
								</Nav.Item>
								<Nav.Item className="py-2">
									<Nav.Link href="/supervisor-panel" className={`py-0 ${location.pathname === '/supervisor-panel' ? 'active' : ''}`}>
										{t('supervisor-panel')}
									</Nav.Link>
								</Nav.Item>
							</>
						)}
					</Nav>

					<Nav className="gap-4">
						<Clock />
						{/* <SelectSiteLanguage className="py-2" /> */}
						{currentUser && <UserDropdown />}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
