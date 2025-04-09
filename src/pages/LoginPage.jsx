import { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { login } from '@slices/core/authSlice';
import SelectSiteLanguage from '@components/common/select/SelectSiteLanguage';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

const LoginPage = () => {
	const [loginField, setLoginField] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const { t } = useTranslation('translation', { keyPrefix: 'pages.login_page' });
	const dispatch = useDispatch();
	const authStatus = useSelector((state) => state.auth.status);
	const token = useSelector((state) => state.auth.token);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			await dispatch(login({ login: loginField, password })).unwrap();
		} catch (err) {
			console.error('Error:', err);
			setError(err.message || 'Login error');
		}
	};

	return (
		<Container fluid className="d-flex justify-content-center align-items-center vh-100 vw-100">
			<Row className="w-100 justify-content-center">
				<Col xs={12} sm={8} md={6} lg={4}>
					<h1 className="text-center">Kirjaudu Editoriin</h1>
					<Form onSubmit={handleSubmit} className="p-4 border rounded bg-body">
						<Form.Group controlId="formLogin" className="mb-3">
							<Form.Label className="m-0">{t('username')}</Form.Label>
							<Form.Control type="text" value={loginField} onChange={(e) => setLoginField(e.target.value)} placeholder={t('username_placeholder')} autoComplete="username" />
						</Form.Group>

						<Form.Group controlId="formPassword" className="mb-3">
							<Form.Label className="m-0">{t('password')}</Form.Label>
							<InputGroup>
								<Form.Control type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('password_placeholder')} autoComplete="current-password" />
								<Button variant="outline-secondary" className="d-flex align-content-center flex-wrap" onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? <EyeSlashFill className="w-100 h-100 p-1" /> : <EyeFill className="w-100 h-100 p-1" />}
								</Button>
							</InputGroup>
						</Form.Group>

						{error && (
							<Alert variant="danger" className="mb-3">
								{error}
							</Alert>
						)}

						<div>
							{/* <SelectSiteLanguage /> */}
							<div className="d-flex justify-content-end align-items-center">
								<Button variant="primary" type="submit" disabled={authStatus === 'loading'}>
									{t('button')}
								</Button>
							</div>
						</div>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default LoginPage;
