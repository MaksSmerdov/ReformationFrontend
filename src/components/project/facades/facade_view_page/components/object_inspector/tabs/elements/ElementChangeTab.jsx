import React from 'react';
import { Form } from 'react-bootstrap';
import ElementChangePanel from '@components/project/facades/facade_view_page/components/object_inspector/element_panel/panels/ElementChangePanel';
import ElementActionsPanel from '@components/project/facades/facade_view_page/components/object_inspector/element_panel/panels/ElementActionsPanel';
import ErrorBoundary from '@components/common/ErrorBoundary';

const ElementChangeTab = () => {
	return (
		<ErrorBoundary>
			<Form className="p-2 d-flex flex-column gap-2">
				<ElementChangePanel />
				<ElementActionsPanel />
			</Form>
		</ErrorBoundary>
	);
};

export default ElementChangeTab;
