import React, { useMemo, useState } from 'react';
import { Button, Card, Modal, Form, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm } from "react-hook-form";
import NewTreeViewItem from '@components/project/facades/facade_view_page/components/new_tree_view/NewTreeViewItem';
import { useNewFacadeTreeView } from '@contexts/facades_view/NewFacadeTreeViewContext';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { storeWithElements, storeWithGroups, storeWithClusters, selectGroupError } from '@slices/facades/elementGroupsAdditionalSlice';
import { fetchElementsByFacadeId } from '@slices/facades/elementsSlice';
import { fetchElementGroupsByFacadeId } from '@slices/facades/elementGroupsSlice';
import { LayerPanel } from '../layer_panel';

const CREATE_GROUP = 'create_group';
const CREATE_CLUSTER = 'create_cluster';
const CREATE_LAYER = 'create_layer';

const NewTreeViewComponent = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_view_page.tree_view' });
	const { register, handleSubmit, reset, formState: { errors } } = useForm();
	const { items } = useNewFacadeTreeView();
	const { selectedGroupsIds, selectedElementIds, facadeId, resetSelection } = useFacadeViewPage();
	const elementGroups = useSelector((state) => state.elementGroups.byFacadeId[facadeId] || []);
	const sliceError = useSelector(selectGroupError);
	const [shomModal, setShowModal] = useState(false);
	const [createMode, setCreateMode] = useState();
	const [contextMenu, setContextMenu] = useState(null);
	const dispatch = useDispatch();

	const [layers, clusters] = useMemo(() => {
		const elementGroups = items.find(item => item.key === 'elementGroups');
		if (!elementGroups) {
			return [[], []];
		}
		const layers = [];
		const clusters = [];

		elementGroups.children.forEach(layer => {
			layers.push({
				id: layer.entityId,
				label: layer.label,
			})

			layer.children.forEach(cluster => {
				clusters.push({
					id: cluster.entityId,
					label: cluster.label,
				})
			})
		})
		return [layers, clusters];
	}, [elementGroups, items]);

	const handleContextMenu = (event) => {
		event.preventDefault();
		setContextMenu(
			contextMenu === null
				? {
					mouseX: event.clientX + 2,
					mouseY: event.clientY - 6,
				}
				: null,
		);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	}

	const handleCloseMenu = () => {
		setContextMenu(null);
	}

	const handleCreateNewGroup = () => {
		setContextMenu(null);
		setShowModal(true);
		setCreateMode(CREATE_GROUP);
	}

	const handleCreateNewCluster = () => {
		setContextMenu(null);
		setShowModal(true);
		setCreateMode(CREATE_CLUSTER);
	}

	const handleCreateNewLayer = () => {
		setContextMenu(null);
		setShowModal(true);
		setCreateMode(CREATE_LAYER);
	}

	const onSubmit = async (formData) => {
		setShowModal(false);
		if (createMode === CREATE_GROUP) {
			const data = {
				type: 'group',
				title: formData.groupName,
				element_ids: selectedElementIds,
				parent_id: formData.parentClusterId,
			};
			await dispatch(storeWithElements({ facadeId, data }));
		}

		if (createMode === CREATE_CLUSTER) {
			const data = {
				type: 'cluster',
				title: formData.groupName,
				group_ids: selectedGroupsIds,
				parent_id: formData.parentLayerId
			};
			await dispatch(storeWithGroups({ facadeId, data }));
		}

		if (createMode === CREATE_LAYER) {
			const data = {
				type: 'layer',
				title: formData.groupName,
				cluster_ids: selectedGroupsIds,
			};
			await dispatch(storeWithClusters({ facadeId, data }));
		}

		await dispatch(fetchElementsByFacadeId(facadeId));
		await dispatch(fetchElementGroupsByFacadeId(facadeId));
		reset();
		resetSelection();
	};

	return (
		<div>
			<LayerPanel facadeId={facadeId} />
			<div onContextMenu={handleContextMenu} className="border border-1 rounded p-2 overflow-y-auto" style={{ maxHeight: "800px", minWidth: "300px" }}>
				<div className="d-flex flex-column overflow-y-auto">
					<Card className="rounded-0 border border-end-1 border-start-0 border-top-0">
						{items.map((item, index) => (
							<NewTreeViewItem
								key={item.key}
								item={item}
								parentKey={null}
								index={index}
							/>
						))}
					</Card>
				</div>
				<Menu
					open={contextMenu !== null}
					onClose={handleCloseMenu}
					anchorReference="anchorPosition"
					anchorPosition={
						contextMenu !== null
							? { top: contextMenu.mouseY, left: contextMenu.mouseX }
							: undefined
					}
				>
					{selectedElementIds.length > 0 && <MenuItem onClick={handleCreateNewGroup}>{t('context_menu.create_group')}</MenuItem>}
					{
						selectedGroupsIds.length > 0 &&
						<>
							<MenuItem onClick={handleCreateNewCluster}>{t('context_menu.create_cluster')}</MenuItem>
							<MenuItem onClick={handleCreateNewLayer}>{t('context_menu.create_layer')}</MenuItem>
						</>
					}
				</Menu>
			</div>
			{sliceError && (
				<Alert variant="danger" className="mb-3">
					{sliceError}
				</Alert>
			)}
			<Modal show={shomModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>
						{createMode === CREATE_GROUP && t('group_modal.group_title')}
						{createMode === CREATE_CLUSTER && t('group_modal.create_cluster')}
						{createMode === CREATE_LAYER && t('group_modal.create_layer')}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="d-flex flex-column gap-2">
					<Form onSubmit={handleSubmit(onSubmit)} className="w-100 d-flex flex-column justify-content-stretch gap-2">
						{
							createMode === CREATE_GROUP &&
							<Form.Group>
								<Form.Label className="m-0">{t('group_modal.parent_cluster')}</Form.Label>
								<Form.Select {...register("parentClusterId")}>
									{clusters.map(item => {
										return (<option key={item.id} value={item.id}>{item.label}</option>)
									})}
								</Form.Select>
							</Form.Group>
						}
						{
							createMode === CREATE_CLUSTER &&
							<Form.Group>
								<Form.Label className="m-0">{t('group_modal.parent_layer')}</Form.Label>
								<Form.Select {...register("parentLayerId")}>
									{layers.map(item => {
										return (<option key={item.id} value={item.id}>{item.label}</option>)
									})}
								</Form.Select>
							</Form.Group>
						}
						<Form.Group>
							<Form.Label className="m-0">
								{createMode === CREATE_GROUP && t('group_modal.group_name')}
								{createMode === CREATE_CLUSTER && t('group_modal.cluster_name')}
								{createMode === CREATE_LAYER && t('group_modal.layer_name')}
							</Form.Label>
							<Form.Control {...register("groupName", { required: true })} className="px-2 py-0" type="text" />
							{errors.groupName && <span>{t('group_modal.error_field')}</span>}
						</Form.Group>
						<Form.Group className="text-end">
							<Button className='w-25' variant="primary" type="submit">
								{t('group_modal.ok_btn')}
							</Button>
						</Form.Group>
					</Form>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default NewTreeViewComponent;
