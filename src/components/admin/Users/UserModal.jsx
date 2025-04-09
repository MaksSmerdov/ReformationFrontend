import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { createUser, updateUser } from '@slices/users/usersSlice';
import { useNotification } from '@contexts/application/NotificationContext';
import SelectRole from '@components/common/select/SelectRole';
import SelectPermission from '@components/common/select/SelectPermission';
import UserPhonesComponent from '@components/admin/Users/UserPhonesComponent';

const UserModal = ({ userRecord = null, show, onHide, onSuccess }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.user_modal' });
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [login, setLogin] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	const [roles, setRoles] = useState([]);
	const [permissions, setPermissions] = useState([]);
	const [phones, setPhones] = useState([]);
	const [changePassword, setChangePassword] = useState(false);
	const { addNotification } = useNotification();

	useEffect(() => {
		if (userRecord) {
			setFirstName(userRecord.first_name);
			setLastName(userRecord.last_name);
			setLogin(userRecord.login);
			setEmail(userRecord.email);
			setPassword('');
			setPasswordConfirmation('');
			setRoles(userRecord.roles.map((role) => ({ value: role.id, label: role.name })));
			setPermissions(userRecord.permissions.map((permission) => ({ value: permission.id, label: permission.name })));
			setPhones(userRecord.phones);
			setChangePassword(false);
		} else {
			setFirstName('');
			setLastName('');
			setLogin('');
			setEmail('');
			setPassword('');
			setPasswordConfirmation('');
			setRoles([]);
			setPermissions([]);
			setPhones([]);
			setChangePassword(false);
		}
	}, [userRecord]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (userRecord) {
				const update_user_data = {
					id: userRecord.id,
					first_name: firstName,
					last_name: lastName,
					login,
					email,
					password: changePassword ? password : undefined,
					password_confirmation: changePassword ? passwordConfirmation : undefined,
					roles: roles.map((role) => ({ id: role.value })),
					permissions: permissions.map((permission) => ({ id: permission.value })),
					phones: phones.filter((phone) => !phone.isDeleting).map((phone) => (phone.id ? { id: phone.id, phone: phone.phone } : { phone: phone.phone }))
				};
				await dispatch(updateUser(update_user_data)).unwrap();
				addNotification(t('user_updated'), 'success');
			} else {
				const create_user_data = {
					login,
					first_name: firstName,
					last_name: lastName,
					email,
					password,
					password_confirmation: passwordConfirmation,
					roles: roles.map((role) => ({ id: role.value })),
					permissions: permissions.map((permission) => ({ id: permission.value })),
					phones: phones.filter((phone) => !phone.isDeleting).map((phone) => (phone.id ? { id: phone.id, phone: phone.phone } : { phone: phone.phone }))
				};
				await dispatch(createUser(create_user_data)).unwrap();
				addNotification(t('user_created'), 'success');
			}
			onHide();
			onSuccess();
		} catch (error) {
			addNotification(error.message || t('error_occurred'), 'danger');
		}
	};

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{userRecord ? t('header_update') : t('header_create')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit} autoComplete="off" className="d-flex flex-column gap-2">
					<input type="text" name="fakeusernameremembered" className="d-none" autoComplete="off" />
					<input type="password" name="fakepasswordremembered" className="d-none" autoComplete="off" />

					<Form.Group controlId="formUserLogin">
						<Form.Label className="m-0">{t('login')}*</Form.Label>
						<Form.Control type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder={t('login_placeholder')} required autoComplete="new-username" className="px-2 py-1px lh-1" />
					</Form.Group>

					{userRecord && (
						<Form.Group controlId="formChangePassword">
							<Form.Check type="checkbox" label={t('change_password')} checked={changePassword} onChange={(e) => setChangePassword(e.target.checked)} className="mt-0" />
						</Form.Group>
					)}

					{(!userRecord || changePassword) && (
						<div className="w-100 d-grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
							<input type="text" name="username" value={login} readOnly className="d-none" autoComplete="username" />
							<Form.Group controlId="formUserPassword">
								<Form.Label className="m-0">{t('password')}</Form.Label>
								<Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('password_placeholder')} autoComplete="new-password" className="px-2 py-1px lh-1" />
							</Form.Group>
							<Form.Group controlId="formUserPasswordConfirmation">
								<Form.Label className="m-0">{t('password_confirmation')}</Form.Label>
								<Form.Control type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder={t('password_confirmation_placeholder')} autoComplete="new-password" className="px-2 py-1px lh-1" />
							</Form.Group>
						</div>
					)}

					<div className="w-100 d-grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
						<Form.Group controlId="formUserFirstName">
							<Form.Label className="m-0">{t('first_name')}</Form.Label>
							<Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t('first_name_placeholder')} autoComplete="off" className="px-2 py-1px lh-1" />
						</Form.Group>

						<Form.Group controlId="formUserLastName">
							<Form.Label className="m-0">{t('last_name')}</Form.Label>
							<Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t('last_name_placeholder')} autoComplete="off" className="px-2 py-1px lh-1" />
						</Form.Group>
					</div>

					<Form.Group controlId="formUserEmail">
						<Form.Label className="m-0">{t('email')}</Form.Label>
						<Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('email_placeholder')} autoComplete="off" className="px-2 py-1px lh-1" />
					</Form.Group>

					<Form.Group controlId="formUserRoles" className="mt-0">
						<Form.Label className="m-0">{t('roles')}</Form.Label>
						<SelectRole value={roles} onChange={setRoles} isMulti={true} showDescription={true} />
					</Form.Group>

					<Form.Group controlId="formUserPermissions" className="mt-0">
						<Form.Label className="m-0">{t('permissions')}</Form.Label>
						<SelectPermission value={permissions} onChange={setPermissions} isMulti={true} showDescription={true} />
					</Form.Group>

					<Form.Group className="mt-0">
						<Form.Label className="m-0">{t('phones')}</Form.Label>
						<UserPhonesComponent phones={phones} setPhones={setPhones} />
					</Form.Group>

					<Form.Group className="mt-0 text-center">
						<Button variant="primary" type="submit">
							{userRecord ? t('button_update') : t('button_create')}
						</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default UserModal;
