import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectGuideById } from '@slices/facades/guidesSlice';
import { selectElementsByFacadeId } from '@slices/facades/elementsSlice';
import { getExactElementsInRange, getElementsInRange, getOverlappingElementsInRange } from '@utils/facades/elementSelectUtils';

const FacadeViewPageContext = createContext();

export const FacadeViewPageProvider = ({ children, facadeIdProp, projectIdProp }) => {
	const [viewMode, setViewMode] = useState('view');

	const [selectedStatus, setSelectedStatus] = useState(null);
	const [openStatusGroups, setOpenStatusGroups] = useState([]);

	const [projectId, setProjectId] = useState(projectIdProp);
	const [facadeId, setFacadeId] = useState(facadeIdProp);

	const project = useSelector((state) => state.projects.byId[projectId]);
	const projectTypeId = project?.project_type_id;

	const [direction, setDirection] = useState(null);

	const [selectedGuideIds, setSelectedGuideIds] = useState([]);
	const [selectedUnrealGuideIds, setSelectedUnrealGuideIds] = useState([]);
	const [selectedGroupsIds, setSelectedGroupsIds] = useState([]);
	const [selectedElementIds, setSelectedElementIds] = useState([]);

	const [hiddenGroupIds, setHiddenGroupIds] = useState([]);
	const [focusedEntity, setFocusedEntity] = useState(null);

	const guides = useSelector((state) => state.guides.byId);
	const elements = useSelector((state) => state.elements.byFacadeId);

	const getExactElementsInRangeWrapper = (direction, coordinate, size) => {
		return getExactElementsInRange(elements[facadeId], direction, coordinate, size);
	};

	const getElementsInRangeWrapper = (direction, coordinate, size) => {
		return getElementsInRange(elements[facadeId], direction, coordinate, size);
	};

	const getOverlappingElementsInRangeWrapper = (direction, coordinate, size) => {
		return getOverlappingElementsInRange(elements[facadeId], direction, coordinate, size);
	};

	const changeDirection = (direction) => {
		setDirection(direction);
	};

	const updateSelectedElementIds = (isSelected, elementsInRange) => {
		if (isSelected) {
			setSelectedElementIds([...selectedElementIds, ...elementsInRange.map((element) => element.id)]);
		} else {
			setSelectedElementIds(selectedElementIds.filter((elementId) => !elementsInRange.some((element) => element.id === elementId)));
		}
	};

	const handleMeasurementLineClick = ({ direction, coordinate, size }) => {
		const elementsInRange = getExactElementsInRangeWrapper(direction, coordinate, size);
		const allSelected = elementsInRange.every((element) => selectedElementIds.includes(element.id));

		if (allSelected) {
			return {
				elements: elementsInRange,
				action: 'deselect'
			};
		} else {
			return {
				elements: elementsInRange,
				action: 'select'
			};
		}
	};

	const isGuideSelected = (id) => selectedGuideIds.includes(id);

	const toggleGuideSelection = (id, isSelected, isOverlapping = false) => {
		const guide = guides[id];

		updateSelectedElementIds(isSelected, (isOverlapping ? getOverlappingElementsInRangeWrapper : getElementsInRangeWrapper)(guide.direction, guide.coordinate, guide.size));

		if (isSelected) {
			if (!selectedGuideIds.includes(id)) {
				setSelectedGuideIds([...selectedGuideIds, id]);
			}
		} else {
			setSelectedGuideIds(selectedGuideIds.filter((selectedId) => selectedId !== id));
		}
	};

	const isUnrealGuideSelected = (id) => selectedUnrealGuideIds.includes(id);

	const toggleUnrealGuideSelection = (guide, isSelected, isOverlapping = false) => {
		updateSelectedElementIds(isSelected, (isOverlapping ? getOverlappingElementsInRangeWrapper : getElementsInRangeWrapper)(guide.direction, guide.coordinate, guide.size));

		if (isSelected) {
			if (!selectedUnrealGuideIds.includes(guide.id)) {
				setSelectedUnrealGuideIds([...selectedUnrealGuideIds, guide.id]);
			}
		} else {
			setSelectedUnrealGuideIds(selectedUnrealGuideIds.filter((selectedId) => selectedId !== guide.id));
		}
	};

	const isElementSelected = (id) => selectedElementIds.includes(id);

	const toggleElementSelection = (id, isSelected) => {
		if (isSelected) {
			if (!selectedElementIds.includes(id)) {
				setSelectedElementIds([...selectedElementIds, id]);
			}
		} else {
			setSelectedElementIds(selectedElementIds.filter((selectedId) => selectedId !== id));
		}
	};

	const toggleElementMassSelection = (elementIds, isSelected) => {
		if (isSelected) {
			const newSelectedElementIds = [...new Set([...selectedElementIds, ...elementIds])];
			setSelectedElementIds(newSelectedElementIds);
		} else {
			const newSelectedElementIds = selectedElementIds.filter((id) => !elementIds.includes(id));
			setSelectedElementIds(newSelectedElementIds);
		}
	};

	const isGroupSelected = (id) => selectedGroupsIds.includes(id);

	const toggleGroupSelection = (id, isSelected) => {
		if (isSelected) {
			if (!selectedGroupsIds.includes(id)) {
				setSelectedGroupsIds([...selectedGroupsIds, id]);
			}
		} else {
			setSelectedGroupsIds(selectedGroupsIds.filter((selectedId) => selectedId !== id));
		}
	};

	const isGroupHidden = (id) => hiddenGroupIds.includes(id);

	const toggleGroupHidden = (id, isHidden) => {
		if (isHidden) {
			if (!hiddenGroupIds.includes(id)) {
				setHiddenGroupIds([...hiddenGroupIds, id]);
			}
		} else {
			setHiddenGroupIds(hiddenGroupIds.filter((hiddenId) => hiddenId !== id));
		}
	};

	const handleStatusSelect = (statusId) => {
		console.log('handleStatusSelect', statusId);
		setSelectedStatus(statusId);
	};

	const handleToggleVisibility = (groupId, isVisible) => {
		console.log('handleToggleVisibility', groupId, isVisible);
		setOpenStatusGroups((prev) => {
			if (isVisible) {
				return [...prev, groupId];
			} else {
				return prev.filter((id) => id !== groupId);
			}
		});
	};

	const resetSelection = () => {
		setSelectedGuideIds([]);
		setSelectedGroupsIds([]);
		setSelectedElementIds([]);
	};

	const handleMeasurementLineContextClick = ({ direction, coordinate, size }) => {
		const elementsInRange = getExactElementsInRangeWrapper(direction, coordinate, size);
		const allSelected = elementsInRange.every((element) => selectedElementIds.includes(element.id));

		if (allSelected) {
			const newFilteredElements = selectedElementIds.filter((elementId) => !elementsInRange.some((element) => element.id === elementId));
			setSelectedElementIds(newFilteredElements);
		} else {
			const newSelectedElementIds = [...selectedElementIds];
			elementsInRange.forEach((element) => {
				if (!newSelectedElementIds.includes(element.id)) {
					newSelectedElementIds.push(element.id);
				}
			});
			setSelectedElementIds(newSelectedElementIds);
		}
	};

	return (
		<FacadeViewPageContext.Provider
			value={{
				projectId,
				setProjectId,
				projectTypeId,
				facadeId,
				setFacadeId,
				selectedStatus,
				setSelectedStatus,
				openStatusGroups,
				setOpenStatusGroups,
				selectedElementIds,
				setSelectedElementIds,
				selectedGroupsIds,
				setSelectedGroupsIds,
				hiddenGroupIds,
				setHiddenGroupIds,
				isElementSelected,
				toggleElementMassSelection,
				toggleElementSelection,
				selectedGuideIds,
				isGuideSelected,
				toggleGuideSelection,
				isUnrealGuideSelected,
				toggleUnrealGuideSelection,
				focusedEntity,
				setFocusedEntity,
				viewMode,
				setViewMode,
				isGroupHidden,
				toggleGroupHidden,
				isGroupSelected,
				toggleGroupSelection,
				handleMeasurementLineClick,
				handleStatusSelect,
				handleToggleVisibility,
				direction,
				changeDirection,
				resetSelection,
				handleMeasurementLineContextClick
			}}>
			{children}
		</FacadeViewPageContext.Provider>
	);
};

export const useFacadeViewPage = () => useContext(FacadeViewPageContext);
