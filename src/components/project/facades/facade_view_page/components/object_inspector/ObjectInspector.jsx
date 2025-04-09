import React from 'react';
import { Tabs, Tab, Card, Badge } from 'react-bootstrap';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import InspectorElementTab from './tabs/InspectorElementTab';
import ErrorBoundary from '@components/common/ErrorBoundary';
import { useTranslation } from 'react-i18next';

const ObjectInspector = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_view_page.object_inspector' });
	const { selectedGuideIds, selectedGroupsIds, selectedElementIds } = useFacadeViewPage();

	return (
		<ErrorBoundary>
			<div className="d-flex position-relative overflow-y-auto" style={{ maxHeight: '100vh', minWidth: '300px' }}>
				<Card className="d-flex position-fixed bottom-0 end-0 me-2" style={{ width: '300px', marginBottom: '50px' }}>
					<Card.Header className="px-2 py-1">
						<h3>{t('title')}</h3>
					</Card.Header>
					<Card.Body className="p-0">
						<Tabs defaultActiveKey="element">
							<Tab
								eventKey="element"
								title={
									<div className="d-flex align-items-center gap-2">
										<div>{t('tabs.element')}</div>
										<Badge bg="secondary" pill>
											{selectedElementIds.length}
										</Badge>
									</div>
								}>
								<InspectorElementTab />
							</Tab>
							{/* <Tab
								eventKey="group"
								title={
									<div className="d-flex align-items-center gap-2">
										<div>{t('tabs.group')}</div>
										<Badge bg="secondary" pill>
											{selectedGroupsIds.length}
										</Badge>
									</div>
								}>
								{selectedGroupsIds.length > 0 && <ElementGroupDetails id={selectedGroupsIds[0]} />}
							</Tab>
							<Tab
								eventKey="guide"
								title={
									<div className="d-flex align-items-center gap-2">
										<div>{t('tabs.guide')}</div>
										<Badge bg="secondary" pill>
											{selectedGuideIds.length}
										</Badge>
									</div>
								}>
								{selectedGuideIds.length > 0 && <GuideDetails id={selectedGuideIds[0]} />}
							</Tab> */}
						</Tabs>
					</Card.Body>
				</Card>
			</div>
		</ErrorBoundary>
	);
};

export default ObjectInspector;
