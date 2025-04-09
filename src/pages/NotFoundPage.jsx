import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import SelectSiteLanguage from '@components/common/select/SelectSiteLanguage';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'pages.not_found_page' });

	return (
		<Container fluid className="d-flex justify-content-center align-items-center vh-100 vw-100">
			<Row className="w-100 justify-content-center">
				<Col xs={12} sm={8} md={6} lg={4}>
					<div className="p-4 border rounded bg-body text-center">
						<h1>{t('title')}</h1>
						<div className="d-flex justify-content-between align-items-center">
							{/* <SelectSiteLanguage /> */}
							<Link to="/">
								<Button variant="primary">{t('button')}</Button>
							</Link>
						</div>
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default NotFoundPage;
