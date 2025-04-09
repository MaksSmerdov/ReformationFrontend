import React from 'react';
import { Form } from 'react-bootstrap';
import { MaterialsTable } from '@components/project/facades/facade_view_page/components/object_inspector/element_panel/material_table/index';
import ErrorBoundary from '@components/common/ErrorBoundary';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';

const ElementMaterialTab = () => {
	const { selectedElementIds, facadeId } = useFacadeViewPage();

	return (
		<ErrorBoundary>
			<MaterialsTable selectedElementIds={selectedElementIds} facadeId={facadeId} />
		</ErrorBoundary>
	);
};

export default ElementMaterialTab;
