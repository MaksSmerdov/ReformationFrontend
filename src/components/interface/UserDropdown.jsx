import { useDispatch, useSelector } from 'react-redux';
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { logout } from '@slices/core/authSlice';
import ThemeSwitcher from '@components/common/switcher/ThemeSwitcher';

const UserDropdown = () => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.auth.user);
	const { t } = useTranslation('translation', { keyPrefix: 'components.interface.header' });

	const handleLogout = () => {
		dispatch(logout())
			.unwrap()
			.then(() => {
				window.location.reload();
			})
			.catch((error) => {
				console.error('Logout failed:', error);
			});
	};

	return (
		<NavDropdown className="py-2" title={t('profile')} align="end">
			<NavDropdown.Item disabled className="text-center">
				{t('user_is')}: {currentUser.first_name} {currentUser.last_name}
			</NavDropdown.Item>
			<NavDropdown.Divider />
			{/* <NavDropdown.Item className="text-center">
				<ThemeSwitcher />
			</NavDropdown.Item> */}
			<NavDropdown.Item href="/profile" className="text-center">
				{t('profile')}
			</NavDropdown.Item>
			<NavDropdown.Item onClick={handleLogout} className="text-center">
				{t('logout')}
			</NavDropdown.Item>
		</NavDropdown>
	);
};

export default UserDropdown;
