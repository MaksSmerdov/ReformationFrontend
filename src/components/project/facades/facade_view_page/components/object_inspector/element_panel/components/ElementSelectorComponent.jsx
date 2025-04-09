import React from 'react';
import { Form, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectElementsByFacadeId } from '@slices/facades/elementsSlice';

const ElementSelectorComponent = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_view_page.element_inspector_panel' });
	const { selectedElementIds, setSelectedElementIds, facadeId } = useFacadeViewPage();
	const elements = useSelector((state) => selectElementsByFacadeId(state, facadeId));

	const handleSelectAllElements = () => {
		const allElementIds = elements.map((element) => element.id);
		setSelectedElementIds(allElementIds);
	};

	const handleDeselectAllElements = () => {
		setSelectedElementIds([]);
	};

	return (
		<Form.Group controlId="formElementsCount" className="d-flex flex-column justify-content-center align-items-center gap-2">
			<Form.Label className="d-flex justify-content-center align-items-center gap-2 fs-5">
				{t('selected')} <Badge bg="secondary">{selectedElementIds.length}</Badge> {t('elements')}
			</Form.Label>
			<ButtonGroup>
				<Button variant="primary" onClick={handleSelectAllElements}>
					{t('selectAll')}
				</Button>
				<Button variant="primary" onClick={handleDeselectAllElements}>
					{t('deselectAll')}
				</Button>
			</ButtonGroup>
		</Form.Group>
	);
};

export default ElementSelectorComponent;
