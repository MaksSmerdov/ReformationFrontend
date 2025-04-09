import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import { fetchElementsByFacadeId } from '@slices/facades/elementsSlice';
import { fetchElementGroupsByFacadeId } from '@slices/facades/elementGroupsSlice';
import { storeWithElements, storeWithGroups, storeWithClusters } from '@slices/facades/elementGroupsAdditionalSlice';
import { useTranslation } from 'react-i18next';

const groupTypes = [
	// 'layer',
	// 'cluster', 
	'group'
];

const ElementActionsPanel = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_view_page.element_inspector_actions' });
	const { selectedElementIds, facadeId } = useFacadeViewPage();
	const dispatch = useDispatch();
	const elementGroups = useSelector((state) => state.elementGroups.byFacadeId[facadeId] || []);

	const handleGroupElements = async (groupType) => {
		const data = {
			type: groupType,
			title: t('newGroup', { groupType }),
			element_ids: selectedElementIds
		};

		if (groupType === 'group') {
			const parentCluster = elementGroups.find((group) => group.type === 'cluster');
			data.parent_id = parentCluster ? parentCluster.id : null;
		}

		if (groupType === 'group') {
			await dispatch(storeWithElements({ facadeId, data }));
		}

		await dispatch(fetchElementGroupsByFacadeId(facadeId));
		await dispatch(fetchElementsByFacadeId(facadeId));
	};

	return (
		<>
			<Form.Group controlId="formActions">
				<Form.Label>{t('actions')}</Form.Label>
			</Form.Group>
			<Form.Group controlId="formActionsButtons">
				<div className="d-flex flex-column justify-content-between align-items-center gap-2">
					{selectedElementIds.length > 0 && (
						<>
							{groupTypes.map((groupType) => (
								<Button key={groupType} variant="primary" onClick={() => handleGroupElements(groupType)}>
									{t('createGroup', { groupType })}
								</Button>
							))}
						</>
					)}
				</div>
			</Form.Group>
		</>
	);
};

export default ElementActionsPanel;
