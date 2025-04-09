import React, {useRef, useState} from "react";
import { useDrag, useDrop } from "react-dnd";
import { Card, Form } from "react-bootstrap";
import { ChevronDown, ChevronRight, Eye, EyeSlash, ArrowsMove } from "react-bootstrap-icons";
import { useNewFacadeTreeView } from "@contexts/facades_view/NewFacadeTreeViewContext";
import { useFacadeViewPage } from "@contexts/facades_view/FacadeViewPageContext";
import IconButton from "@components/common/icon/IconButton";

const ITEM_TYPE = "TREE_ITEM";

const NewTreeViewItem = React.memo(({ item, parentKey, index }) => {
	const { isItemSelectable, selectedItems, expandedItems, handleToggleExpand, moveItem } = useNewFacadeTreeView();
	const { isGroupHidden, toggleGroupHidden, toggleGroupSelection, toggleGuideSelection, toggleElementSelection } = useFacadeViewPage();

	const ref = useRef(null);

	// DRAG (перетаскиваемый элемент)
	const [{ isDragging }, drag] = useDrag({
		type: ITEM_TYPE,
		item: { key: item.key, parentKey, index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	// DROP (место вставки)
	const [, drop] = useDrop({
		accept: ITEM_TYPE,
		hover: (draggedItem) => {
			if (draggedItem.index !== index && draggedItem.parentKey === parentKey) {
				moveItem(parentKey, draggedItem.index, index);
				draggedItem.index = index;
			}
		}
	});

	drag(drop(ref));

	const toggleSelectionMap = {
		guide: toggleGuideSelection,
		group: toggleGroupSelection,
		element: toggleElementSelection,
	};

	const handleSelect = () => {
		if (isItemSelectable(item) && toggleSelectionMap[item.entityType]) {
			toggleSelectionMap[item.entityType](item.entityId, !isSelected);
		}
	};

	const hasChildren = item.children && item.children.length > 0;
	const isExpanded = expandedItems?.includes(item.key);
	const isSelected = selectedItems?.includes(item.key);
	const [isHidden, setIsHidden] = useState(isGroupHidden(item.entityId));

	const handleToggleHidden = () => {
		const groupId = item.entityId;
		const newHiddenState = !isHidden;
		setIsHidden(newHiddenState);
		toggleGroupHidden(groupId, newHiddenState);
	};

	return (
		<Card
			ref={ref}
			className={`rounded-0 border border-1 border-end-0 border-bottom-0 ${isDragging ? "opacity-50" : ""}`}
		>
			<Card.Header className="px-2px py-0 d-flex justify-content-between align-items-center gap-2px cursor-pointer rounded-0">
				<div className="d-flex align-items-left justify-content-center gap-2px">
					{hasChildren && (
						<IconButton
							icon={isExpanded ? ChevronDown : ChevronRight}
							onClick={() => handleToggleExpand(item.key)}
							variant="outline-secondary"
							className="border-0"
						/>
					)}
					{item.selectable && <Form.Check type="checkbox" checked={isSelected} onChange={handleSelect} />}
					<div>{item.label}</div>
				</div>
				<div className="d-flex justify-content-center align-items-center gap-2">
					<IconButton icon={ArrowsMove} variant="outline-secondary border-0" />
					{item.hiddable && (
						<IconButton
							icon={isHidden ? EyeSlash : Eye}
							onClick={handleToggleHidden}
							variant="outline-secondary"
							className="border-0"
						/>
					)}
				</div>
			</Card.Header>
			{hasChildren && isExpanded && (
				<Card.Body className="p-0" style={{ marginLeft: "15px" }}>
					{item.children.map((child, i) => (
						<NewTreeViewItem key={child.key} item={child} parentKey={item.key} index={i} />
					))}
				</Card.Body>
			)}
		</Card>
	);
});

export default NewTreeViewItem;
