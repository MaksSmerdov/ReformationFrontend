import React, { useState, useMemo, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AdjustIcon from '@mui/icons-material/Adjust';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import { TreeItem2Content, TreeItem2Root, TreeItem2GroupTransition, TreeItem2IconContainer, TreeItem2Label } from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from 'react-redux';
import { fetchElementsByFacadeId } from '@slices/facades/elementsSlice';
import { fetchElementGroupsByFacadeId } from '@slices/facades/elementGroupsSlice';
import { Modal, Form, Button } from 'react-bootstrap';
import api from '@services/api';

const ELEMENT_TYPE = 'element';
const CLUSTER_TYPE = 'cluster';
const GROUP_TYPE = 'group';
const LAYER_TYPE = 'layer';

function getNewType(typeName) {
	if (typeName === ELEMENT_TYPE) return GROUP_TYPE;
	if (typeName === GROUP_TYPE) return CLUSTER_TYPE;
	if (typeName === CLUSTER_TYPE) return LAYER_TYPE;
}

const STATUS_ICONS = {
	focused: <AdjustIcon color="primary" fontSize="small" />,
	selected: <CheckCircleOutlinedIcon color="success" fontSize="small" />,
	disabled: <CancelOutlinedIcon color="action" fontSize="small" />
};

function buildNestedElementGroups(elementGroups, elements) {
	const groupMap = new Map();

	// Создаем словарь групп по их ID
	elementGroups.forEach((group) => {
		groupMap.set(group.id, { ...group, children: [], elements: [] });
	});

	// Распределяем элементы по группам
	elements.forEach((element) => {
		const group = groupMap.get(element.element_group_id);
		if (group) {
			group.elements.push(element);
		}
	});

	// Вкладываем группы друг в друга
	const nestedGroups = [];
	groupMap.forEach((group) => {
		if (group.parent_id) {
			const parentGroup = groupMap.get(group.parent_id);
			if (parentGroup) {
				parentGroup.children.push(group);
			}
		} else {
			nestedGroups.push(group);
		}
	});

	return nestedGroups;
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem({ itemId, id, label, disabled, children, onToggleVisibility, isHidden }, ref) {
	const { getRootProps, getContentProps, getLabelProps, getGroupTransitionProps, getIconContainerProps, status } = useTreeItem2({ id, itemId, label, disabled, children, rootRef: ref });

	return (
		<TreeItem2Provider itemId={itemId}>
			<TreeItem2Root {...getRootProps()}>
				<TreeItem2Content {...getContentProps()} sx={{ padding: 0, gap: '2px' }}>
					<TreeItem2IconContainer {...getIconContainerProps()} sx={{ display: 'flex', height: '100%' }}>
						<TreeItem2Icon status={status} />
					</TreeItem2IconContainer>

					<TreeItem2Label {...getLabelProps()} />

					<Stack direction="row" spacing={1} alignItems="center">
						{Object.keys(STATUS_ICONS).map((iconKey, index) => {
							if (status[iconKey]) {
								return (
									<Box key={index} style={{ marginLeft: 0 }}>
										{STATUS_ICONS[iconKey]}
									</Box>
								);
							}
							return null;
						})}
						<Box onClick={onToggleVisibility} style={{ cursor: 'pointer', marginLeft: 0 }}>
							{isHidden ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
						</Box>
					</Stack>
				</TreeItem2Content>
				{children && <TreeItem2GroupTransition {...getGroupTransitionProps()} />}
			</TreeItem2Root>
		</TreeItem2Provider>
	);
});

function StatusLegend() {
	return (
		<Paper
			variant="outlined"
			elevation={0}
			sx={(theme) => ({
				padding: '4px',
				background: theme.palette.grey[50],
				...theme.applyStyles('dark', {
					background: theme.palette.grey[900]
				})
			})}>
			<Stack>
				<Stack direction="row" spacing={'2px'} alignItems="center">
					{STATUS_ICONS.focused}
					<Typography variant="body2">focused</Typography>
				</Stack>
				<Stack direction="row" spacing={'2px'} alignItems="center">
					{STATUS_ICONS.selected}
					<Typography variant="body2">selected</Typography>
				</Stack>
				<Stack direction="row" spacing={'2px'} alignItems="center">
					{STATUS_ICONS.disabled}
					<Typography variant="body2">disabled</Typography>
				</Stack>
			</Stack>
		</Paper>
	);
}

const TreeViewComponent_old = ({ guides, elementGroups, elements, facadeId }) => {
	const dispatch = useDispatch();
	const [expandedItems, setExpandedItems] = useState(['guides', 'element-groups', ...elementGroups.map((group) => `group-${group.id}`)]);
	const [hiddenItems, setHiddenItems] = useState({});
	const [show, setShow] = useState(false);
	const [contextMenu, setContextMenu] = useState(null);
	const [selectedIds, setSelectedIds] = useState([]);
	const textInput = useRef(null);

	const handleContextMenu = (event) => {
		event.preventDefault();
		setContextMenu(
			contextMenu === null
				? {
						mouseX: event.clientX + 2,
						mouseY: event.clientY - 6
				  }
				: null
		);
	};
	const handleClickMenu = () => {
		setContextMenu(null);
		setShow(true);
	};
	const handleCloseMenu = () => {
		setContextMenu(null);
	};

	const handleExpandedItemsChange = useCallback((event, itemIds) => {
		setExpandedItems(itemIds);
	}, []);

	const handleToggleVisibility = useCallback((id) => {
		setHiddenItems((prev) => ({
			...prev,
			[id]: !prev[id]
		}));
	}, []);

	const handleSelectionChange = (_, ids) => {
		setSelectedIds(ids);
	};

	const handleCloseModal = () => {
		setShow(false);
	};

	const detectedType = useMemo(() => {
		if (selectedIds.length > 0) {
			const first = selectedIds[0].split('|')[0];
			const result = selectedIds.every((item) => {
				const curretType = item.split('|')[0];
				return curretType === first;
			});
			if (result) {
				return first;
			}
		}
	}, [selectedIds]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setShow(false);

		if (selectedIds.length) {
			const ids = selectedIds.map((item) => {
				return item.split('|')[1];
			});

			const clusterId = selectedIds[1].split('|')[3];

			const data = {
				type: getNewType(detectedType),
				title: textInput.current.value,
				parent_id: clusterId
			};

			try {
				if (detectedType === ELEMENT_TYPE) {
					(data.element_ids = ids), await api.post(`facades/${facadeId}/element-groups/store-with-elements`, data);
				}
				if (detectedType === GROUP_TYPE) {
					(data.group_ids = ids), await api.post(`facades/${facadeId}/element-groups/store-with-groups`, data);
				}
				if (detectedType === CLUSTER_TYPE) {
					(data.cluster_ids = ids), await api.post(`facades/${facadeId}/element-groups/store-with-clusters`, data);
				}

				dispatch(fetchElementsByFacadeId(facadeId));
				dispatch(fetchElementGroupsByFacadeId(facadeId));
			} catch (e) {
				console.log(e);
			}
		}
	};

	const nestedElementGroups = useMemo(() => buildNestedElementGroups(elementGroups, elements), [elementGroups, elements]);
	const items = useMemo(
		() => [
			{
				id: 'guides',
				label: 'Guides',
				children: [
					{
						id: 'vertical-guides',
						label: 'Vertical Guides',
						children: guides
							.filter((guide) => guide.direction === 'vertical')
							.map((guide) => ({
								id: `guide-${guide.id}`,
								label: guide.title,
								selectable: true
							}))
					},
					{
						id: 'horizontal-guides',
						label: 'Horizontal Guides',
						children: guides
							.filter((guide) => guide.direction === 'horizontal')
							.map((guide) => ({
								id: `guide-${guide.id}`,
								label: guide.title,
								selectable: true
							}))
					}
				]
			},
			{
				id: 'element-groups',
				label: 'Element Groups',
				children: nestedElementGroups.map((layer) => ({
					id: `${LAYER_TYPE}|${layer.id}`,
					label: layer.title,
					selectable: true,
					hidden: false,
					children: layer.children.map((cluster) => ({
						id: `${CLUSTER_TYPE}|${cluster.id}`,
						label: cluster.title,
						selectable: true,
						hidden: false,
						children: cluster.children.map((group) => ({
							id: `${GROUP_TYPE}|${group.id}|${cluster.id}|${layer.id}`,
							label: group.title,
							selectable: true,
							hidden: false,
							children: group.elements.map((element) => ({
								id: `${ELEMENT_TYPE}|${element.id}|${group.id}|${cluster.id}`,
								label: element.title,
								selectable: true,
								hidden: false
							}))
						}))
					}))
				}))
			}
		],
		[guides, nestedElementGroups]
	);

	return (
		<Stack spacing={0} direction={{ md: 'column' }}>
			<StatusLegend />
			<Paper
				variant="outlined"
				elevation={0}
				sx={(theme) => ({
					padding: 0,
					background: theme.palette.grey[50],
					...theme.applyStyles('dark', {
						background: theme.palette.grey[900]
					}),
					minHeight: 600,
					maxHeight: 600,
					overflow: 'auto'
				})}>
				<Box sx={{ minHeight: 200, minWidth: 300 }}>
					<div onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
						<RichTreeView
							items={items}
							expandedItems={expandedItems}
							onExpandedItemsChange={handleExpandedItemsChange}
							slots={{
								item: (props) => <CustomTreeItem {...props} onToggleVisibility={() => handleToggleVisibility(props.itemId)} isHidden={hiddenItems[props.itemId]} />
							}}
							isItemDisabled={(item) => Boolean(item?.disabled)}
							expansionTrigger="iconContainer"
							onSelectedItemsChange={handleSelectionChange}
							multiSelect
						/>
						<Menu open={contextMenu !== null} onClose={handleCloseMenu} anchorReference="anchorPosition" anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}>
							<MenuItem onClick={handleClickMenu}>Группировать</MenuItem>
						</Menu>
					</div>
				</Box>
			</Paper>
			<Modal show={show} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Создание новой группы</Modal.Title>
				</Modal.Header>
				<Modal.Body className="d-flex flex-column gap-2">
					<Form onSubmit={handleSubmit} className="w-100 d-flex flex-column justify-content-stretch gap-2">
						<Form.Group controlId="formProjectTitle">
							<Form.Label className="m-0">Имя группы</Form.Label>
							<Form.Control ref={textInput} className="px-2 py-0" type="text" />
						</Form.Group>
						<Form.Group className="text-end">
							<Button className="w-25" variant="primary" type="submit">
								ОК
							</Button>
						</Form.Group>
					</Form>
				</Modal.Body>
			</Modal>
		</Stack>
	);
};

export default TreeViewComponent_old;
