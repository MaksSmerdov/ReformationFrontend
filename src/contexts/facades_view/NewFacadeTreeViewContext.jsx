import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';

const NewFacadeTreeViewContext = createContext();

export const NewFacadeTreeViewProvider = ({ children, items, guides, elementGroups, elements }) => {
	const [treeItems, setTreeItems] = useState(items);
	const { selectedGuideIds, selectedGroupsIds, selectedElementIds } = useFacadeViewPage();
	const [expandedItems, setExpandedItems] = useState(() => ['guides', 'elementGroups', ...elementGroups.map((group) => `group-${group.id}`)], [elementGroups]);

	useEffect(()=>{
		setTreeItems(items);
	},[items]);

	const handleExpandedItemsChange = useCallback((event, itemIds) => {
		setExpandedItems(itemIds);
	}, []);

	const isItemSelectable = useCallback((item) => {
		const selectableTypes = ['group', 'guide', 'element'];
		return selectableTypes.includes(item.entityType);
	}, []);

	const handleSelectItem = (itemId) => {
		setSelectedItems((prevSelectedItems) => (prevSelectedItems.includes(itemId) ? prevSelectedItems.filter((id) => id !== itemId) : [...prevSelectedItems, itemId]));
	};

	const handleToggleExpand = (itemId) => {
		setExpandedItems((prevExpandedItems) => (prevExpandedItems.includes(itemId) ? prevExpandedItems.filter((id) => id !== itemId) : [...prevExpandedItems, itemId]));
	};

	const selectedItems = useMemo(() => {
		return [
			...selectedGuideIds.map((id) => `guide-${id}`),
			...selectedGroupsIds.map((id) => `group-${id}`),
			...selectedElementIds.map((id) => `element-${id}`)
		];
	}, [selectedGuideIds, selectedGroupsIds, selectedElementIds]);

	const moveItem = (parentKey, fromIndex, toIndex) => {
		setTreeItems((prevItems) => {
			const updateTree = (nodes) => {
				return nodes.map((node) => {
					if (node.key === parentKey) {
						const newChildren = [...node.children];
						const [movedItem] = newChildren.splice(fromIndex, 1);
						newChildren.splice(toIndex, 0, movedItem);
						return { ...node, children: newChildren };
					}
					if (node.children) {
						return { ...node, children: updateTree(node.children) };
					}
					return node;
				});
			};
			return updateTree(prevItems);
		});
	};

	return (
		<NewFacadeTreeViewContext.Provider
			value={{
				items: treeItems,
				selectedItems,
				moveItem,
				expandedItems,
				handleExpandedItemsChange,
				isItemSelectable,
				handleSelectItem,
				handleToggleExpand
			}}
		>
			{children}
		</NewFacadeTreeViewContext.Provider>
	);
};

export const useNewFacadeTreeView = () => useContext(NewFacadeTreeViewContext);
