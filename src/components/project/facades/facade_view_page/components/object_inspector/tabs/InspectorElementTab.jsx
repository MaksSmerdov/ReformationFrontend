import React from 'react';
import { Tabs, Tab, Card } from 'react-bootstrap';
import ElementSelectorComponent from '@components/project/facades/facade_view_page/components/object_inspector/element_panel/components/ElementSelectorComponent';
import ElementChangeTab from './elements/ElementChangeTab';
import ElementTicketsTab from './elements/ElementTicketsTab';
import ElementMaterialTab from './elements/ElementMaterialTab';
import { useTranslation } from 'react-i18next';

const InspectorElementTab = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_view_page.object_inspector' });

	return (
		<div>
			<div className="p-2">
				<ElementSelectorComponent />
			</div>
			<Tabs defaultActiveKey="change" id="inspector-element-tabs" className="mt-3">
				<Tab eventKey="change" title={t('tabs.elementChanges')}>
					<ElementChangeTab />
				</Tab>
				<Tab eventKey="tickets" title={t('tabs.elementTickets')}>
					<ElementTicketsTab />
				</Tab>
				<Tab eventKey="materials" title={t('tabs.elementMaterials')}>
					<ElementMaterialTab />
				</Tab>
			</Tabs>
		</div>
	);
};

export default InspectorElementTab;
